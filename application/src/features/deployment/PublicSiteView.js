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
  const stackLabel = project.detectedFramework || project.framework || "Website";

  return (
    <main className={styles.siteShell}>
      <header className={styles.hero}>
        <nav>
          <strong>{project.name}</strong>
          <div>
            <a href="#work">Explore</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
        <section className={styles.heroContent}>
          <div>
            <span>{stackLabel}</span>
            <h1>{project.name}</h1>
            <p>
              A clean, production-ready preview published through CONCH. Use this page as the live
              path preview while custom domains and build artifacts are connected.
            </p>
            <div className={styles.heroActions}>
              <a href="#work">View preview</a>
              {project.repository?.htmlUrl ? (
                <a href={project.repository.htmlUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              ) : null}
            </div>
          </div>
          <aside className={styles.previewCard}>
            <span>Live preview</span>
            <strong>{liveLabel?.replace(/^https?:\/\//, "")}</strong>
            <p>{project.status} · {project.detectedLanguage || "JavaScript"} · {project.packageManager}</p>
            <i />
          </aside>
        </section>
      </header>

      <section className={styles.showcase} id="work">
        <div>
          <span>Built for launch</span>
          <h2>{project.name} is ready to shape into the final customer site.</h2>
        </div>
        <div className={styles.showcaseGrid}>
          <article>
            <strong>01</strong>
            <h3>Responsive foundation</h3>
            <p>Structured sections, clean spacing, and a stable preview URL for every deployment.</p>
          </article>
          <article>
            <strong>02</strong>
            <h3>Deployment metadata</h3>
            <p>Repository, stack, domain, and build settings are tracked from the deployment dashboard.</p>
          </article>
          <article>
            <strong>03</strong>
            <h3>Domain upgrade path</h3>
            <p>Keep path previews today and switch to wildcard subdomains or custom domains later.</p>
          </article>
        </div>
      </section>

      <section className={styles.grid} id="contact">
        <article>
          <span>Status</span>
          <strong>{project.status}</strong>
          <p>Deployment metadata is ready and available through this path-based preview.</p>
        </article>
        <article>
          <span>Stack</span>
          <strong>{project.detectedLanguage || "JavaScript"}</strong>
          <p>{project.packageManager} · {project.rootDirectory}</p>
        </article>
        <article>
          <span>Future domain</span>
          <strong>{project.defaultDomain}</strong>
          <p>Use wildcard DNS later when you want direct subdomain hosting.</p>
        </article>
      </section>

      <footer className={styles.footer}>
        <strong>{project.name}</strong>
        <span>Preview powered by CONCH</span>
      </footer>
    </main>
  );
}
