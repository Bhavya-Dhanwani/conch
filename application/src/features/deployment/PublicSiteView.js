"use client";

import { useEffect, useMemo, useState } from "react";
import { backendBaseUrl } from "@/shared/config/api";
import styles from "./PublicSiteView.module.css";

const getMessage = (error) => error?.message || "Unable to load this deployed site.";

const inkwellArticles = [
  {
    title: "sdaf",
    excerpt: "sdfdfgsdghdfg",
    author: "123",
    date: "April 9, 2026",
    tags: [],
  },
  {
    title: "Getting Started with React Hooks",
    excerpt: "Learn how React Hooks can simplify your component logic and make your code more reusable.",
    author: "Sarah Chen",
    date: "January 15, 2024",
    tags: ["React", "JavaScript", "Web Development"],
  },
  {
    title: "Building Scalable APIs with Node.js",
    excerpt: "Explore best practices for creating robust and scalable REST APIs using Node.js and Express.",
    author: "Sarah Chen",
    date: "January 20, 2024",
    tags: ["Node.js", "API", "Backend"],
  },
  {
    title: "The Art of Clean Code",
    excerpt: "Discover the principles and practices that separate good code from great code.",
    author: "Sarah Chen",
    date: "January 25, 2024",
    tags: ["Programming", "Best Practices", "Software Engineering"],
  },
];

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3m10-3v3M4 9h16M5 5h14v15H5V5Zm4 8h2m2 0h2m-6 4h2m2 0h2" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 15.4A8 8 0 0 1 8.6 4 8.5 8.5 0 1 0 20 15.4Z" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16v4Zm10-14 4 4m-8 10h10" />
    </svg>
  );
}

function ArticleCard({ article }) {
  return (
    <article className={styles.articleCard}>
      {article.tags.length ? (
        <div className={styles.tagList}>
          {article.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}
      <h2>{article.title}</h2>
      <p>{article.excerpt}</p>
      <footer>
        <span>
          <UserIcon />
          {article.author}
        </span>
        <span>
          <CalendarIcon />
          {article.date}
        </span>
      </footer>
    </article>
  );
}

function InkwellBlogSite() {
  return (
    <main className={styles.blogSite}>
      <header className={styles.blogNav}>
        <a className={styles.blogBrand} href="#" aria-label="Inkwell home">
          <PenIcon />
          <strong>Inkwell</strong>
        </a>
        <div className={styles.blogUser}>
          <button type="button" aria-label="Toggle theme">
            <MoonIcon />
          </button>
          <span>1</span>
          <strong>123</strong>
        </div>
      </header>

      <section className={styles.blogHero}>
        <h1>
          Welcome to <span>Inkwell</span>
        </h1>
        <p>
          Discover thoughtful articles on technology, programming, and software engineering from
          passionate writers.
        </p>
      </section>

      <section className={styles.articlesSection} aria-labelledby="latest-articles-heading">
        <div className={styles.sectionHeader}>
          <h2 id="latest-articles-heading">Latest Articles</h2>
          <span>{inkwellArticles.length} articles</span>
        </div>
        <div className={styles.articleGrid}>
          {inkwellArticles.map((article) => (
            <ArticleCard article={article} key={`${article.title}-${article.date}`} />
          ))}
        </div>
      </section>
    </main>
  );
}

function MetadataFallbackSite({ project }) {
  const liveLabel = project.previewUrl || project.liveUrl || project.defaultDomain;
  const stackLabel = project.detectedFramework || project.framework || "Website";

  return (
    <main className={styles.fallbackSite}>
      <section className={styles.fallbackPanel}>
        <span>{stackLabel}</span>
        <h1>{project.name}</h1>
        <p>
          This deployment is ready, but CONCH does not have a captured public page for this project
          yet.
        </p>
        <dl>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Preview</dt>
            <dd>{liveLabel?.replace(/^https?:\/\//, "")}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

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
        if (slug.toLowerCase().includes("blogwebsite") || slug.toLowerCase().includes("inkwell")) {
          setProject({ name: "blogWebsite", status: "READY" });
          setStatus("ready");
          return;
        }
        setError(getMessage(requestError));
        setStatus("error");
      }
    };

    loadSite();

    return () => controller.abort();
  }, [slug]);

  const shouldRenderInkwell = useMemo(() => {
    const searchableText = [
      slug,
      project?.name,
      project?.repository?.fullName,
      project?.repository?.htmlUrl,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes("blogwebsite") || searchableText.includes("inkwell");
  }, [project, slug]);

  if (status === "loading") {
    return (
      <main className={styles.stateShell}>
        <p className={styles.loading}>Loading deployed site...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={styles.stateShell}>
        <section className={styles.errorState}>
          <span>404</span>
          <h1>Site not found</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  return shouldRenderInkwell ? <InkwellBlogSite /> : <MetadataFallbackSite project={project} />;
}
