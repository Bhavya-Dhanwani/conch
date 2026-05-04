import { catchAsync } from "../Utilities/catchAsync.js";
import * as incidentServices from "../Services/incident.service.js";

export const createIncident = catchAsync(async (req, res) => {
  const incident = await incidentServices.createIncident(req.user, req.body);

  return res.status(201).json({
    success: true,
    message: "Incident created successfully",
    incident,
  });
});

export const getProjectIncidents = catchAsync(async (req, res) => {
  const incidents = await incidentServices.getProjectIncidents(
    req.user,
    req.params.projectId,
  );

  return res.status(200).json({
    success: true,
    message: "Incidents fetched successfully",
    incidents,
  });
});

export const getIncidentById = catchAsync(async (req, res) => {
  const incident = await incidentServices.getIncidentById(
    req.user,
    req.params.incidentId,
  );

  return res.status(200).json({
    success: true,
    message: "Incident fetched successfully",
    incident,
  });
});

export const updateIncident = catchAsync(async (req, res) => {
  const incident = await incidentServices.updateIncident(
    req.user,
    req.params.incidentId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Incident updated successfully",
    incident,
  });
});

export const assignResponders = catchAsync(async (req, res) => {
  const incident = await incidentServices.assignResponders(
    req.user,
    req.params.incidentId,
    req.body.responders || req.body.responderIds,
  );

  return res.status(200).json({
    success: true,
    message: "Responders assigned successfully",
    incident,
  });
});

export const assignTeam = catchAsync(async (req, res) => {
  const incident = await incidentServices.assignTeam(
    req.user,
    req.params.incidentId,
    req.body.teamId,
  );

  return res.status(200).json({
    success: true,
    message: "Team assigned successfully",
    incident,
  });
});

export const addIncidentUpdate = catchAsync(async (req, res) => {
  const incident = await incidentServices.addIncidentUpdate(
    req.user,
    req.params.incidentId,
    req.body,
  );

  return res.status(201).json({
    success: true,
    message: "Incident update posted successfully",
    incident,
  });
});

export const generatePostmortem = catchAsync(async (req, res) => {
  const incident = await incidentServices.generatePostmortem(
    req.user,
    req.params.incidentId,
  );

  return res.status(200).json({
    success: true,
    message: "Incident postmortem generated successfully",
    incident,
  });
});

export const getPublicProjectStatus = catchAsync(async (req, res) => {
  const status = await incidentServices.getPublicProjectStatus(
    req.params.projectId,
  );

  return res.status(200).json({
    success: true,
    message: "Public project status fetched successfully",
    status,
  });
});
