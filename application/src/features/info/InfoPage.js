import Link from "next/link";
import Logo from "@/shared/components/Logo/Logo";
import styles from "./InfoPage.module.css";

const docsSteps = [
  {
    label: "Install",
    title: "Add the runtime SDK",
    body: "Install the npm package in the frontend you want to monitor.",
    code: "npm install @mrdhanwani/conch",
  },
  {
    label: "Initialize",
    title: "Point events at CONCH",
    body: "Initialize once near your app root with an ingest endpoint and API key.",
    code: `import { initConch } from "@mrdhanwani/conch";

initConch({
  apiKey: "conch_xxxxx",
  endpoint: "/api/ingest/event",
  appName: "storefront",
  environment: "production",
});`,
  },
  {
    label: "Capture",
    title: "Send errors with context",
    body: "Capture exceptions, messages, or custom events with metadata that helps explain what happened.",
    code: `import { captureException } from "@mrdhanwani/conch";

captureException(error, {
  codeSnippet: "cart.items.map(renderLineItem)",
  metadata: { route: "/checkout" },
});`,
  },
];

const aboutCards = [
  {
    title: "Error signal",
    body: "The SDK records runtime failures, stack traces, browser details, URLs, and the extra metadata your team sends.",
  },
  {
    title: "Incident command",
    body: "The dashboard groups problems into a workspace built for triage, root cause notes, and team visibility.",
  },
  {
    title: "Ecommerce builder",
    body: "The website builder currently focuses on ecommerce-style websites: storefront pages, product grids, cart flows, and checkout-ready sections.",
  },
];

function DocsContent() {
  return (
    <>
      <section className={styles.hero}>
        <span>Developer docs</span>
        <h1>Ship CONCH into a JavaScript app in minutes.</h1>
        <p>
          Use the SDK to capture production errors, attach useful context, and send them to your
          CONCH backend for incident review.
        </p>
      </section>

      <section className={styles.steps} aria-label="SDK setup steps">
        {docsSteps.map((step) => (
          <article className={styles.stepCard} key={step.label}>
            <span>{step.label}</span>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
            <pre>
              <code>{step.code}</code>
            </pre>
          </article>
        ))}
      </section>

      <section className={styles.band}>
        <div>
          <span>Backend contract</span>
          <h2>POST errors to your ingest route.</h2>
          <p>
            CONCH sends JSON to <strong>/api/ingest/event</strong> with <strong>X-API-KEY</strong>.
            Payloads include error name, message, stack trace, optional code snippet, and metadata.
          </p>
        </div>
        <Link href="/create">Open builder</Link>
      </section>
    </>
  );
}

function AboutContent() {
  return (
    <>
      <section className={styles.hero}>
        <span>About CONCH</span>
        <h1>CONCH brings website building and incident clarity into one command layer.</h1>
        <p>
          It helps teams create ecommerce-ready website drafts, deploy project previews, and capture
          runtime errors so production issues have context from the start.
        </p>
      </section>

      <section className={styles.cardGrid} aria-label="What CONCH does">
        {aboutCards.map((card) => (
          <article className={styles.infoCard} key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </article>
        ))}
      </section>

      <section className={styles.band}>
        <div>
          <span>Current builder scope</span>
          <h2>Today, the AI website builder is ecommerce-first.</h2>
          <p>
            Use it for online stores, product-focused landing pages, catalogs, carts, and storefront
            flows. More site categories can come later, but ecommerce is the supported builder lane
            right now.
          </p>
        </div>
        <Link href="/docs">Read docs</Link>
      </section>
    </>
  );
}

function ContactContent() {
  return (
    <>
      <section className={styles.hero}>
        <span>Contact</span>
        <h1>Need help with CONCH or the ecommerce builder?</h1>
        <p>
          Thanks for using CONCH. Send questions, feedback, or support notes to the email below and
          we will get back to you.
        </p>
      </section>

      <section className={styles.contactPanel} aria-label="Contact details">
        <div>
          <span>Email</span>
          <a href="mailto:hello@bhavyadhanwani.dev">hello@bhavyadhanwani.dev</a>
        </div>
        <p>
          Include your project name, the page or deployment you are working on, and any error message
          you are seeing so support can move faster.
        </p>
      </section>
    </>
  );
}

export default function InfoPage({ type }) {
  const isDocs = type === "docs";
  const isContact = type === "contact";

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" aria-label="CONCH home">
          <Logo />
        </Link>
      </header>
      {isDocs ? <DocsContent /> : isContact ? <ContactContent /> : <AboutContent />}
    </main>
  );
}
