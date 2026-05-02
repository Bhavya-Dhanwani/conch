"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "@/shared/components/Logo/Logo";
import styles from "./LandingFooter.module.css";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { label: "Signal", href: "#signal" },
  { label: "Incident Flow", href: "#incident-flow" },
  { label: "Command Room", href: "#command-room" },
  { label: "Postmortem", href: "#postmortem" },
];

const socialLinks = [
  { label: "LinkedIn", href: "#linkedin" },
  { label: "Instagram", href: "#instagram" },
  { label: "YouTube", href: "#youtube" },
  { label: "X", href: "#x" },
];

export default function LandingFooter() {
  const footerRef = useRef(null);
  const revealRefs = useRef([]);

  useEffect(() => {
    const footer = footerRef.current;

    if (!footer) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        revealRefs.current.filter(Boolean),
        { autoAlpha: 0, y: 34, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, footer);

    return () => context.revert();
  }, []);

  return (
    <footer className={styles.footer} id="docs" ref={footerRef} aria-label="CONCH footer">
      <div className={styles.inner}>
        <div
          className={styles.brand}
          ref={(node) => {
            revealRefs.current[0] = node;
          }}
        >
          <Logo className={styles.logo} />
          <p>Root cause incident command for modern websites.</p>
        </div>

        <nav
          className={styles.linkGrid}
          ref={(node) => {
            revealRefs.current[1] = node;
          }}
          aria-label="Footer navigation"
        >
          <div>
            <h3>Platform</h3>
            {footerLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <h3>Social</h3>
            {socialLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div
          className={styles.bottom}
          ref={(node) => {
            revealRefs.current[2] = node;
          }}
        >
          <span>© {new Date().getFullYear()} CONCH</span>
          <span>Root cause incident command</span>
        </div>
      </div>
    </footer>
  );
}
