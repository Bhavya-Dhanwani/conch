import mongoose from "mongoose";

import Incidents from "../Models/incident.model.js";
import Logs from "../Models/log.model.js";
import Projects from "../Models/project.model.js";
import Users from "../Models/user.model.js";
import { AppError } from "../Utilities/appError.js";
import { generateIncidentPostmortem } from "./ai.service.js";
import { getProjectForUser } from "./project.service.js";

const activeStatuses = ["OPEN", "INVESTIGATING", "IDENTIFIED", "MONITORING"];
const editableFields = ["title", "description", "severity", "status", "publicStatus"];

const validateObjectId = (value, label) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
};

const getManagerId = (user) => {
  if (user.role === "MANAGER") return user._id;
  return user.managerId;
};

const normalizeIdList = (ids = []) => {
  const list = Array.isArray(ids) ? ids : [ids];
  return [...new Set(list.filter(Boolean).map((id) => String(id)))];
};

const validateTeamUsers = async (owner, userIds = []) => {
  const ids = normalizeIdList(userIds);
  if (!ids.length) return [];

  for (const id of ids) {
    validateObjectId(id, "user id");
  }

  const users = await Users.find({
    _id: { $in: ids },
    $or: [
      { _id: owner },
      { role: "EMPLOYEE", managerId: owner },
    ],
  })
    .select("_id")
    .lean();

  if (users.length !== ids.length) {
    throw new AppError("One or more responders are not part of this team", 400);
  }

  return users.map((user) => user._id);
};

const getIncidentForUser = async (user, incidentId) => {
  validateObjectId(incidentId, "incident id");

  const incident = await Incidents.findById(incidentId);
  if (!incident) {
    throw new AppError("Incident not found", 404);
  }

  await getProjectForUser(user, incident.projectId);
  return incident;
};

const createTimelineEntry = (type, message, author, metadata = {}) => ({
  type,
  message,
  author: author?._id || author || null,
  metadata,
});

const populateIncident = (query) => {
  return query
    .populate("responders", "name email role work")
    .populate("updates.author", "name email role")
    .populate("timeline.author", "name email role")
    .populate("sourceLog");
};

export const createIncident = async (user, payload = {}) => {
  const {
    projectId,
    title,
    description = "",
    severity = "MEDIUM",
    status = "OPEN",
    publicStatus = "DEGRADED",
    sourceLog,
    responders = [],
  } = payload;

  if (!title?.trim()) {
    throw new AppError("Incident title is required", 400);
  }

  const project = await getProjectForUser(user, projectId);

  if (sourceLog) {
    validateObjectId(sourceLog, "source log id");
    const log = await Logs.findOne({ _id: sourceLog, projectId: project._id }).lean();
    if (!log) {
      throw new AppError("Source log not found for this project", 404);
    }
  }

  const responderIds = await validateTeamUsers(project.owner, responders);

  const incident = await Incidents.create({
    projectId: project._id,
    owner: project.owner,
    sourceLog: sourceLog || null,
    title: title.trim(),
    description,
    severity,
    status,
    publicStatus,
    responders: responderIds,
    timeline: [
      createTimelineEntry("CREATED", "Incident created", user, {
        severity,
        status,
      }),
    ],
  });

  return populateIncident(Incidents.findById(incident._id)).lean();
};

export const getProjectIncidents = async (user, projectId) => {
  await getProjectForUser(user, projectId);

  return populateIncident(
    Incidents.find({ projectId }).sort({ createdAt: -1 }),
  ).lean();
};

export const getIncidentById = async (user, incidentId) => {
  await getIncidentForUser(user, incidentId);

  return populateIncident(Incidents.findById(incidentId)).lean();
};

export const updateIncident = async (user, incidentId, payload = {}) => {
  const incident = await getIncidentForUser(user, incidentId);
  const updatePayload = {};

  for (const field of editableFields) {
    if (payload[field] !== undefined) {
      updatePayload[field] = payload[field];
    }
  }

  if (!Object.keys(updatePayload).length) {
    throw new AppError("At least one editable incident field is required", 400);
  }

  if (updatePayload.status === "RESOLVED" && incident.status !== "RESOLVED") {
    updatePayload.resolvedAt = new Date();
  }

  if (updatePayload.status && updatePayload.status !== incident.status) {
    incident.timeline.push(
      createTimelineEntry(
        "STATUS_CHANGED",
        `Status changed from ${incident.status} to ${updatePayload.status}`,
        user,
        { from: incident.status, to: updatePayload.status },
      ),
    );
  }

  Object.assign(incident, updatePayload);
  await incident.save();

  return populateIncident(Incidents.findById(incident._id)).lean();
};

export const assignResponders = async (user, incidentId, responderIds = []) => {
  const incident = await getIncidentForUser(user, incidentId);
  const validResponders = await validateTeamUsers(incident.owner, responderIds);

  const currentIds = new Set(incident.responders.map((id) => String(id)));
  for (const responderId of validResponders) {
    currentIds.add(String(responderId));
  }

  incident.responders = [...currentIds];
  incident.timeline.push(
    createTimelineEntry("RESPONDER_ASSIGNED", "Responders assigned", user, {
      responders: validResponders,
    }),
  );
  await incident.save();

  return populateIncident(Incidents.findById(incident._id)).lean();
};

export const addIncidentUpdate = async (user, incidentId, payload = {}) => {
  const incident = await getIncidentForUser(user, incidentId);
  const { message, isPublic = true } = payload;

  if (!message?.trim()) {
    throw new AppError("Update message is required", 400);
  }

  incident.updates.push({
    message: message.trim(),
    author: user._id,
    isPublic,
  });
  incident.timeline.push(
    createTimelineEntry("UPDATE_POSTED", message.trim(), user, { isPublic }),
  );
  await incident.save();

  return populateIncident(Incidents.findById(incident._id)).lean();
};

export const generatePostmortem = async (user, incidentId) => {
  const incident = await getIncidentForUser(user, incidentId);
  const hydratedIncident = await populateIncident(
    Incidents.findById(incident._id),
  ).lean();

  const postmortem = await generateIncidentPostmortem(hydratedIncident);

  incident.postmortem = {
    ...postmortem,
    generatedBy: "AI",
    generatedAt: new Date(),
  };
  incident.timeline.push(
    createTimelineEntry("POSTMORTEM_GENERATED", "AI postmortem generated", user),
  );
  await incident.save();

  return populateIncident(Incidents.findById(incident._id)).lean();
};

export const getPublicProjectStatus = async (projectId) => {
  validateObjectId(projectId, "project id");

  const project = await Projects.findOne({ _id: projectId, isActive: true })
    .select("name")
    .lean();

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const incidents = await Incidents.find({
    projectId,
    status: { $in: activeStatuses },
  })
    .select("title description severity status publicStatus updates createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  const publicIncidents = incidents.map((incident) => ({
    ...incident,
    updates: incident.updates.filter((update) => update.isPublic),
  }));

  const currentStatus = publicIncidents.some(
    (incident) => incident.publicStatus === "MAJOR_OUTAGE",
  )
    ? "MAJOR_OUTAGE"
    : publicIncidents.some((incident) => incident.publicStatus === "PARTIAL_OUTAGE")
      ? "PARTIAL_OUTAGE"
      : publicIncidents.some((incident) => incident.publicStatus === "DEGRADED")
        ? "DEGRADED"
        : "OPERATIONAL";

  return {
    project,
    currentStatus,
    incidents: publicIncidents,
  };
};
