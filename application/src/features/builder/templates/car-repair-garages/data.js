import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "car-repair-garages",
  "niche": "Car Repair Garages",
  "terms": [
    "services",
    "diagnostics",
    "warranty",
    "booking"
  ],
  "palettes": [
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
    ],
    [
      "#eff6ff",
      "#2563eb",
      "#0f172a"
    ]
  ],
  "variants": [
    {
      "slug": "split-hero",
      "title": "Torque & Co Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around diagnostics",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "diagnostics",
            "warranty",
            "booking"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around warranty",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "warranty",
            "booking",
            "services"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around booking",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "booking",
            "services",
            "diagnostics"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Torque & Co Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around diagnostics",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "diagnostics",
            "warranty",
            "booking"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around warranty",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "warranty",
            "booking",
            "services"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around booking",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "booking",
            "services",
            "diagnostics"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Torque & Co House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around diagnostics",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "diagnostics",
            "warranty",
            "booking"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around warranty",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "warranty",
            "booking",
            "services"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around booking",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "booking",
            "services",
            "diagnostics"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Torque & Co Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around diagnostics",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "diagnostics",
            "warranty",
            "booking"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around warranty",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "warranty",
            "booking",
            "services"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around booking",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "booking",
            "services",
            "diagnostics"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Torque & Co Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around diagnostics",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "diagnostics",
            "warranty",
            "booking"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around warranty",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "warranty",
            "booking",
            "services"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around booking",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "booking",
            "services",
            "diagnostics"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, diagnostics, warranty, booking.",
          "blocks": [
            "services",
            "diagnostics",
            "warranty"
          ]
        }
      ]
    }
  ]
});

export default templates;
