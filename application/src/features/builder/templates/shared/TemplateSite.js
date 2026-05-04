"use client";

import { useMemo, useState } from "react";
import styles from "./templateStyles.module.css";

function TemplateHeader({ template, currentPage, onNavigate }) {
  return (
    <header className={styles.header}>
      <button className={styles.brand} type="button" onClick={() => onNavigate(template.pages[0].id)}>
        <span style={{ background: template.palette[1] }} />
        <strong>{template.title}</strong>
      </button>
      <nav aria-label={template.title + " pages"}>
        {template.pages.map((page) => (
          <button className={currentPage.id === page.id ? styles.activeNav : ""} key={page.id} type="button" onClick={() => onNavigate(page.id)}>
            {page.label}
          </button>
        ))}
      </nav>
      <a className={styles.headerCta} href="#contact">Book</a>
    </header>
  );
}

function HeroSection({ template, page }) {
  return (
    <section className={styles.hero + " " + styles[template.layout]}>
      <div className={styles.heroCopy}>
        <p>{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <span>{page.summary}</span>
        <div className={styles.heroActions}>
          <a href="#contact">Start inquiry</a>
          <a href="#proof">View proof</a>
        </div>
      </div>
      <div className={styles.visualPanel} aria-label={template.niche + " visual preview"}>
        <div className={styles.mockWindow}><span /><span /><span /></div>
        <div className={styles.mockMedia}><i style={{ background: template.palette[1] }} /><b /></div>
      </div>
    </section>
  );
}

function MetricsStrip({ template }) {
  return <section className={styles.metrics} id="proof">{template.metrics.map((metric) => <article key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></article>)}</section>;
}

function ContentGrid({ page, template }) {
  return <section className={styles.contentGrid}>{page.blocks.map((block, index) => <article key={block}><small>{"0" + (index + 1)}</small><h2>{block}</h2><p>{template.copyPoints[index]}</p></article>)}</section>;
}

function ProcessSection({ template }) {
  return <section className={styles.process}><div><p>Process</p><h2>Clear steps from first click to booked client.</h2></div><ol>{template.process.map((step) => <li key={step}>{step}</li>)}</ol></section>;
}

function ShowcaseSection({ template }) {
  return <section className={styles.showcase}><div><p>Highlights</p><h2>{template.niche} layout system</h2></div>{template.highlights.map((item) => <article key={item}>{item}</article>)}</section>;
}

function PricingSection({ template }) {
  return <section className={styles.pricing}>{template.offers.map((offer) => <article key={offer.name}><h3>{offer.name}</h3><strong>{offer.price}</strong><p>{offer.detail}</p></article>)}</section>;
}

function ContactSection({ template }) {
  return <section className={styles.contact} id="contact"><div><p>Contact</p><h2>Ready for a clean website that feels current?</h2></div><form><input aria-label="Name" placeholder="Name" /><input aria-label="Email" placeholder="Email" /><textarea aria-label="Project details" placeholder={"Tell " + template.title + " what you need"} /><button type="button">Send inquiry</button></form></section>;
}

function TemplateFooter({ template }) {
  return <footer className={styles.footer}><strong>{template.title}</strong><span>{template.niche} template</span></footer>;
}

export default function TemplateSite({ template, initialPage = "home" }) {
  const [pageId, setPageId] = useState(initialPage);
  const currentPage = useMemo(() => template.pages.find((page) => page.id === pageId) || template.pages[0], [pageId, template.pages]);
  return (
    <main className={styles.site} style={{ "--template-bg": template.palette[0], "--template-accent": template.palette[1], "--template-ink": template.palette[2] }}>
      <TemplateHeader template={template} currentPage={currentPage} onNavigate={setPageId} />
      <HeroSection template={template} page={currentPage} />
      <MetricsStrip template={template} />
      <ContentGrid page={currentPage} template={template} />
      <ProcessSection template={template} />
      <ShowcaseSection template={template} />
      <PricingSection template={template} />
      <ContactSection template={template} />
      <TemplateFooter template={template} />
    </main>
  );
}
