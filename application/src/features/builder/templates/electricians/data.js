import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "electricians",
  "niche": "Electricians",
  "terms": [
    "installations",
    "inspections",
    "emergency calls",
    "estimates"
  ],
  "palettes": [
    [
      "#f8fafc",
      "#0f766e",
      "#111827"
    ],
    [
      "#fff1f2",
      "#be123c",
      "#18181b"
    ],
    [
      "#fefce8",
      "#a16207",
      "#1c1917"
    ],
    [
      "#f5f5f4",
      "#57534e",
      "#1c1917"
    ],
    [
      "#ecfeff",
      "#0891b2",
      "#164e63"
    ]
  ],
  "variants": [
    {
      "slug": "split-hero",
      "title": "Voltcraft Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Installations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around inspections",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "inspections",
            "emergency calls",
            "estimates"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around emergency calls",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "emergency calls",
            "estimates",
            "installations"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around estimates",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "estimates",
            "installations",
            "inspections"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around installations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Voltcraft Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Installations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around inspections",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "inspections",
            "emergency calls",
            "estimates"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around emergency calls",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "emergency calls",
            "estimates",
            "installations"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around estimates",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "estimates",
            "installations",
            "inspections"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around installations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Voltcraft House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Installations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around inspections",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "inspections",
            "emergency calls",
            "estimates"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around emergency calls",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "emergency calls",
            "estimates",
            "installations"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around estimates",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "estimates",
            "installations",
            "inspections"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around installations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Voltcraft Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Installations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around inspections",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "inspections",
            "emergency calls",
            "estimates"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around emergency calls",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "emergency calls",
            "estimates",
            "installations"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around estimates",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "estimates",
            "installations",
            "inspections"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around installations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Voltcraft Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Installations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around inspections",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "inspections",
            "emergency calls",
            "estimates"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around emergency calls",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "emergency calls",
            "estimates",
            "installations"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around estimates",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "estimates",
            "installations",
            "inspections"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around installations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for installations, inspections, emergency calls, estimates.",
          "blocks": [
            "installations",
            "inspections",
            "emergency calls"
          ]
        }
      ]
    }
  ]
});

export default templates;
