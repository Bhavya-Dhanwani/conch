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

const sdkReference = [
  {
    title: "initConch(options)",
    body: "Call this once when your app starts. It stores the API key, endpoint, app name, environment, release, default metadata, custom headers, and optional hooks.",
    code: `initConch({
  apiKey: "conch_project_api_key",
  endpoint: "https://your-backend.com/api/ingest/event",
  appName: "checkout-web",
  environment: "production",
  release: "1.3.0",
  metadata: { team: "growth", region: "in" },
  headers: { "X-App-Version": "1.3.0" },
  beforeSend(payload) {
    return payload.errorMessage?.includes("ResizeObserver") ? null : payload;
  },
  onError(error) {
    console.error("CONCH failed to report", error);
  },
});`,
  },
  {
    title: "captureException(error, context)",
    body: "Use this for real Error objects. CONCH keeps the name, message, stack trace, optional code snippet, and runtime metadata.",
    code: `try {
  await checkout();
} catch (error) {
  captureException(error, {
    codeSnippet: "await checkout()",
    metadata: { route: "/checkout", cartId: cart.id },
  });
}`,
  },
  {
    title: "captureMessage(message, context)",
    body: "Use this for warnings, failed states, or non-Error cases where you still want an incident trail.",
    code: `captureMessage("Payment gateway returned an empty response", {
  metadata: {
    route: "/checkout",
    gateway: "stripe",
  },
});`,
  },
  {
    title: "captureEvent(event)",
    body: "Use this when you already have a normalized payload from another logger or custom error boundary.",
    code: `captureEvent({
  errorName: "HydrationError",
  errorMessage: "Client and server markup did not match",
  stackTrace: stack,
  codeSnippet: "render(<App />)",
  metadata: { route: window.location.pathname },
});`,
  },
  {
    title: "getConchConfig()",
    body: "Use this for debugging integration setup. It does not reveal the API key, only whether one exists.",
    code: `const config = getConchConfig();

console.log(config);
// {
//   initialized: true,
//   endpoint: "...",
//   appName: "checkout-web",
//   environment: "production",
//   release: "1.3.0",
//   hasApiKey: true
// }`,
  },
];

const platformSections = [
  {
    title: "Website builder",
    body: "The builder turns a prompt and optional logo into an ecommerce-style site draft. It creates pages, navigation, hero copy, sections, product-like cards, catalog categories, cart controls, favourite actions, and a customer capture form.",
    points: [
      "Currently supported: ecommerce storefronts, catalogs, product-focused landing pages, carts, favourites, customer leads, and checkout-ready sections.",
      "Not the current focus: blogs, portfolios, SaaS docs, marketplaces, social apps, or custom app logic outside ecommerce flows.",
      "Logged-in users get a backend-linked store. Guests can still see a local preview, but data persistence needs login.",
    ],
  },
  {
    title: "Ecommerce backend",
    body: "When a generated draft is linked, CONCH creates a store record and product records. The public storefront API can then read products and write carts, favourites, and customer details.",
    points: [
      "Public store read: GET /api/ecommerce/public/stores/:storeIdOrSlug",
      "Cart write: POST or PATCH /api/ecommerce/public/stores/:storeId/cart/items",
      "Favourites write: POST /api/ecommerce/public/stores/:storeId/favourites/toggle",
      "Customer lead: POST /api/ecommerce/public/stores/:storeId/customers",
    ],
  },
  {
    title: "Deployments",
    body: "The deployment dashboard imports GitHub repositories, detects the stack, stores project settings, records deployment runs, and exposes path-based previews under /site/:slug.",
    points: [
      "Repository detection checks package.json, lockfiles, and index.html to choose Next.js, React/Vite, Node.js, or vanilla defaults.",
      "Deployment settings include root directory, package manager, install command, build command, output directory, environment variables, and custom domain.",
      "Public previews can show captured ecommerce storefronts when a matching generated store exists.",
    ],
  },
  {
    title: "Runtime monitoring",
    body: "The npm SDK sends runtime failures to the backend ingest route. The backend validates the project API key, stores the log, and queues AI analysis for root cause notes.",
    points: [
      "The SDK automatically captures browser window errors and unhandled promise rejections unless disabled.",
      "Node uncaught exceptions and unhandled rejections are also supported when the SDK runs in Node.",
      "Metadata is normalized into browser, OS, URL, and user agent fields for dashboard triage.",
    ],
  },
];

