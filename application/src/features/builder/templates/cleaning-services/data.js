import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "cleaning-services",
  "niche": "Cleaning Services",
  "terms": [
    "plans",
    "teams",
    "checklists",
    "booking"
  ],
  "palettes": [
    [
      "#f5f5f4",
      "#57534e",
      "#1c1917"
    ],
    [
      "#ecfeff",
      "#0891b2",
      "#164e63"
    ],
    [
      "#eff6ff",
      "#2563eb",
      "#0f172a"
    ],
    [
      "#f0fdf4",
      "#16a34a",
      "#14532d"
    ],
    [
      "#faf5ff",
      "#9333ea",
      "#18181b"
    ]
  ],
  "variants": [
    {
      "slug": "split-hero",
      "title": "BrightSweep Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Plans built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around teams",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "teams",
            "checklists",
            "booking"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around checklists",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "checklists",
            "booking",
            "plans"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around booking",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "booking",
            "plans",
            "teams"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around plans",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "BrightSweep Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Plans built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around teams",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "teams",
            "checklists",
            "booking"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around checklists",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "checklists",
            "booking",
            "plans"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around booking",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "booking",
            "plans",
            "teams"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around plans",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "BrightSweep House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Plans built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around teams",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "teams",
            "checklists",
            "booking"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around checklists",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "checklists",
            "booking",
            "plans"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around booking",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "booking",
            "plans",
            "teams"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around plans",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "BrightSweep Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Plans built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around teams",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "teams",
            "checklists",
            "booking"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around checklists",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "checklists",
            "booking",
            "plans"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around booking",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "booking",
            "plans",
            "teams"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around plans",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "BrightSweep Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Plans built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around teams",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "teams",
            "checklists",
            "booking"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around checklists",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "checklists",
            "booking",
            "plans"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around booking",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "booking",
            "plans",
            "teams"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around plans",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for plans, teams, checklists, booking.",
          "blocks": [
            "plans",
            "teams",
            "checklists"
          ]
        }
      ]
    }
  ]
});

export default templates;
