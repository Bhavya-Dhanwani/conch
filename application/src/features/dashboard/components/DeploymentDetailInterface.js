"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBackendApi } from "@/shared/config/api";
import ConfirmDialog from "./ConfirmDialog";
import styles from "./DeploymentInterface.module.css";

const backendApi = createBackendApi();

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

const normalizeUrl = (value = "") => {
  const cleanValue = value.trim();
  if (!cleanValue) return "";
  return /^https?:\/\//i.test(cleanValue) ? cleanValue : `https://${cleanValue}`;
};

function Icon({ type }) {
  const paths = {
    arrow: "M4 10h12M9 5l-5 5 5 5",
    eye: "M2.5 10s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5Zm7.5 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    eyeOff: "M3 3l14 14M7.2 7.3A7.8 7.8 0 0 0 2.5 10s2.8 5 7.5 5c1.1 0 2.1-.3 3-.7M9 5.1c.3 0 .6-.1 1-.1 4.7 0 7.5 5 7.5 5a12 12 0 0 1-2.1 2.7M9.2 9.2a1.2 1.2 0 0 0 1.6 1.6",
    github: "M10 2a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2 .4-2.5-.8-2.5-.8-.3-.8-.8-1-.8-1-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.5.8-2-.1-.2-.4-1 .1-2 0 0 .7-.2 2.1.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.1-.8 2.1-.8.5 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.8-1.7 3.4-3.3 3.6.3.2.5.7.5 1.4v2.1c0 .2.1.5.5.4A8 8 0 0 0 10 2Z",
    link: "M7.5 11.5 12.5 6.5M8.5 5.5l1-1a3 3 0 0 1 4.2 4.2l-1 1M11.5 14.5l-1 1a3 3 0 0 1-4.2-4.2l1-1",
    refresh: "M15 6a6 6 0 1 0 1 5m-1-5V3h3",
    rocket: "M11 3c3.6.3 5.7 2.4 6 6l-4.5 4.5-4-4L11 3Zm-3 8-3 1-2 5 5-2 1-3m-1-1 4 4",
    terminal: "M3 5h14v10H3V5Zm3 3 2 2-2 2m4 0h4",
  };

  return (
    <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  );
}

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export default function DeploymentDetailInterface({ projectId }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [environmentDrafts, setEnvironmentDrafts] = useState([
    { key: "", value: "", environment: "all", isSecret: true },
  ]);

  const liveUrl = useMemo(() => {
    if (!project) return "";
    return normalizeUrl(project.liveUrl || project.previewUrl || project.defaultDomain || "");
  }, [project]);

  const loadDeployment = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [projectResponse, logsResponse] = await Promise.all([
        backendApi.get(`/api/deployments/projects/${projectId}`),
        backendApi.get(`/api/deployments/projects/${projectId}/logs?limit=100`),
      ]);

      setProject(projectResponse.data.project || null);
      setLogs(logsResponse.data.logs || []);
      const nextVariables = projectResponse.data.project?.environmentVariables || [];
      setEnvironmentDrafts(
        nextVariables.length
          ? nextVariables.map((variable) => ({
              key: variable.key || "",
              value: variable.value || "",
              environment: variable.environment || "all",
              isSecret: variable.isSecret !== false,
            }))
          : [{ key: "", value: "", environment: "all", isSecret: true }],
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setProject(null);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadDeployment();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadDeployment]);

  const queueDeployment = async () => {
    setIsSaving("deploy");
    setError("");
    setNotice("");

    try {
      const { data } = await backendApi.post(`/api/deployments/projects/${projectId}/deploy`);
      setProject(data.project);
      setNotice(`Deployment ready at ${data.project.liveUrl || data.project.previewUrl || data.project.defaultDomain}.`);
      await loadDeployment();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const removeDeployment = async () => {
    if (!project) return;

    setIsSaving("delete");
    setError("");
    setNotice("");

    try {
      await backendApi.delete(`/api/deployments/projects/${project._id}`);
      setIsDeleteDialogOpen(false);
      router.push("/dashboard/deployments");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  const updateEnvironmentDraft = (index, field, value) => {
    setEnvironmentDrafts((current) =>
      current.map((variable, variableIndex) =>
        variableIndex === index ? { ...variable, [field]: value } : variable,
      ),
    );
  };

  const addEnvironmentDraft = () => {
    setEnvironmentDrafts((current) => [
      ...current,
      { key: "", value: "", environment: "all", isSecret: true },
    ]);
  };

  const removeEnvironmentDraft = (index) => {
    setEnvironmentDrafts((current) =>
      current.length === 1
        ? [{ key: "", value: "", environment: "all", isSecret: true }]
        : current.filter((_, variableIndex) => variableIndex !== index),
    );
  };

  const saveEnvironmentVariables = async () => {
    setIsSaving("env");
    setError("");
    setNotice("");

    try {
      const { data } = await backendApi.patch(
        `/api/deployments/projects/${projectId}/environment-variables`,
        {
          environmentVariables: environmentDrafts
            .map((variable) => ({
              ...variable,
              key: variable.key.trim(),
              value: variable.value.trim(),
            }))
            .filter((variable) => variable.key && variable.value),
        },
      );
      setProject(data.project);
      setNotice("Environment variables updated.");
      await loadDeployment();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving("");
    }
  };

  return (
    <main className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <Link href="/dashboard/deployments">
          <Icon type="arrow" />
          Deployments
        </Link>
        <div>
          <p>Deployment detail</p>
          <h1>{project?.name || "Deployment"}</h1>
        </div>
        <div className={styles.detailActions}>
          <button type="button" onClick={loadDeployment}>
            <Icon type="refresh" />
            Refresh
          </button>
          <button type="button" disabled={!project || isSaving === "deploy"} onClick={queueDeployment}>
            <Icon type="rocket" />
            {isSaving === "deploy" ? "Queuing..." : "Deploy"}
          </button>
          <button
            className={styles.dangerButton}
            type="button"
            disabled={!project || isSaving === "delete"}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            {isSaving === "delete" ? "Removing..." : "Remove"}
          </button>
        </div>
      </header>

      {error ? <p className={styles.errorBanner}>{error}</p> : null}
      {notice ? <p className={styles.noticeBanner}>{notice}</p> : null}
      {isLoading ? <p className={styles.loadingBanner}>Loading deployment details...</p> : null}

      {project ? (
        <>
          <section className={styles.detailHero}>
            <article>
              <span className={styles.statusPill}>{project.status}</span>
              <h2>{project.name}</h2>
              <p>{project.repository?.fullName}</p>
              <div className={styles.previewUrlBox}>
                <Icon type="link" />
                <span>{liveUrl ? liveUrl.replace(/^https?:\/\//i, "") : "Preview URL not ready"}</span>
              </div>
              <div className={styles.detailLinks}>
                {liveUrl ? (
                  <a href={liveUrl} target="_blank" rel="noreferrer">
                    <Icon type="link" />
                    Visit
                  </a>
                ) : null}
                {project.repository?.htmlUrl ? (
                  <a href={project.repository.htmlUrl} target="_blank" rel="noreferrer">
                    <Icon type="github" />
                    Repository
                  </a>
                ) : null}
              </div>
            </article>
            <aside>
              <span>Framework</span>
              <strong>{project.detectedFramework || project.framework}</strong>
              <span>Language</span>
              <strong>{project.detectedLanguage || "JavaScript"}</strong>
              <span>Environment</span>
              <strong>{project.environment}</strong>
            </aside>
          </section>

          <section className={styles.detailGrid}>
            <article className={styles.detailCard}>
              <h3>Build settings</h3>
              <dl>
                <dt>Root directory</dt>
                <dd>{project.rootDirectory}</dd>
                <dt>Package manager</dt>
                <dd>{project.packageManager}</dd>
                <dt>Install command</dt>
                <dd>{project.installCommand || "None"}</dd>
                <dt>Build command</dt>
                <dd>{project.buildCommand || "None"}</dd>
                <dt>Start command</dt>
                <dd>{project.startCommand || "None"}</dd>
                <dt>Output directory</dt>
                <dd>{project.outputDirectory || "None"}</dd>
              </dl>
            </article>

            <article className={styles.detailCard}>
              <h3>Preview URL</h3>
              <dl>
                <dt>Path preview</dt>
                <dd>{project.previewPath || "Not ready"}</dd>
                <dt>Live URL</dt>
                <dd>{liveUrl || "Not ready"}</dd>
                <dt>Custom domain</dt>
                <dd>{project.customDomain || "Not connected"}</dd>
              </dl>
            </article>

            <article className={styles.detailCard}>
              <h3>Recent deployments</h3>
              <div className={styles.runList}>
                {(project.deployments || []).length ? (
                  [...project.deployments].reverse().slice(0, 8).map((run) => (
                    <div key={run._id}>
                      <span>{run.status}</span>
                      <strong>
                        {normalizeUrl(run.deploymentUrl || project.defaultDomain || "").replace(
                          /^https?:\/\//i,
                          "",
                        ) || "URL not available"}
                      </strong>
                      <small>{formatDate(run.queuedAt)}</small>
                    </div>
                  ))
                ) : (
                  <p className={styles.noLogs}>No deployment runs yet.</p>
                )}
              </div>
            </article>
          </section>

          <section className={styles.fullLogPanel}>
            <div className={styles.logHeader}>
              <div>
                <strong>Environment variables</strong>
                <p>Secret values are masked. Leave a masked value unchanged to keep the existing secret.</p>
              </div>
              <button type="button" onClick={addEnvironmentDraft}>
                Add variable
              </button>
            </div>
            <div className={styles.envEditor}>
              {environmentDrafts.map((variable, index) => (
                <div className={styles.envRow} key={`detail-env-${index}`}>
                  <input
                    value={variable.key}
                    onChange={(event) => updateEnvironmentDraft(index, "key", event.target.value)}
                    placeholder="NEXT_PUBLIC_API_URL"
                  />
                  <input
                    value={variable.value}
                    onChange={(event) => updateEnvironmentDraft(index, "value", event.target.value)}
                    placeholder="Value"
                    type={variable.isSecret ? "password" : "text"}
                  />
                  <select
                    value={variable.environment}
                    onChange={(event) => updateEnvironmentDraft(index, "environment", event.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="production">Production</option>
                    <option value="preview">Preview</option>
                  </select>
                  <button
                    className={styles.eyeToggle}
                    type="button"
                    aria-label={variable.isSecret ? "Show value" : "Hide value"}
                    title={variable.isSecret ? "Show value" : "Hide value"}
                    onClick={() => updateEnvironmentDraft(index, "isSecret", !variable.isSecret)}
                  >
                    <Icon type={variable.isSecret ? "eyeOff" : "eye"} />
                  </button>
                  <button type="button" onClick={() => removeEnvironmentDraft(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              className={styles.envSaveButton}
              type="button"
              disabled={isSaving === "env"}
              onClick={saveEnvironmentVariables}
            >
              {isSaving === "env" ? "Saving..." : "Save environment variables"}
            </button>
          </section>

          <section className={styles.fullLogPanel}>
            <div className={styles.logHeader}>
              <div>
                <strong>Logs for this deployment</strong>
                <p>{logs.length} events from build, domain, runtime, and system sources.</p>
              </div>
            </div>

            {logs.length ? (
              logs.map((log) => (
                <article className={`${styles.logItem} ${styles[`log${log.level}`]}`} key={log._id}>
                  <div>
                    <span>{log.level}</span>
                    <small>{log.source} · {formatDate(log.createdAt)}</small>
                  </div>
                  <p>{log.message}</p>
                  {log.level === "ERROR" ? (
                    <dl>
                      <dt>Root cause</dt>
                      <dd>{log.rootCause || "Needs review"}</dd>
                      <dt>File</dt>
                      <dd>
                        {log.fileName || "Unknown"}
                        {log.lineNumber ? `:${log.lineNumber}` : ""}
                      </dd>
                      <dt>Probable solution</dt>
                      <dd>{log.probableSolution || "Inspect the error and redeploy after the fix."}</dd>
                    </dl>
                  ) : null}
                </article>
              ))
            ) : (
              <p className={styles.noLogs}>No logs for this deployment yet.</p>
            )}
          </section>
        </>
      ) : null}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Remove this deployment?"
        message={
          project
            ? `This will remove "${project.name}" and its logs from your deployment dashboard.`
            : ""
        }
        confirmLabel="Remove deployment"
        isLoading={isSaving === "delete"}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={removeDeployment}
      />
    </main>
  );
}
