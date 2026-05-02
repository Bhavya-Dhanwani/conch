"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "@/shared/components/Logo/Logo";
import {
  ArrowRightIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "./icons";
import styles from "./Navbar.module.css";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "Signal", href: "#signal" },
  { label: "Incident Flow", href: "#incident-flow" },
  { label: "Command Room", href: "#command-room" },
  { label: "Postmortem", href: "#postmortem" },
];

const secondaryItems = [
  { label: "Severity", href: "#incident-flow" },
  { label: "Assignment", href: "#command-room" },
  { label: "Team Chat", href: "#command-room" },
  { label: "CONCH AI", href: "#command-room" },
  { label: "Logs", href: "#postmortem" },
  { label: "Reports", href: "#postmortem" },
  { label: "Developers", href: "#signal" },
  { label: "Managers", href: "#incident-flow" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overlayRef = useRef(null);
  const drawerRef = useRef(null);
  const menuItemRefs = useRef([]);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const scrollY = self.scroll();

        setIsScrolled(scrollY > 12);
        setIsCollapsed(scrollY > 160 && self.direction === 1);
      },
    });

    return () => trigger.kill();
  }, []);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const expandNavbar = () => {
    setIsCollapsed(false);
  };

  const closeMenu = () => {
    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => setIsMenuOpen(false),
    });

    timeline
      .to(menuItemRefs.current, {
        autoAlpha: 0,
        y: 16,
        duration: 0.16,
        stagger: 0.015,
      })
      .to(
        drawerRef.current,
        {
          xPercent: -108,
          duration: 0.44,
        },
        "-=0.06",
      )
      .to(
        overlayRef.current,
        {
          autoAlpha: 0,
          duration: 0.3,
        },
        "-=0.34",
      );
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    menuItemRefs.current = menuItemRefs.current.filter(Boolean);

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .set(overlayRef.current, { autoAlpha: 0 })
      .set(drawerRef.current, { xPercent: -108 })
      .set(menuItemRefs.current, { autoAlpha: 0, y: 20 })
      .to(overlayRef.current, { autoAlpha: 1, duration: 0.28 })
      .to(
        drawerRef.current,
        {
          xPercent: 0,
          duration: 0.54,
        },
        "-=0.18",
      )
      .to(
        menuItemRefs.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.34,
          stagger: 0.035,
        },
        "-=0.28",
      );
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  if (pathname === "/create") {
    return null;
  }

  return (
    <>
      <header
        className={`${styles.shell} ${isScrolled ? styles.scrolled : ""} ${
          isCollapsed ? styles.collapsed : ""
        }`}
      >
        <nav className={styles.nav} aria-label="Primary navigation">
          <button
            className={styles.menuButton}
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={openMenu}
          >
            <span />
            <span />
          </button>

          <div className={styles.navCluster} aria-hidden={isCollapsed}>
            <div className={styles.links}>
              {navItems.slice(0, 2).map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>

            <Link className={styles.logoLink} href="/" aria-label="CONCH home">
              <Logo revealOnHover />
            </Link>

            <div className={styles.links}>
              {navItems.slice(2).map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <button
            className={styles.collapsedLogoLink}
            type="button"
            aria-label="Expand navigation"
            aria-hidden={!isCollapsed}
            onClick={expandNavbar}
          >
            <Logo compact />
          </button>

          <div className={styles.actions}>
            <Link className={styles.action} href="#signal">
              Start Trace
              <ArrowRightIcon className={styles.inlineIcon} />
            </Link>
          </div>
        </nav>
      </header>

      {isMenuOpen ? (
        <div
          className={styles.drawerOverlay}
          ref={overlayRef}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeMenu();
            }
          }}
        >
          <aside
            className={styles.drawer}
            ref={drawerRef}
            aria-label="Menu"
            aria-modal="true"
            role="dialog"
          >
            <div className={styles.drawerHeader}>
              <button
                className={styles.closeButton}
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <span />
                <span />
              </button>
              <Logo />
            </div>

            <div className={styles.drawerPrimary}>
              {navItems.map((item, index) => (
                <Link
                  href={item.href}
                  key={item.href}
                  ref={(node) => {
                    menuItemRefs.current[index] = node;
                  }}
                  onClick={closeMenu}
                >
                  {item.label}
                  <span aria-hidden="true">
                    <ArrowRightIcon className={styles.arrowIcon} />
                  </span>
                </Link>
              ))}
            </div>

            <div className={styles.drawerSecondary}>
              {secondaryItems.map((item, index) => (
                <Link
                  href={item.href}
                  key={item.href}
                  ref={(node) => {
                    menuItemRefs.current[navItems.length + index] = node;
                  }}
                  onClick={closeMenu}
                >
                  {item.label}
                  <ArrowRightIcon className={styles.smallArrowIcon} />
                </Link>
              ))}
            </div>

            <div
              className={styles.socials}
              ref={(node) => {
                menuItemRefs.current[navItems.length + secondaryItems.length] = node;
              }}
            >
              <span>Socials</span>
              <div>
                <a href="#youtube" aria-label="YouTube">
                  <YoutubeIcon className={styles.socialIcon} />
                </a>
                <a href="#linkedin" aria-label="LinkedIn">
                  <LinkedinIcon className={styles.socialIcon} />
                </a>
                <a href="#instagram" aria-label="Instagram">
                  <InstagramIcon className={styles.socialIcon} />
                </a>
                <a href="#x" aria-label="X">
                  <XIcon className={styles.socialIcon} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
