"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { io } from "socket.io-client";
import Logo from "@/shared/components/Logo/Logo";
import { useAppSelector } from "@/store/hooks";
import styles from "./DashboardInterface.module.css";

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const initialProjectForm = { name: "" };
const initialTeamForm = {
  name: "",
  email: "",
  work: "",
  employmentStartsAt: "",
  employmentEndsAt: "",
};
const initialTeamGroupForm = {
  name: "",
  focus: "",
  members: [],
};
const initialIncidentForm = {
  title: "",
  description: "",
  severity: "MEDIUM",
  publicStatus: "DEGRADED",
};


const navItems = [
  { label: "Overview", icon: "grid", href: "/dashboard", view: "overview" },
  { label: "Incidents", icon: "pulse", href: "/dashboard/incidents", view: "incidents" },
  { label: "Projects", icon: "folder", href: "/dashboard/projects", view: "projects" },
  { label: "Deployments", icon: "rocket", href: "/dashboard/deployments" },
  { label: "Teams", icon: "users", href: "/dashboard/teams", view: "teams" },
  { label: "Logs", icon: "terminal", href: "/dashboard/logs", view: "logs" },
  { label: "Builder", icon: "rocket", href: "/create" },
];

const pageContent = {
  overview: {
    eyebrow: "Workspace overview",
    title: "Command Center",
    subtitle: "Live signal for your CONCH workspace.",
  },
  incidents: {
    eyebrow: "Incident command",
    title: "Incidents",
    subtitle: "Assign teams, edit AI timelines, track developer logs, and generate postmortems.",
  },
  projects: {
    eyebrow: "Monitored surfaces",
    title: "Projects",
    subtitle: "Create monitored projects and copy package API keys for error ingestion.",
  },
  teams: {
    eyebrow: "Responder management",
    title: "Teams",
    subtitle: "Add employees, group responders, and prepare squads for manager assignment.",
  },
  logs: {
    eyebrow: "Runtime intelligence",
    title: "Logs",
    subtitle: "Review captured package errors, AI severity, root cause, and probable fixes.",
  },
};

const severityWeight = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

function Icon({ type }) {
  const paths = {
    bell: "M10 17a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm5-5V9a5 5 0 0 0-4-4.9V3a1 1 0 0 0-2 0v1.1A5 5 0 0 0 5 9v3l-1.3 2h12.6L15 12Z",
    folder: "M3 6h5l1.6 2H17v8H3V6Z",
    grid: "M3 3h5v5H3V3Zm9 0h5v5h-5V3ZM3 12h5v5H3v-5Zm9 0h5v5h-5v-5Z",
    pulse: "M2 11h4l2-6 4 10 2-4h4",
    rocket: "M11 3c3.6.3 5.7 2.4 6 6l-4.5 4.5-4-4L11 3Zm-3 8-3 1-2 5 5-2 1-3m-1-1 4 4",
    search: "M9 15a6 6 0 1 1 4.2-1.8L17 17",
    settings: "M10 3l1 2 2.2.8 2.1-.9 1.4 2-1.7 1.6.1 2.4 1.7 1.6-1.4 2-2.1-.9-2.2.8-1 2H7.8l-1-2-2.2-.8-2.1.9-1.4-2 1.7-1.6-.1-2.4L1 6.9l1.4-2 2.1.9 2.2-.8 1-2H10Zm-1 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    shield: "M10 3 17 6v5c0 4-2.8 6.3-7 7-4.2-.7-7-3-7-7V6l7-3Z",
    spark: "M10 2l1.7 5 5.3 1.3-4.4 3.2.4 5.5-3-4.5-5 2.1 3.2-4.5L4.6 6l5.4 1.3L10 2Z",
    terminal: "M3 5h14v10H3V5Zm3 3 2 2-2 2m4 0h4",
    users: "M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2 17a5 5 0 0 1 10 0m1 0a4 4 0 0 1 5-3.8",
  };

  return (
    <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  );
}

const getInitials = (value = "CN") =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CN";

