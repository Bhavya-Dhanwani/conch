import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "interior-designers",
  "niche": "Interior Designers",
  "terms": [
    "portfolio",
    "process",
    "materials",
    "consultation"
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
      "title": "Mira Interiors Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Portfolio built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around process",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "process",
            "materials",
            "consultation"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around materials",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "materials",
            "consultation",
            "portfolio"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around consultation",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "consultation",
            "portfolio",
            "process"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around portfolio",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Mira Interiors Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Portfolio built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around process",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "process",
            "materials",
            "consultation"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around materials",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "materials",
            "consultation",
            "portfolio"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around consultation",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "consultation",
            "portfolio",
            "process"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around portfolio",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Mira Interiors House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Portfolio built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around process",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "process",
            "materials",
            "consultation"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around materials",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "materials",
            "consultation",
            "portfolio"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around consultation",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "consultation",
            "portfolio",
            "process"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around portfolio",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Mira Interiors Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Portfolio built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around process",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "process",
            "materials",
            "consultation"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around materials",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "materials",
            "consultation",
            "portfolio"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around consultation",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "consultation",
            "portfolio",
            "process"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around portfolio",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Mira Interiors Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Portfolio built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around process",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "process",
            "materials",
            "consultation"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around materials",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "materials",
            "consultation",
            "portfolio"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around consultation",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "consultation",
            "portfolio",
            "process"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around portfolio",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for portfolio, process, materials, consultation.",
          "blocks": [
            "portfolio",
            "process",
            "materials"
          ]
        }
      ]
    }
  ]
});

export default templates;
