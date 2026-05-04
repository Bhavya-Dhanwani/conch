import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "dentists",
  "niche": "Dentists",
  "terms": [
    "treatments",
    "insurance",
    "doctors",
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
      "title": "Pearlpoint Dental Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Treatments built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around insurance",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "insurance",
            "doctors",
            "appointments"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around doctors",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "doctors",
            "appointments",
            "treatments"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around appointments",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "appointments",
            "treatments",
            "insurance"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around treatments",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Pearlpoint Dental Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Treatments built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around insurance",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "insurance",
            "doctors",
            "appointments"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around doctors",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "doctors",
            "appointments",
            "treatments"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around appointments",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "appointments",
            "treatments",
            "insurance"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around treatments",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Pearlpoint Dental House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Treatments built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around insurance",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "insurance",
            "doctors",
            "appointments"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around doctors",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "doctors",
            "appointments",
            "treatments"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around appointments",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "appointments",
            "treatments",
            "insurance"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around treatments",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Pearlpoint Dental Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Treatments built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around insurance",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "insurance",
            "doctors",
            "appointments"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around doctors",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "doctors",
            "appointments",
            "treatments"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around appointments",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "appointments",
            "treatments",
            "insurance"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around treatments",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Pearlpoint Dental Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Treatments built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around insurance",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "insurance",
            "doctors",
            "appointments"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around doctors",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "doctors",
            "appointments",
            "treatments"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around appointments",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "appointments",
            "treatments",
            "insurance"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around treatments",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for treatments, insurance, doctors, appointments.",
          "blocks": [
            "treatments",
            "insurance",
            "doctors"
          ]
        }
      ]
    }
  ]
});

export default templates;