const getDateInputValue = (offsetDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

export default function DashboardInterface({ view = "overview" }) {
  const pathname = usePathname();
  const { user, isAuthenticated, status: authStatus } = useAppSelector((state) => state.user);
  const [projects, setProjects] = useState([]);
  const [employeeTeams, setEmployeeTeams] = useState([]);
  const [selectedEmployeeTeamId, setSelectedEmployeeTeamId] = useState("");
  const [teamMessages, setTeamMessages] = useState([]);
  const [teamChatDraft, setTeamChatDraft] = useState("");
  const [teamChatStatus, setTeamChatStatus] = useState("Disconnected");
  const [team, setTeam] = useState([]);
  const [teams, setTeams] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [teamForm, setTeamForm] = useState({
    ...initialTeamForm,
    employmentStartsAt: getDateInputValue(0),
  });
  const [teamGroupForm, setTeamGroupForm] = useState(initialTeamGroupForm);
  const [updateDrafts, setUpdateDrafts] = useState({});
  const [timelineDrafts, setTimelineDrafts] = useState({});
  const [incidentForm, setIncidentForm] = useState(initialIncidentForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMemberSearchTerm, setTeamMemberSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const selectedProjectRef = useRef("");
  const currentView = pageContent[view] ? view : "overview";
  const page = pageContent[currentView];
  const showOverview = currentView === "overview";
  const showProjects = showOverview || currentView === "projects";
  const showTeams = showOverview || currentView === "teams";
  const showIncidents = showOverview || currentView === "incidents";
  const showLogs = showOverview || currentView === "logs";

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === selectedProjectId),
    [projects, selectedProjectId],
  );
  const selectedEmployeeTeam = useMemo(
    () => employeeTeams.find((teamItem) => teamItem._id === selectedEmployeeTeamId),
    [employeeTeams, selectedEmployeeTeamId],
  );
  const teamSocketRef = useRef(null);

  useEffect(() => {
    selectedProjectRef.current = selectedProjectId;
  }, [selectedProjectId]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  const filteredLogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return logs;

    return logs.filter((log) =>
      [
        log.errorName,
        log.errorMessage,
        log.metadata?.url,
        log.aiReport?.rootCause,
        log.aiReport?.solution,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [logs, searchTerm]);

  const filteredTeamMembers = useMemo(() => {
    const term = teamMemberSearchTerm.trim().toLowerCase();
    if (!term) return team;

    return team.filter((member) =>
      [member.name, member.email, member.work]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [team, teamMemberSearchTerm]);
  const hasTeamMemberSearch = Boolean(teamMemberSearchTerm.trim());

  const incidentQueue = useMemo(() => {
    return [...incidents].sort((a, b) => {
      const severityDiff = (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
      if (severityDiff) return severityDiff;
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });
  }, [incidents]);

  const activeIncidents = incidents.filter((incident) => incident.status !== "RESOLVED");
  const analyzedLogs = logs.filter((log) => log.status === "ANALYZED");
  const highRiskLogs = logs.filter((log) => ["HIGH", "CRITICAL"].includes(log.aiReport?.severity));
  const operationalStatus =
    activeIncidents.some((incident) => incident.publicStatus === "MAJOR_OUTAGE")
      ? "Major outage"
      : activeIncidents.some((incident) => incident.publicStatus === "PARTIAL_OUTAGE")
        ? "Partial outage"
        : activeIncidents.length
          ? "Degraded"
          : "Operational";

  const metrics = [
    {
      label: "Open Incidents",
      value: String(activeIncidents.length).padStart(2, "0"),
      change: activeIncidents.length ? "Needs eyes" : "Clear",
      tone: activeIncidents.length ? "warn" : "good",
      icon: "pulse",
    },
    {
      label: "Teams",
      value: String(teams.length).padStart(2, "0"),
      change: `${team.length} employees`,
      tone: teams.length ? "good" : "warn",
      icon: "users",
    },
    {
      label: "AI Reports",
      value: String(analyzedLogs.length).padStart(2, "0"),
      change: `${logs.length} logs`,
      tone: analyzedLogs.length ? "good" : "warn",
      icon: "spark",
    },
    {
      label: "High Risk Logs",
      value: String(highRiskLogs.length).padStart(2, "0"),
      change: operationalStatus,
      tone: highRiskLogs.length ? "warn" : "good",
      icon: "shield",
    },
  ];

  const bars = useMemo(() => {
    const labels = ["PENDING", "ANALYZED", "FAILED", "LOW", "MEDIUM", "HIGH"];
    const counts = labels.map((label) => {
      if (["LOW", "MEDIUM", "HIGH"].includes(label)) {
        return logs.filter((log) => log.aiReport?.severity === label).length;
      }
      return logs.filter((log) => log.status === label).length;
    });
    const max = Math.max(...counts, 1);

    return labels.map((label, index) => ({
      label,
      value: Math.max((counts[index] / max) * 100, counts[index] ? 22 : 6),
      count: counts[index],
      tone: index < 2 ? "soft" : index < 4 ? "mid" : index === 4 ? "strong" : "deep",
    }));
  }, [logs]);

  const loadProjectDetails = useCallback(async (projectId) => {
    if (!projectId) {
      setIncidents([]);
      setLogs([]);
      return;
    }

    const [incidentsResponse, logsResponse] = await Promise.all([
      backendApi.get(`/api/incidents/project/${projectId}`),
      backendApi.get(`/api/logs/project/${projectId}`),
    ]);

    setIncidents(incidentsResponse.data.incidents || []);
    setLogs(logsResponse.data.logs || []);
  }, []);

  const loadEmployeeTeams = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await backendApi.get("/api/teams/mine");
      const nextTeams = data.teams || [];
      setEmployeeTeams(nextTeams);
      const nextTeamId = selectedEmployeeTeamId && nextTeams.some((teamItem) => teamItem._id === selectedEmployeeTeamId)
        ? selectedEmployeeTeamId
        : nextTeams[0]?._id || "";
      setSelectedEmployeeTeamId(nextTeamId);

      if (nextTeamId) {
        const messagesResponse = await backendApi.get(`/api/chat/teams/${nextTeamId}/messages`);
        setTeamMessages(messagesResponse.data.messages || []);
      } else {
        setTeamMessages([]);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setEmployeeTeams([]);
      setTeamMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmployeeTeamId]);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [projectsResponse, teamResponse, teamsResponse] = await Promise.all([
        backendApi.get("/api/projects"),
        backendApi.get("/api/auth/employees"),
        backendApi.get("/api/teams"),
      ]);

      const nextProjects = projectsResponse.data.projects || [];
      setProjects(nextProjects);
      setTeam(teamResponse.data.employees || []);
      setTeams(teamsResponse.data.teams || []);

      const preferredProjectId = selectedProjectRef.current;
      const nextSelectedProjectId =
        preferredProjectId && nextProjects.some((project) => project._id === preferredProjectId)
          ? preferredProjectId
          : nextProjects[0]?._id || "";

      setSelectedProjectId(nextSelectedProjectId);
      await loadProjectDetails(nextSelectedProjectId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setProjects([]);
      setTeam([]);
      setTeams([]);
      setIncidents([]);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [loadProjectDetails]);

  useEffect(() => {
    if (authStatus === "loading") return;

    const timeout = window.setTimeout(() => {
      if (user?.role === "EMPLOYEE") {
        loadEmployeeTeams();
      } else {
        loadDashboard();
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [authStatus, loadDashboard, loadEmployeeTeams, user?.role]);

  const handleProjectChange = async (event) => {
    const projectId = event.target.value;
    setSelectedProjectId(projectId);
    setError("");

    try {
      await loadProjectDetails(projectId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const createProject = async (event) => {
    event.preventDefault();
    const name = projectForm.name.trim();
    if (!name) return;

    setIsSaving("project");
    setError("");
    setNotice("");

    try {
      const { data } = await backendApi.post("/api/projects", { name });
      setProjectForm(initialProjectForm);
      setNotice(`${data.project.name} is ready. Copy the API key from the project list.`);
      await loadDashboard();
      setSelectedProjectId(data.project._id);
      await loadProjectDetails(data.project._id);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const handleEmployeeTeamChange = async (event) => {
    const teamId = event.target.value;
    setSelectedEmployeeTeamId(teamId);
    setError("");

    try {
      const { data } = await backendApi.get(`/api/chat/teams/${teamId}/messages`);
      setTeamMessages(data.messages || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  useEffect(() => {
    if (user?.role !== "EMPLOYEE" || !selectedEmployeeTeamId) return undefined;

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    teamSocketRef.current = socket;

    socket.on("connect", () => {
      setTeamChatStatus("Connected");
      socket.emit("team_chat:join", { teamId: selectedEmployeeTeamId }, (response) => {
        if (!response?.success) {
          setTeamChatStatus(response?.message || "Join failed");
        }
      });
    });

    socket.on("connect_error", (socketError) => {
      setTeamChatStatus(socketError.message || "Connection failed");
    });

    socket.on("team_chat:new_message", ({ teamId, message } = {}) => {
      if (teamId !== selectedEmployeeTeamId || !message?._id) return;
      setTeamMessages((current) =>
        current.some((item) => item._id === message._id) ? current : [...current, message],
      );
    });

    return () => {
      socket.emit("team_chat:leave", { teamId: selectedEmployeeTeamId });
      socket.disconnect();
      teamSocketRef.current = null;
    };
  }, [selectedEmployeeTeamId, user?.role]);

  const sendTeamMessage = async (event) => {
    event.preventDefault();
    const message = teamChatDraft.trim();

    if (!message || !selectedEmployeeTeamId) return;

    setTeamChatDraft("");

    const socket = teamSocketRef.current;
    if (socket?.connected) {
      socket.emit("team_chat:message", { teamId: selectedEmployeeTeamId, message }, (response) => {
        if (!response?.success) {
          setError(response?.message || "Message failed");
        }
      });
      return;
    }

    try {
      const { data } = await backendApi.post(`/api/chat/teams/${selectedEmployeeTeamId}/messages`, { message });
      setTeamMessages((current) => [...current, data.chatMessage]);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const createTeamMember = async (event) => {
    event.preventDefault();
    setIsSaving("team");
    setError("");
    setNotice("");

    try {
      const payload = {
        ...teamForm,
        name: teamForm.name.trim(),
        email: teamForm.email.trim(),
        work: teamForm.work.trim(),
        employmentStartsAt: teamForm.employmentStartsAt || undefined,
        employmentEndsAt: teamForm.employmentEndsAt || null,
      };

      const { data } = await backendApi.post("/api/auth/employees", payload);
      setTeamForm({
        ...initialTeamForm,
        employmentStartsAt: getDateInputValue(0),
      });
      setNotice(
        data.employee?.invite?.emailQueued === false
          ? `Team member created. Email failed, temporary password: ${data.employee.invite.temporaryPassword}`
          : "Team member created and credentials email queued.",
      );
      await loadDashboard();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const deleteTeamMember = async (employeeId) => {
    setIsSaving(employeeId);
    setError("");
    setNotice("");

    try {
      await backendApi.delete(`/api/auth/employees/${employeeId}`);
      setNotice("Team member removed.");
      await loadDashboard();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const toggleTeamMember = (memberId) => {
    setTeamGroupForm((current) => {
      const members = current.members.includes(memberId)
        ? current.members.filter((id) => id !== memberId)
        : [...current.members, memberId];

      return { ...current, members };
    });
  };

  const createTeamGroup = async (event) => {
    event.preventDefault();
    if (!teamGroupForm.name.trim()) return;

    setIsSaving("teamGroup");
    setError("");
    setNotice("");

    try {
      await backendApi.post("/api/teams", {
        name: teamGroupForm.name.trim(),
        focus: teamGroupForm.focus.trim(),
        members: teamGroupForm.members,
      });
      setTeamGroupForm(initialTeamGroupForm);
      setNotice("Team created and ready for incident assignment.");
      await loadDashboard();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const createIncident = async (event) => {
    event.preventDefault();
    if (!selectedProjectId || !incidentForm.title.trim()) return;

    setIsSaving("incident");
    setError("");
    setNotice("");

    try {
      await backendApi.post("/api/incidents", {
        ...incidentForm,
        projectId: selectedProjectId,
        title: incidentForm.title.trim(),
        description: incidentForm.description.trim(),
      });
      setIncidentForm(initialIncidentForm);
      setNotice("Incident opened for the selected project.");
      await loadProjectDetails(selectedProjectId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const assignTeamToIncident = async (incidentId, teamId) => {
    if (!teamId) return;

    setIsSaving(`${incidentId}-team`);
    setError("");
    setNotice("");

    try {
      const { data } = await backendApi.post(`/api/incidents/${incidentId}/team`, { teamId });
      setNotice(`${data.incident.assignedTeam?.name || "Team"} assigned to the incident.`);
      await loadProjectDetails(selectedProjectId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const postIncidentUpdate = async (incidentId) => {
    const message = updateDrafts[incidentId]?.trim();
    if (!message) return;

    setIsSaving(`${incidentId}-update`);
    setError("");
    setNotice("");

    try {
      await backendApi.post(`/api/incidents/${incidentId}/updates`, {
        message,
        isPublic: true,
      });
      setUpdateDrafts((current) => ({ ...current, [incidentId]: "" }));
      setNotice("Developer update added to the log.");
      await loadProjectDetails(selectedProjectId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const updateTimelineDraft = (incidentId, stepId, field, value) => {
    setTimelineDrafts((current) => {
      const incident = incidents.find((item) => item._id === incidentId);
      const existingSteps = current[incidentId] || incident?.timelinePlan || [];
      const nextSteps = existingSteps.map((step) =>
        (step._id || step.title) === stepId ? { ...step, [field]: value } : step,
      );

      return { ...current, [incidentId]: nextSteps };
    });
  };

  const saveTimelinePlan = async (incidentId) => {
    const incident = incidents.find((item) => item._id === incidentId);
    const timelinePlan = timelineDrafts[incidentId] || incident?.timelinePlan || [];

    setIsSaving(`${incidentId}-timeline`);
    setError("");
    setNotice("");

    try {
      await backendApi.patch(`/api/incidents/${incidentId}`, { timelinePlan });
      setTimelineDrafts((current) => {
        const next = { ...current };
        delete next[incidentId];
        return next;
      });
      setNotice("AI timeline saved.");
      await loadProjectDetails(selectedProjectId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const generatePostmortem = async (incidentId) => {
    setIsSaving(`${incidentId}-postmortem`);
    setError("");
    setNotice("");

    try {
      await backendApi.post(`/api/incidents/${incidentId}/postmortem`);
      setNotice("Postmortem report generated.");
      await loadProjectDetails(selectedProjectId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const updateIncidentStatus = async (incidentId, status) => {
    setIsSaving(incidentId);
    setError("");
    setNotice("");

    try {
      await backendApi.patch(`/api/incidents/${incidentId}`, { status });
      setNotice(`Incident moved to ${status.toLowerCase()}.`);
      await loadProjectDetails(selectedProjectId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const assignFirstResponder = async (incidentId) => {
    if (!team[0]?._id) {
      setError("Add a team member before assigning responders.");
      return;
    }

    setIsSaving(`${incidentId}-responder`);
    setError("");
    setNotice("");

    try {
      await backendApi.post(`/api/incidents/${incidentId}/responders`, {
        responders: [team[0]._id],
      });
      setNotice(`${team[0].name} assigned as responder.`);
      await loadProjectDetails(selectedProjectId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const logout = async () => {
    try {
      await backendApi.post("/api/auth/logout");
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  if (user?.role === "EMPLOYEE") {
    return (
      <main className={styles.dashboard}>
        <aside className={styles.sidebar} aria-label="Employee dashboard navigation">
          <Link href="/" className={styles.brand} aria-label="CONCH home">
            <Logo compact className={styles.brandMark} />
            <span>
              <strong>CONCH</strong>
              <small>Employee</small>
            </span>
          </Link>

          <nav className={styles.navList}>
            <Link className={`${styles.navItem} ${styles.activeNavItem}`} href="/dashboard">
              <Icon type="users" />
              <span>Team Chat</span>
            </Link>
            <Link className={styles.navItem} href="/create">
              <Icon type="rocket" />
              <span>Builder</span>
            </Link>
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.planBox}>
              <span>Signed in as</span>
              <strong>{user?.name || "Employee"}</strong>
              <small>{user?.email}</small>
            </div>
            <button className={styles.utilityButton} type="button" onClick={logout}>
              <Icon type="settings" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <section className={styles.workspace}>
          <header className={styles.topbar}>
            <Link href="/" className={styles.mobileBrand}>
              <Logo compact className={styles.brandMark} />
              <span>CONCH</span>
            </Link>
            <div className={styles.search}>
              <Icon type="search" />
              <input aria-label="Search teams" placeholder="Search team messages" readOnly />
            </div>
            <div className={styles.topActions}>
              <select
                className={styles.projectSelect}
                value={selectedEmployeeTeamId}
                onChange={handleEmployeeTeamChange}
                disabled={!employeeTeams.length}
                aria-label="Select team"
              >
                {employeeTeams.length ? (
                  employeeTeams.map((teamItem) => (
                    <option value={teamItem._id} key={teamItem._id}>
                      {teamItem.name}
                    </option>
                  ))
                ) : (
                  <option value="">No team assigned</option>
                )}
              </select>
              <button type="button" aria-label="Refresh employee dashboard" onClick={loadEmployeeTeams}>
                <Icon type="bell" />
              </button>
              <div className={styles.profile}>
                <span>{getInitials(user?.name)}</span>
                <strong>{user?.name}</strong>
              </div>
            </div>
          </header>

          <section className={styles.hero}>
            <div>
              <p>Employee workspace</p>
              <h1>Team Chat</h1>
              <span>Talk with your assigned team in realtime. Messages are saved to the backend.</span>
            </div>
            <div className={styles.rangeSelector} aria-label="Employee actions">
              <button className={styles.selectedRange} type="button" onClick={loadEmployeeTeams}>
                Refresh
              </button>
              <Link href="/create">Builder</Link>
              <button type="button" disabled>{teamChatStatus}</button>
            </div>
          </section>

          {error ? <p className={styles.errorBanner}>{error}</p> : null}
          {notice ? <p className={styles.noticeBanner}>{notice}</p> : null}
          {isLoading ? <section className={styles.loadingPanel}>Loading employee workspace...</section> : null}

          <section className={styles.employeeGrid}>
            <article className={`${styles.panel} ${styles.listPanel}`}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Assigned Teams</h2>
                  <p>Groups created by your manager.</p>
                </div>
              </div>
              <div className={styles.stackList}>
                {employeeTeams.length ? (
                  employeeTeams.map((teamItem) => (
                    <button
                      className={`${styles.listItem} ${
                        selectedEmployeeTeamId === teamItem._id ? styles.selectedListItem : ""
                      }`}
                      type="button"
                      key={teamItem._id}
                      onClick={() => handleEmployeeTeamChange({ target: { value: teamItem._id } })}
                    >
                      <span className={styles.initials}>{getInitials(teamItem.name)}</span>
                      <p>
                        <strong>{teamItem.name}</strong>
                        <small>{teamItem.focus || "General team"}</small>
                        <small>{teamItem.members?.length || 0} members</small>
                      </p>
                    </button>
                  ))
                ) : (
                  <p className={styles.emptyText}>Your manager has not added you to a team yet.</p>
                )}
              </div>
            </article>

            <article className={`${styles.panel} ${styles.teamChatPanel}`}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>{selectedEmployeeTeam?.name || "Team chat"}</h2>
                  <p>{selectedEmployeeTeam?.focus || "Realtime Socket.IO group chat."}</p>
                </div>
                <strong>{teamChatStatus}</strong>
              </div>

              <div className={styles.chatMessages} aria-live="polite">
                {teamMessages.length ? (
                  teamMessages.map((message) => (
                    <article
                      className={`${styles.chatBubble} ${
                        message.sender?._id === user?._id ? styles.myChatBubble : ""
                      }`}
                      key={message._id}
                    >
                      <strong>{message.sender?.name || "Team member"}</strong>
                      <p>{message.message}</p>
                    </article>
                  ))
                ) : (
                  <p className={styles.emptyText}>No messages yet. Start the team conversation.</p>
                )}
              </div>

              <form className={styles.chatComposer} onSubmit={sendTeamMessage}>
                <input
                  value={teamChatDraft}
                  onChange={(event) => setTeamChatDraft(event.target.value)}
                  placeholder="Write a team message"
                  disabled={!selectedEmployeeTeamId}
                  aria-label="Team message"
                />
                <button type="submit" disabled={!selectedEmployeeTeamId || !teamChatDraft.trim()}>
                  Send
                </button>
              </form>
            </article>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.dashboard}>
      <aside className={styles.sidebar} aria-label="Dashboard navigation">
        <Link href="/" className={styles.brand} aria-label="CONCH home">
          <Logo compact className={styles.brandMark} />
          <span>
            <strong>CONCH</strong>
            <small>Command Layer</small>
          </span>
        </Link>

        <nav className={styles.navList}>
          {navItems.map((item) => {
            const content = (
              <>
                <Icon type={item.icon} />
                <span>{item.label}</span>
              </>
            );

            return (
              <Link
                className={`${styles.navItem} ${item.view === currentView ? styles.activeNavItem : ""}`}
                href={item.href}
                key={item.label}
              >
                {content}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.planBox}>
            <span>Connected as</span>
            <strong>{user?.name || "Guest"}</strong>
            <i aria-hidden="true">
              <b />
            </i>
          </div>
          <Link className={styles.builderLink} href="/create">
            Open Builder
          </Link>
          <a className={styles.utilityLink} href="#support">
            Support
          </a>
          <button className={styles.utilityButton} type="button" onClick={logout}>
            Log Out
          </button>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <label className={styles.search}>
            <Icon type="search" />
            <input
              type="search"
              placeholder="Search logs, incidents, root causes..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <div className={styles.topActions}>
            <select
              className={styles.projectSelect}
              value={selectedProjectId}
              onChange={handleProjectChange}
              aria-label="Selected project"
            >
              <option value="">No project selected</option>
              {projects.map((project) => (
                <option value={project._id} key={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <button type="button" aria-label="Notifications">
              <Icon type="bell" />
            </button>
            <button type="button" aria-label="Settings">
              <Icon type="settings" />
            </button>
            <div className={styles.profile}>
              <span>{getInitials(user?.name || user?.email || "CN")}</span>
              <strong>{user?.name || "CONCH user"}</strong>
            </div>
          </div>
        </header>

        <div className={styles.mobileBrand}>
          <Logo compact className={styles.brandMark} />
          <span>CONCH</span>
        </div>

        <section className={styles.hero}>
          <div>
            <p>{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <span>
              {isAuthenticated
                ? `${page.subtitle} ${selectedProject?.name ? `Current project: ${selectedProject.name}.` : ""}`
                : "Sign in to load projects, incidents, and team operations."}
            </span>
          </div>

          <div className={styles.rangeSelector} aria-label="Workspace actions">
            <button className={styles.selectedRange} type="button" onClick={loadDashboard}>
              Refresh
            </button>
            <Link href="/dashboard/projects">Projects</Link>
            <Link href="/dashboard/teams">Teams</Link>
          </div>
        </section>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {notice ? <p className={styles.noticeBanner}>{notice}</p> : null}

        {isLoading ? (
          <section className={styles.loadingPanel}>Loading CONCH workspace...</section>
        ) : null}

        {showOverview ? <section className={styles.metricsGrid} aria-label="Workspace metrics">
          {metrics.map((metric) => (
            <article className={styles.metricCard} key={metric.label}>
              <div>
                <span className={styles.metricIcon}>
                  <Icon type={metric.icon} />
                </span>
                <b className={styles[metric.tone]}>{metric.change}</b>
              </div>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section> : null}

        {showProjects || showTeams || showIncidents ? <section className={styles.formsGrid}>
          {showProjects ? <article className={`${styles.panel} ${styles.formPanel}`} id="projects">
            <div className={styles.panelHeader}>
              <div>
                <h2>Create Project</h2>
                <p>Generate a monitored site and API key for the SDK.</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={createProject}>
              <label>
                <span>Project name</span>
                <input
                  value={projectForm.name}
                  onChange={(event) => setProjectForm({ name: event.target.value })}
                  placeholder="Marketing site"
                  required
                />
              </label>
              <button type="submit" disabled={isSaving === "project"}>
                {isSaving === "project" ? "Creating..." : "Create project"}
              </button>
            </form>
          </article> : null}

          {showTeams ? <article className={`${styles.panel} ${styles.formPanel}`} id="team">
            <div className={styles.panelHeader}>
              <div>
                <h2>Add Team Member</h2>
                <p>Create employee access and email temporary credentials.</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={createTeamMember}>
              <div className={styles.twoFields}>
                <label>
                  <span>Name</span>
                  <input
                    value={teamForm.name}
                    onChange={(event) => setTeamForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Mira Shah"
                    required
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={teamForm.email}
                    onChange={(event) => setTeamForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="mira@company.com"
                    required
                  />
                </label>
              </div>
              <label>
                <span>Role / work</span>
                <input
                  value={teamForm.work}
                  onChange={(event) => setTeamForm((current) => ({ ...current, work: event.target.value }))}
                  placeholder="Frontend incident responder"
                />
              </label>
              <div className={styles.twoFields}>
                <label>
                  <span>Starts</span>
                  <input
                    type="date"
                    value={teamForm.employmentStartsAt}
                    onChange={(event) =>
                      setTeamForm((current) => ({ ...current, employmentStartsAt: event.target.value }))
                    }
                  />
                </label>
                <label>
                  <span>Access until</span>
                  <input
                    type="date"
                    value={teamForm.employmentEndsAt}
                    onChange={(event) =>
                      setTeamForm((current) => ({ ...current, employmentEndsAt: event.target.value }))
                    }
                  />
                  <small>Leave blank for lifetime access.</small>
                </label>
              </div>
              <button type="submit" disabled={isSaving === "team"}>
                {isSaving === "team" ? "Adding..." : "Add team member"}
              </button>
            </form>
          </article> : null}

          {showTeams ? <article className={`${styles.panel} ${styles.formPanel}`} id="teams">
            <div className={styles.panelHeader}>
              <div>
                <h2>Make Team</h2>
                <p>Group employees into responder squads for incidents.</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={createTeamGroup}>
              <label>
                <span>Team name</span>
                <input
                  value={teamGroupForm.name}
                  onChange={(event) =>
                    setTeamGroupForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Auth recovery squad"
                  required
                />
              </label>
              <label>
                <span>Focus</span>
                <input
                  value={teamGroupForm.focus}
                  onChange={(event) =>
                    setTeamGroupForm((current) => ({ ...current, focus: event.target.value }))
                  }
                  placeholder="Authentication, sessions, checkout"
                />
              </label>
              <div className={styles.memberPicker}>
                {team.length ? (
                  <>
                    <div className={styles.memberSearch}>
                      <Icon type="search" />
                      <input
                        value={teamMemberSearchTerm}
                        onChange={(event) => setTeamMemberSearchTerm(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") event.preventDefault();
                        }}
                        placeholder="Search members by name, email, or role"
                        aria-label="Search members"
                      />
                      {hasTeamMemberSearch ? (
                        <button
                          type="button"
                          className={styles.memberSearchClear}
                          onClick={() => setTeamMemberSearchTerm("")}
                          aria-label="Clear member search"
                        >
                          Clear
                        </button>
                      ) : null}
                    </div>
                    <p className={styles.memberSearchMeta}>
                      {hasTeamMemberSearch
                        ? `Showing ${filteredTeamMembers.length} of ${team.length} members`
                        : `${team.length} members available`}
                    </p>
                    {filteredTeamMembers.length ? (
                      filteredTeamMembers.map((member) => (
                        <label
                          key={member._id}
                          className={`${styles.memberOption} ${
                            teamGroupForm.members.includes(member._id) ? styles.memberOptionSelected : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={teamGroupForm.members.includes(member._id)}
                            onChange={() => toggleTeamMember(member._id)}
                          />
                          <span className={styles.memberOptionInfo}>
                            <strong className={styles.memberOptionName}>{member.name}</strong>
                            <small className={styles.memberOptionMeta}>{member.work || member.email}</small>
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className={styles.emptyText}>No members match your search.</p>
                    )}
                  </>
                ) : (
                  <p className={styles.emptyText}>Add employees before creating teams.</p>
                )}
              </div>
              <button type="submit" disabled={isSaving === "teamGroup" || !team.length}>
                {isSaving === "teamGroup" ? "Creating..." : "Create team"}
              </button>
            </form>
          </article> : null}

          {showIncidents ? <article className={`${styles.panel} ${styles.formPanel}`} id="incidents">
            <div className={styles.panelHeader}>
              <div>
                <h2>Open Incident</h2>
                <p>Create an operational incident for the selected project.</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={createIncident}>
              <label>
                <span>Title</span>
                <input
                  value={incidentForm.title}
                  onChange={(event) => setIncidentForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Checkout error spike"
                  required
                  disabled={!selectedProjectId}
                />
              </label>
              <label>
                <span>Description</span>
                <textarea
                  value={incidentForm.description}
                  onChange={(event) =>
                    setIncidentForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="What changed, who is affected, and what CONCH noticed."
                  disabled={!selectedProjectId}
                />
              </label>
              <div className={styles.twoFields}>
                <label>
                  <span>Severity</span>
                  <select
                    value={incidentForm.severity}
                    onChange={(event) =>
                      setIncidentForm((current) => ({ ...current, severity: event.target.value }))
                    }
                    disabled={!selectedProjectId}
                  >
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                    <option>CRITICAL</option>
                  </select>
                </label>
                <label>
                  <span>Public status</span>
                  <select
                    value={incidentForm.publicStatus}
                    onChange={(event) =>
                      setIncidentForm((current) => ({ ...current, publicStatus: event.target.value }))
                    }
                    disabled={!selectedProjectId}
                  >
                    <option>OPERATIONAL</option>
                    <option>DEGRADED</option>
                    <option>PARTIAL_OUTAGE</option>
                    <option>MAJOR_OUTAGE</option>
                  </select>
                </label>
              </div>
              <button type="submit" disabled={!selectedProjectId || isSaving === "incident"}>
                {isSaving === "incident" ? "Opening..." : "Open incident"}
              </button>
            </form>
          </article> : null}
        </section> : null}

        {showOverview || showLogs ? <section className={styles.analyticsGrid}>
          <article className={`${styles.panel} ${styles.flowPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Log Flow</h2>
                <p>Runtime events and AI severity for the selected project.</p>
              </div>
              <strong>{filteredLogs.length} shown</strong>
            </div>

            <div className={styles.barChart} aria-label="Log flow by state">
              {bars.map((bar) => (
                <div className={styles.barItem} key={bar.label}>
                  <span
                    className={`${styles.bar} ${styles[bar.tone]}`}
                    style={{ "--bar-height": `${bar.value}%` }}
                    title={`${bar.label}: ${bar.count}`}
                  />
                  <small>{bar.label}</small>
                </div>
              ))}
            </div>
          </article>

          <article className={`${styles.panel} ${styles.healthPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Team & Status</h2>
                <p>Responder capacity and public status signal.</p>
              </div>
            </div>

            <div className={styles.ringWrap}>
              <div className={styles.ring}>
                <strong>{operationalStatus}</strong>
                <span>{team.length} responders</span>
              </div>
            </div>

            <div className={styles.regionList}>
              <div>
                <span className={styles.blue} />
                <p>Active incidents</p>
                <strong>{activeIncidents.length}</strong>
              </div>
              <div>
                <span className={styles.sky} />
                <p>Resolved incidents</p>
                <strong>{incidents.length - activeIncidents.length}</strong>
              </div>
              <div>
                <span className={styles.pale} />
                <p>Analyzed logs</p>
                <strong>{analyzedLogs.length}</strong>
              </div>
            </div>
          </article>
        </section> : null}

        {showProjects || showTeams ? <section className={styles.managementGrid}>
          {showProjects ? <article className={`${styles.panel} ${styles.listPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Projects</h2>
                <p>SDK keys and monitored surfaces.</p>
              </div>
            </div>
            <div className={styles.stackList}>
              {projects.length ? (
                projects.map((project) => (
                  <button
                    className={`${styles.listItem} ${
                      project._id === selectedProjectId ? styles.selectedListItem : ""
                    }`}
                    type="button"
                    key={project._id}
                    onClick={() => handleProjectChange({ target: { value: project._id } })}
                  >
                    <span className={styles.initials}>{getInitials(project.name)}</span>
                    <p>
                      <strong>{project.name}</strong>
                      <small>{project.apiKey || "API key hidden"}</small>
                    </p>
                  </button>
                ))
              ) : (
                <p className={styles.emptyText}>Create a project to start ingesting CONCH events.</p>
              )}
            </div>
          </article> : null}

          {showTeams ? <article className={`${styles.panel} ${styles.listPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Team</h2>
                <p>Employees linked to your manager account.</p>
              </div>
            </div>
            <div className={styles.stackList}>
              {team.length ? (
                team.map((member) => (
                  <div className={styles.teamItem} key={member._id}>
                    <span className={styles.initials}>{getInitials(member.name)}</span>
                    <p>
                      <strong>{member.name}</strong>
                      <small>{member.work || member.email}</small>
                      <small>
                        {member.employmentEndsAt
                          ? `Access until ${formatDate(member.employmentEndsAt)}`
                          : "Lifetime access"}
                      </small>
                    </p>
                    <button
                      type="button"
                      disabled={isSaving === member._id}
                      onClick={() => deleteTeamMember(member._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>Add team members so incidents can have responders.</p>
              )}
            </div>
          </article> : null}

          {showTeams ? <article className={`${styles.panel} ${styles.listPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Responder Teams</h2>
                <p>Squads the manager can assign to active incidents.</p>
              </div>
            </div>
            <div className={styles.stackList}>
              {teams.length ? (
                teams.map((group) => (
                  <div className={styles.teamItem} key={group._id}>
                    <span className={styles.initials}>{getInitials(group.name)}</span>
                    <p>
                      <strong>{group.name}</strong>
                      <small>{group.focus || "General incident response"}</small>
                      <small>
                        {(group.members || []).map((member) => member.name).join(", ") || "No members"}
                      </small>
                    </p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>Create a responder team to assign incidents faster.</p>
              )}
            </div>
          </article> : null}
        </section> : null}

        {showIncidents ? <section className={`${styles.panel} ${styles.incidentPanel}`}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Incident Queue</h2>
              <p>Active work ordered by operational risk.</p>
            </div>
            <span>{selectedProject?.name || "No project"}</span>
          </div>

          <div className={styles.table} role="table" aria-label="Incident queue">
            <div className={styles.tableHead} role="row">
              <span role="columnheader">Incident</span>
              <span role="columnheader">Responders</span>
              <span role="columnheader">Severity</span>
              <span role="columnheader">Status</span>
              <span role="columnheader">Actions</span>
            </div>

            {incidentQueue.length ? (
              incidentQueue.map((incident) => {
                const plan = timelineDrafts[incident._id] || incident.timelinePlan || [];

                return (
                  <div className={styles.incidentWorkItem} key={incident._id}>
                    <div className={styles.tableRow} role="row">
                      <div role="cell">
                        <span className={styles.initials}>{getInitials(incident.title)}</span>
                        <p>
                          <strong>{incident.title}</strong>
                          <small>{incident.description || "No description provided"}</small>
                          <small>
                            {incident.sourceLog?.aiReport?.where || incident.sourceLog?.metadata?.url || "AI source attached"}
                          </small>
                        </p>
                      </div>
                      <span role="cell">
                        {incident.assignedTeam?.name ||
                          (incident.responders?.length
                            ? incident.responders.map((responder) => responder.name).join(", ")
                            : "Unassigned")}
                      </span>
                      <span className={styles[`severity${incident.severity}`]} role="cell">
                        {incident.severity}
                      </span>
                      <select
                        className={styles.inlineSelect}
                        value={incident.status}
                        onChange={(event) => updateIncidentStatus(incident._id, event.target.value)}
                        aria-label="Incident status"
                      >
                        <option>OPEN</option>
                        <option>INVESTIGATING</option>
                        <option>IDENTIFIED</option>
                        <option>MONITORING</option>
                        <option>RESOLVED</option>
                      </select>
                      <span className={styles.rowActions} role="cell">
                        <select
                          className={styles.inlineSelect}
                          defaultValue={incident.assignedTeam?._id || ""}
                          onChange={(event) => assignTeamToIncident(incident._id, event.target.value)}
                          disabled={!teams.length || isSaving === `${incident._id}-team`}
                          aria-label="Assign team"
                        >
                          <option value="">Assign team</option>
                          {teams.map((group) => (
                            <option value={group._id} key={group._id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={isSaving === `${incident._id}-postmortem`}
                          onClick={() => generatePostmortem(incident._id)}
                        >
                          Postmortem
                        </button>
                      </span>
                    </div>

                    <div className={styles.incidentDetails}>
                      <div className={styles.timelineEditor}>
                        <div className={styles.detailHeader}>
                          <strong>AI timeline</strong>
                          <button
                            type="button"
                            disabled={isSaving === `${incident._id}-timeline`}
                            onClick={() => saveTimelinePlan(incident._id)}
                          >
                            Save edits
                          </button>
                        </div>
                        {plan.length ? (
                          plan.map((step, index) => (
                            <div className={styles.timelineStep} key={step._id || step.title}>
                              <span>{index + 1}</span>
                              <input
                                value={step.title}
                                onChange={(event) =>
                                  updateTimelineDraft(incident._id, step._id || step.title, "title", event.target.value)
                                }
                                aria-label="Timeline step title"
                              />
                              <input
                                value={step.description}
                                onChange={(event) =>
                                  updateTimelineDraft(
                                    incident._id,
                                    step._id || step.title,
                                    "description",
                                    event.target.value,
                                  )
                                }
                                aria-label="Timeline step description"
                              />
                              <select
                                value={step.status || "TODO"}
                                onChange={(event) =>
                                  updateTimelineDraft(incident._id, step._id || step.title, "status", event.target.value)
                                }
                                aria-label="Timeline step status"
                              >
                                <option>TODO</option>
                                <option>IN_PROGRESS</option>
                                <option>DONE</option>
                              </select>
                            </div>
                          ))
                        ) : (
                          <p className={styles.emptyText}>No AI timeline available yet.</p>
                        )}
                      </div>

                      <div className={styles.devUpdates}>
                        <div className={styles.detailHeader}>
                          <strong>Developer logs</strong>
                        </div>
                        <div className={styles.updateList}>
                          {incident.updates?.length ? (
                            incident.updates.slice(-3).map((update) => (
                              <p key={update._id}>
                                <strong>{update.author?.name || "Responder"}</strong>
                                <span>{update.message}</span>
                              </p>
                            ))
                          ) : (
                            <p className={styles.emptyText}>No developer updates yet.</p>
                          )}
                        </div>
                        <textarea
                          value={updateDrafts[incident._id] || ""}
                          onChange={(event) =>
                            setUpdateDrafts((current) => ({
                              ...current,
                              [incident._id]: event.target.value,
                            }))
                          }
                          placeholder="Add developer progress, fix status, or verification note"
                        />
                        <button
                          type="button"
                          disabled={isSaving === `${incident._id}-update`}
                          onClick={() => postIncidentUpdate(incident._id)}
                        >
                          Add log
                        </button>
                      </div>

                      {incident.postmortem ? (
                        <div className={styles.postmortemBox}>
                          <strong>AI postmortem</strong>
                          <p>{incident.postmortem.summary}</p>
                          <small>Root cause: {incident.postmortem.rootCause || "Needs review"}</small>
                          <small>Resolution: {incident.postmortem.resolution || "Needs review"}</small>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyTable}>No incidents for the selected project.</div>
            )}
          </div>
        </section> : null}

        {showLogs ? <section className={`${styles.panel} ${styles.incidentPanel}`} id="logs">
          <div className={styles.panelHeader}>
            <div>
              <h2>Recent Logs</h2>
              <p>Latest error events from the selected project.</p>
            </div>
          </div>

          <div className={styles.logList}>
            {filteredLogs.length ? (
              filteredLogs.slice(0, 8).map((log) => (
                <article className={styles.logItem} key={log._id}>
                  <span className={styles[`severity${log.aiReport?.severity || "Low"}`]}>
                    {log.aiReport?.severity || log.status}
                  </span>
                  <p>
                    <strong>{log.errorName || "Runtime Error"}</strong>
                    <small>{log.errorMessage}</small>
                    <small>{log.metadata?.url || "No URL captured"}</small>
                    <small>{log.aiReport?.where ? `Where: ${log.aiReport.where}` : "Where: pending AI analysis"}</small>
                    <small>{log.aiReport?.solution ? `Probable solution: ${log.aiReport.solution}` : "Solution: pending"}</small>
                  </p>
                </article>
              ))
            ) : (
              <div className={styles.emptyTable}>No logs match this view.</div>
            )}
          </div>
        </section> : null}
      </section>
    </main>
  );
}
