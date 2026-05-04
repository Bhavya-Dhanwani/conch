import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "local-clinics",
  "niche": "Local Clinics",
  "terms": [
    "services",
    "physicians",
    "insurance",
    "appointments"
  ],
  "palettes": [
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
    ]
  ],
  "variants": [
    {
      "slug": "split-hero",
      "title": "Northline Care Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around physicians",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "physicians",
            "insurance",
            "appointments"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around insurance",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "insurance",
            "appointments",
            "services"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around appointments",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "appointments",
            "services",
            "physicians"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Northline Care Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around physicians",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "physicians",
            "insurance",
            "appointments"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around insurance",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "insurance",
            "appointments",
            "services"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around appointments",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "appointments",
            "services",
            "physicians"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Northline Care House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around physicians",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "physicians",
            "insurance",
            "appointments"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around insurance",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "insurance",
            "appointments",
            "services"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around appointments",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "appointments",
            "services",
            "physicians"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Northline Care Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around physicians",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "physicians",
            "insurance",
            "appointments"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around insurance",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "insurance",
            "appointments",
            "services"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around appointments",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "appointments",
            "services",
            "physicians"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Northline Care Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around physicians",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "physicians",
            "insurance",
            "appointments"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around insurance",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "insurance",
            "appointments",
            "services"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around appointments",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "appointments",
            "services",
            "physicians"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, physicians, insurance, appointments.",
          "blocks": [
            "services",
            "physicians",
            "insurance"
          ]
        }
      ]
    }
  ]
});

export default templates;
