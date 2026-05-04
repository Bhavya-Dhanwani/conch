"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Logo from "@/shared/components/Logo/Logo";
import { useAppSelector } from "@/store/hooks";
import ConfirmDialog from "./ConfirmDialog";
import styles from "./DeploymentInterface.module.css";

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const initialForm = {
  name: "",
  repositoryFullName: "",
  rootDirectory: ".",
  environment: "production",
  defaultSubdomain: "",
  customDomain: "",
  environmentVariables: [{ key: "", value: "", environment: "all", isSecret: true }],
};

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

const getInitials = (value = "DP") =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "DP";

function Icon({ type }) {
  const paths = {
    deploy: "M10 2l6 4v7l-6 5-6-5V6l6-4Zm0 3L6.5 7.1v4.6L10 14l3.5-2.3V7.1L10 5Zm0 2.8 2 1.2-2 1.2L8 9l2-1.2Z",
    folder: "M3 6h5l1.6 2H17v8H3V6Z",
    github: "M10 2a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2 .4-2.5-.8-2.5-.8-.3-.8-.8-1-.8-1-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.5.8-2-.1-.2-.4-1 .1-2 0 0 .7-.2 2.1.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.1-.8 2.1-.8.5 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.8-1.7 3.4-3.3 3.6.3.2.5.7.5 1.4v2.1c0 .2.1.5.5.4A8 8 0 0 0 10 2Z",
    grid: "M3 3h5v5H3V3Zm9 0h5v5h-5V3ZM3 12h5v5H3v-5Zm9 0h5v5h-5v-5Z",
    link: "M7.5 11.5 12.5 6.5M8.5 5.5l1-1a3 3 0 0 1 4.2 4.2l-1 1M11.5 14.5l-1 1a3 3 0 0 1-4.2-4.2l1-1",
    pulse: "M2 11h4l2-6 4 10 2-4h4",
    refresh: "M15 6a6 6 0 1 0 1 5m-1-5V3h3",
    rocket: "M11 3c3.6.3 5.7 2.4 6 6l-4.5 4.5-4-4L11 3Zm-3 8-3 1-2 5 5-2 1-3m-1-1 4 4",
    terminal: "M3 5h14v10H3V5Zm3 3 2 2-2 2m4 0h4",
    users: "M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2 17a5 5 0 0 1 10 0m1 0a4 4 0 0 1 5-3.8",
  };

  return (
    <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  );
}

