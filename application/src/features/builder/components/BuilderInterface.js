"use client";

import { useState } from "react";
import Logo from "@/shared/components/Logo/Logo";
import styles from "./BuilderInterface.module.css";

const generatedSections = ["Hero", "Navigation", "Feature band"];

function Icon({ type }) {
  const paths = {
    plus: "M10 4v12M4 10h12",
    user: "M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 6a6 6 0 0 1 12 0",
    refresh: "M15 6a6 6 0 1 0 1 5m-1-5V3h3",
    send: "M4 10h10m0 0-4-4m4 4-4 4",
  };

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={styles.icon}>
      <path d={paths[type]} />
    </svg>
  );
}

export default function BuilderInterface() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildMode, setBuildMode] = useState("Instant");

  const hasConversation = messages.length > 0 || isGenerating;

  const submitPrompt = () => {
    const nextPrompt = prompt.trim();

    if (!nextPrompt || isGenerating) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        text: nextPrompt,
      },
    ]);
    setPrompt("");
    setIsGenerating(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "I drafted a clean first page structure and prepared the main sections for review.",
        },
      ]);
      setIsGenerating(false);
    }, 850);
  };

  return (
    <main className={styles.shell}>
      <div className={styles.topActions} aria-label="Workspace actions">
        <button type="button" aria-label="Invite teammate">
          <Icon type="user" />
        </button>
        <button type="button" aria-label="Regenerate workspace">
          <Icon type="refresh" />
        </button>
      </div>

      <section className={`${styles.centerStage} ${hasConversation ? styles.activeStage : ""}`}>
        <div className={styles.identity}>
          <Logo compact className={styles.identityLogo} />
          <span>CONCH</span>
        </div>

        <h1>{hasConversation ? "Building your site." : "What shall we build today?"}</h1>

        {hasConversation ? (
          <div className={styles.conversation} aria-live="polite">
            {messages.map((message) => (
              <article
                className={`${styles.message} ${
                  message.role === "user" ? styles.userMessage : styles.aiMessage
                }`}
                key={message.id}
              >
                {message.text}
              </article>
            ))}

            {isGenerating ? (
              <div className={`${styles.message} ${styles.aiMessage} ${styles.typing}`}>
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>
        ) : null}

        <form
          className={styles.inputBar}
          onSubmit={(event) => {
            event.preventDefault();
            submitPrompt();
          }}
        >
          <button className={styles.softIconButton} type="button" aria-label="Attach context">
            <Icon type="plus" />
          </button>

          <input
            aria-label="Describe the website you want to build"
            placeholder="Describe the website you want to build..."
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />

          <label className={styles.modeSelect}>
            <span className={styles.srOnly}>Build mode</span>
            <select value={buildMode} onChange={(event) => setBuildMode(event.target.value)}>
              <option>Instant</option>
              <option>Deep</option>
            </select>
          </label>

          <button className={styles.buildButton} type="submit">
            Build
            <Icon type="send" />
          </button>
        </form>

        {hasConversation ? (
          <div className={styles.generatedPreview}>
            <div>
              <p>Live draft</p>
              <strong>conch.site/draft</strong>
            </div>
            <div className={styles.sectionPills}>
              {generatedSections.map((section) => (
                <span key={section}>{section}</span>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