const environmentRows = [
  ["NEXT_PUBLIC_BACKEND_URL", "Frontend", "Public backend origin used by browser API calls in production."],
  ["NEXT_PUBLIC_BASE_URL", "Frontend", "Legacy public backend origin. Prefer NEXT_PUBLIC_BACKEND_URL now."],
  ["CLIENT_URL", "Backend", "Comma-separated frontend origins allowed for credentialed CORS."],
  ["PUBLIC_APP_URL", "Backend", "Base URL used to generate /site/:slug preview links."],
  ["PLATFORM_DOMAIN", "Backend", "Domain suffix used for reserved preview domains."],
  ["GEMINI_API_KEY", "Backend", "Enables AI builder generation. Without it, the builder falls back to a local draft."],
  ["CLOUDINARY_*", "Backend", "Required for product/logo image uploads."],
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
        <h1>CONCH from install to live ecommerce preview.</h1>
        <p>
          This is the full working map: npm package setup, runtime monitoring, AI ecommerce
          builder, public storefront APIs, deployments, route protection, and production env setup.
        </p>
      </section>

      <section className={styles.docsNav} aria-label="Documentation shortcuts">
        <a href="#sdk">SDK</a>
        <a href="#builder">Builder</a>
        <a href="#deployments">Deployments</a>
        <a href="#backend">Backend</a>
        <a href="#production">Production</a>
      </section>

      <section className={styles.docsSection} id="sdk">
        <div className={styles.sectionIntro}>
          <span>NPM package</span>
          <h2>Install and initialize @mrdhanwani/conch.</h2>
          <p>
            The SDK is a small JavaScript runtime client. It works in browser apps and Node
            runtimes, uses fetch, and posts JSON events to your CONCH backend.
          </p>
        </div>
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

      <section className={styles.referenceGrid} aria-label="SDK API reference">
        {sdkReference.map((item) => (
          <article className={styles.referenceCard} key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <pre>
              <code>{item.code}</code>
            </pre>
          </article>
        ))}
      </section>

      <section className={styles.docsSection} id="builder">
        <div className={styles.sectionIntro}>
          <span>Builder</span>
          <h2>The website builder is ecommerce-first right now.</h2>
          <p>
            CONCH is not trying to generate every possible website category today. The supported
            builder lane is ecommerce: stores, catalogs, product pages, cart interactions, saved
            products, and customer capture.
          </p>
        </div>
        <div className={styles.featureList}>
          {platformSections.slice(0, 2).map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.docsSection} id="deployments">
        <div className={styles.sectionIntro}>
          <span>Deployments</span>
          <h2>Import repos, detect the stack, then publish a preview path.</h2>
          <p>
            The deployment area manages repository metadata and preview routing. For generated
            ecommerce stores, the public route can render the linked storefront with working cart,
            favourites, and lead capture.
          </p>
        </div>
        <div className={styles.featureList}>
          {platformSections.slice(2, 3).map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.docsSection} id="backend">
        <div className={styles.sectionIntro}>
          <span>Backend contract</span>
          <h2>POST runtime events to /api/ingest/event.</h2>
          <p>
            The backend expects an API key in <strong>X-API-KEY</strong> or the request body. It
            stores the log against the matching project and queues analysis.
          </p>
        </div>
        <article className={styles.referenceCard}>
          <h3>Ingest payload</h3>
          <p>Send at least an error message. Stack trace, code snippet, and metadata are optional but useful.</p>
          <pre>
            <code>{`POST /api/ingest/event
X-API-KEY: conch_project_api_key
Content-Type: application/json

{
  "errorName": "TypeError",
  "errorMessage": "Cannot read properties of undefined",
  "stackTrace": "TypeError: ...",
  "codeSnippet": "user.name.toUpperCase()",
  "metadata": {
    "browser": "Chrome",
    "os": "Windows",
    "url": "https://example.com/checkout",
    "userAgent": "Mozilla/5.0 ..."
  }
}`}</code>
          </pre>
        </article>
        <div className={styles.featureList}>
          {platformSections.slice(3, 4).map((section) => (
            <article key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.docsSection} id="production">
        <div className={styles.sectionIntro}>
          <span>Production setup</span>
          <h2>Set these env vars before deploying.</h2>
          <p>
            Most production breakage comes from the browser calling localhost or the backend blocking
            the deployed origin. These are the env names that matter.
          </p>
        </div>
        <div className={styles.envTable}>
          {environmentRows.map(([name, side, purpose]) => (
            <div key={name}>
              <code>{name}</code>
              <span>{side}</span>
              <p>{purpose}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.band}>
        <div>
          <span>Fast path</span>
          <h2>Build the store, deploy the preview, monitor runtime errors.</h2>
          <p>
            Start in the builder for ecommerce pages, use deployments for public preview links, and
            add the SDK to any JavaScript app you want to monitor.
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