export default function DeploymentInterface() {
  const { user, status: authStatus } = useAppSelector((state) => state.user);
  const [repositories, setRepositories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const selectedRepo = useMemo(
    () => repositories.find((repo) => repo.fullName === form.repositoryFullName),
    [form.repositoryFullName, repositories],
  );
  const readyProjects = projects.filter((project) => project.status === "READY").length;
  const queuedProjects = projects.filter((project) => project.status === "QUEUED").length;
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "bhavyadhanwani.dev";
  const cleanEnvironmentVariables = (variables) =>
    variables
      .map((variable) => ({
        ...variable,
        key: variable.key.trim(),
        value: variable.value.trim(),
      }))
      .filter((variable) => variable.key && variable.value);

  useEffect(() => {
    document.body.style.overflow = "";
    document.body.style.overflowY = "";
    document.documentElement.style.overflow = "";
    document.documentElement.style.overflowY = "";
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [reposResponse, projectsResponse] = await Promise.all([
        backendApi.get("/api/deployments/github/repos"),
        backendApi.get("/api/deployments/projects"),
      ]);
      const nextRepos = reposResponse.data.repositories || [];

      setRepositories(nextRepos);
      setProjects(projectsResponse.data.projects || []);
      setForm((current) => ({
        ...current,
        repositoryFullName: current.repositoryFullName || nextRepos[0]?.fullName || "",
      }));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setRepositories([]);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === "loading") return;

    const timeout = window.setTimeout(() => {
      loadData();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [authStatus, loadData]);

  const createDeploymentProject = async (event) => {
    event.preventDefault();

    if (!selectedRepo) {
      setError("Choose a GitHub repository first.");
      return;
    }

    setIsSaving("create");
    setError("");
    setNotice("");

    try {
      await backendApi.post("/api/deployments/projects", {
        name: form.name.trim() || selectedRepo.name,
        repository: selectedRepo,
        rootDirectory: form.rootDirectory.trim() || ".",
        environment: form.environment,
        defaultSubdomain: form.defaultSubdomain.trim(),
        customDomain: form.customDomain.trim(),
        environmentVariables: cleanEnvironmentVariables(form.environmentVariables),
      });
      setForm((current) => ({ ...initialForm, repositoryFullName: current.repositoryFullName }));
      setNotice("Deployment project prepared. Framework and language were detected automatically.");
      await loadData();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const queueDeployment = async (projectId) => {
    setIsSaving(projectId);
    setError("");
    setNotice("");

    try {
      const { data } = await backendApi.post(`/api/deployments/projects/${projectId}/deploy`);
      setProjects((current) => current.map((project) => (project._id === projectId ? data.project : project)));
      setNotice(`Deployment queued for ${data.project.liveUrl || data.project.defaultDomain}.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const removeDeployment = async () => {
    if (!deleteTarget) return;

    setIsSaving(`delete-${deleteTarget._id}`);
    setError("");
    setNotice("");

    try {
      await backendApi.delete(`/api/deployments/projects/${deleteTarget._id}`);
      setProjects((current) => current.filter((item) => item._id !== deleteTarget._id));
      setNotice(`Removed deployment project "${deleteTarget.name}".`);
      setDeleteTarget(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const updateEnvVariable = (index, field, value) => {
    setForm((current) => ({
      ...current,
      environmentVariables: current.environmentVariables.map((variable, variableIndex) =>
        variableIndex === index ? { ...variable, [field]: value } : variable,
      ),
    }));
  };

  const addEnvVariable = () => {
    setForm((current) => ({
      ...current,
      environmentVariables: [
        ...current.environmentVariables,
        { key: "", value: "", environment: "all", isSecret: true },
      ],
    }));
  };

  const removeEnvVariable = (index) => {
    setForm((current) => ({
      ...current,
      environmentVariables:
        current.environmentVariables.length === 1
          ? [{ key: "", value: "", environment: "all", isSecret: true }]
          : current.environmentVariables.filter((_, variableIndex) => variableIndex !== index),
    }));
  };

  return (
    <main className={styles.deployPage}>
      <button
        className={styles.mobileMenuButton}
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        Menu
      </button>
      {isSidebarOpen ? (
        <button
          className={styles.sidebarBackdrop}
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <Link href="/" className={styles.brand}>
          <Logo compact className={styles.brandMark} />
          <span>
            <strong>CONCH</strong>
            <small>Command Layer</small>
          </span>
        </Link>
        <button className={styles.closeSidebar} type="button" onClick={() => setIsSidebarOpen(false)}>
          Close
        </button>
        <nav className={styles.navList}>
          <Link href="/dashboard" onClick={() => setIsSidebarOpen(false)}>
            <Icon type="grid" />
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/incidents" onClick={() => setIsSidebarOpen(false)}>
            <Icon type="pulse" />
            <span>Incidents</span>
          </Link>
          <Link href="/dashboard/projects" onClick={() => setIsSidebarOpen(false)}>
            <Icon type="folder" />
            <span>Projects</span>
          </Link>
          <Link className={styles.activeNav} href="/dashboard/deployments" onClick={() => setIsSidebarOpen(false)}>
            <Icon type="rocket" />
            <span>Deployments</span>
          </Link>
          <Link href="/dashboard/teams" onClick={() => setIsSidebarOpen(false)}>
            <Icon type="users" />
            <span>Teams</span>
          </Link>
          <Link href="/dashboard/logs" onClick={() => setIsSidebarOpen(false)}>
            <Icon type="terminal" />
            <span>Logs</span>
          </Link>
          <Link href="/create" onClick={() => setIsSidebarOpen(false)}>
            <Icon type="rocket" />
            <span>Builder</span>
          </Link>
        </nav>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <p>Deployment center</p>
            <h1>Deployments</h1>
          </div>
          <div className={styles.topActions}>
            <a href={`${backendApi.defaults.baseURL}/api/auth/github/connect`}>
              <Icon type="github" />
              {user?.githubUsername ? "Reconnect GitHub" : "Connect GitHub"}
            </a>
            <button type="button" onClick={loadData}>
              <Icon type="refresh" />
              Refresh
            </button>
          </div>
        </header>

        {error ? <p className={styles.errorBanner}>{error}</p> : null}
        {notice ? <p className={styles.noticeBanner}>{notice}</p> : null}
        {isLoading ? <p className={styles.loadingBanner}>Loading deployment surface...</p> : null}

        <section className={styles.heroGrid}>
          <article className={styles.launchPanel}>
            <div className={styles.launchCopy}>
              <span>Auto-detect pipeline</span>
              <h2>Pick repo. We detect the stack.</h2>
              <p>
                CONCH reads GitHub metadata, package files, and lockfiles to detect Next.js, React,
                Node.js, or vanilla JS. Then it prepares a platform URL and optional custom domain.
              </p>
            </div>

            <form className={styles.deployForm} onSubmit={createDeploymentProject}>
              <label>
                <span>Repository</span>
                <select
                  value={form.repositoryFullName}
                  onChange={(event) => setForm((current) => ({ ...current, repositoryFullName: event.target.value }))}
                  disabled={!repositories.length}
                  required
                >
                  {repositories.length ? (
                    repositories.map((repo) => (
                      <option value={repo.fullName} key={repo.id}>
                        {repo.fullName}
                      </option>
                    ))
                  ) : (
                    <option value="">Connect GitHub to load repos</option>
                  )}
                </select>
              </label>

              <div className={styles.formGrid}>
                <label>
                  <span>Website name</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder={selectedRepo?.name || "launch-site"}
                  />
                </label>
                <label>
                  <span>Root directory</span>
                  <input
                    value={form.rootDirectory}
                    onChange={(event) => setForm((current) => ({ ...current, rootDirectory: event.target.value }))}
                    placeholder="."
                  />
                </label>
              </div>

              <div className={styles.formGrid}>
                <label>
                  <span>Platform subdomain</span>
                  <input
                    value={form.defaultSubdomain}
                    onChange={(event) => setForm((current) => ({ ...current, defaultSubdomain: event.target.value }))}
                    placeholder={selectedRepo?.name || "my-site"}
                  />
                  <small>{`Creates ${form.defaultSubdomain || selectedRepo?.name || "my-site"}.${platformDomain} from *.${platformDomain}`}</small>
                </label>
                <label>
                  <span>Custom domain</span>
                  <input
                    value={form.customDomain}
                    onChange={(event) => setForm((current) => ({ ...current, customDomain: event.target.value }))}
                    placeholder="www.customer.com"
                  />
                  <small>Optional</small>
                </label>
              </div>

              <label>
                <span>Environment</span>
                <select
                  value={form.environment}
                  onChange={(event) => setForm((current) => ({ ...current, environment: event.target.value }))}
                >
                  <option value="production">Production</option>
                  <option value="preview">Preview</option>
                </select>
              </label>

              <div className={styles.envEditor}>
                <div className={styles.envHeader}>
                  <span>Environment variables</span>
                  <button type="button" onClick={addEnvVariable}>
                    Add variable
                  </button>
                </div>
                {form.environmentVariables.map((variable, index) => (
                  <div className={styles.envRow} key={`create-env-${index}`}>
                    <input
                      value={variable.key}
                      onChange={(event) => updateEnvVariable(index, "key", event.target.value)}
                      placeholder="NEXT_PUBLIC_API_URL"
                    />
                    <input
                      value={variable.value}
                      onChange={(event) => updateEnvVariable(index, "value", event.target.value)}
                      placeholder="Value"
                      type={variable.isSecret ? "password" : "text"}
                    />
                    <select
                      value={variable.environment}
                      onChange={(event) => updateEnvVariable(index, "environment", event.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="production">Production</option>
                      <option value="preview">Preview</option>
                    </select>
                    <label className={styles.secretToggle}>
                      <input
                        checked={variable.isSecret}
                        onChange={(event) => updateEnvVariable(index, "isSecret", event.target.checked)}
                        type="checkbox"
                      />
                      Secret
                    </label>
                    <button type="button" onClick={() => removeEnvVariable(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={!repositories.length || isSaving === "create"}>
                <Icon type="deploy" />
                {isSaving === "create" ? "Preparing..." : "Prepare deployment"}
              </button>
            </form>
          </article>

          <aside className={styles.signalPanel}>
            <div>
              <span>{String(projects.length).padStart(2, "0")}</span>
              <p>Total deployment projects</p>
            </div>
            <div>
              <span>{String(readyProjects).padStart(2, "0")}</span>
              <p>Ready configs</p>
            </div>
            <div>
              <span>{String(queuedProjects).padStart(2, "0")}</span>
              <p>Queued builds</p>
            </div>
          </aside>
        </section>

        <section className={styles.projectGrid}>
          {projects.length ? (
            projects.map((project) => {
              const liveUrl = project.liveUrl || `https://${project.defaultDomain}`;

              return (
                <article className={styles.deployCard} key={project._id}>
                  <div className={styles.deployCardTop}>
                    <span>{getInitials(project.name)}</span>
                    <strong>{project.status}</strong>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.repository?.fullName}</p>
                  <div className={styles.detectedGrid}>
                    <span>{project.detectedFramework || project.framework}</span>
                    <span>{project.detectedLanguage || "Language detected"}</span>
                    <span>{project.packageManager}</span>
                    <span>{project.environment}</span>
                  </div>
                  <div className={styles.urlBox}>
                    <Icon type="link" />
                    {project.customDomain ? (
                      <a href={liveUrl} target="_blank" rel="noreferrer">
                        {liveUrl.replace("https://", "")}
                      </a>
                    ) : (
                      <span>{liveUrl.replace("https://", "")} · DNS pending</span>
                    )}
                  </div>
                  {project.customDomain ? <p className={styles.customDomain}>Custom: {project.customDomain}</p> : null}
                  <div className={styles.cardActions}>
                    <button type="button" disabled={isSaving === project._id} onClick={() => queueDeployment(project._id)}>
                      <Icon type="rocket" />
                      {isSaving === project._id ? "Queuing..." : "Deploy"}
                    </button>
                    <button
                      className={styles.dangerButton}
                      type="button"
                      disabled={isSaving === `delete-${project._id}`}
                      onClick={() => setDeleteTarget(project)}
                    >
                      {isSaving === `delete-${project._id}` ? "Removing..." : "Remove"}
                    </button>
                  </div>
                  <Link className={styles.detailsLink} href={`/dashboard/deployments/${project._id}`}>
                    View deployment details
                  </Link>
                </article>
              );
            })
          ) : (
            <article className={styles.emptyState}>
              <Icon type="deploy" />
              <h3>No deployment projects yet.</h3>
              <p>Connect GitHub, pick a repo, and prepare your first deployment.</p>
            </article>
          )}
        </section>
      </section>
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Remove this deployment?"
        message={
          deleteTarget
            ? `This will remove "${deleteTarget.name}" and its logs from your deployment dashboard.`
            : ""
        }
        confirmLabel="Remove deployment"
        isLoading={Boolean(deleteTarget && isSaving === `delete-${deleteTarget._id}`)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeDeployment}
      />
    </main>
  );
}
