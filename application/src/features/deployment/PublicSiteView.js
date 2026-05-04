"use client";

import { useEffect, useState } from "react";
import { backendBaseUrl } from "@/shared/config/api";
import styles from "./PublicSiteView.module.css";

const getMessage = (error) => error?.message || "Unable to load this deployed site.";

export default function PublicSiteView({ slug }) {
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadSite = async () => {
      setStatus("loading");
      setError("");

      try {
        const response = await fetch(`${backendBaseUrl}/api/deployments/public/${slug}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Deployed site not found.");
        }

        setProject(data.project);
        setStatus("ready");
      } catch (requestError) {
        if (requestError.name === "AbortError") return;
        setError(getMessage(requestError));
        setStatus("error");
      }
    };

    loadSite();

    return () => controller.abort();
  }, [slug]);

  if (status === "loading") {
    return (
      <main className={styles.siteShell}>
        <p className={styles.loading}>Loading deployed site...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={styles.siteShell}>
        <section className={styles.errorState}>
          <span>404</span>
          <h1>Site not found</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  const liveLabel = project.previewUrl || project.liveUrl || project.defaultDomain;

  return (
    <main className={styles.siteShell}>
      <header className={styles.hero}>
        <nav>
          <strong>{project.name}</strong>
          <a href={project.repository?.htmlUrl || "#"} target="_blank" rel="noreferrer">
            Repository
          </a>
        </nav>
        <section>
          <span>{project.detectedFramework || project.framework}</span>
          <h1>{project.name}</h1>
          <p>
            This deployment preview is running from CONCH at {liveLabel?.replace(/^https?:\/\//, "")}.
          </p>
          <div>
            <a href={project.repository?.htmlUrl || "#"} target="_blank" rel="noreferrer">
              View source
            </a>
            <a href={`https://${project.defaultDomain}`} target="_blank" rel="noreferrer">
              Future subdomain
            </a>
          </div>
        </section>
      </header>

      <section className={styles.grid}>
        <article>
          <span>Status</span>
          <strong>{project.status}</strong>
          <p>Deployment metadata is ready. A real build artifact renderer can replace this preview shell later.</p>
        </article>
        <article>
          <span>Stack</span>
          <strong>{project.detectedLanguage || "JavaScript"}</strong>
          <p>{project.packageManager} · {project.rootDirectory}</p>
        </article>
        <article>
          <span>Domain</span>
          <strong>{project.defaultDomain}</strong>
          <p>Use wildcard DNS later when you want direct subdomain hosting.</p>
        </article>
      </section>
    </main>
  );
}
