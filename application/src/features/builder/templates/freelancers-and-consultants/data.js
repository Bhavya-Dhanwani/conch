import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "freelancers-and-consultants",
  "niche": "Freelancers and Consultants",
  "terms": [
    "services",
    "case studies",
    "process",
    "inquiry"
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
      "title": "Northstar Studio Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around case studies",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "case studies",
            "process",
            "inquiry"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around process",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "process",
            "inquiry",
            "services"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around inquiry",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "inquiry",
            "services",
            "case studies"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Northstar Studio Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around case studies",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "case studies",
            "process",
            "inquiry"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around process",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "process",
            "inquiry",
            "services"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around inquiry",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "inquiry",
            "services",
            "case studies"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Northstar Studio House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around case studies",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "case studies",
            "process",
            "inquiry"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around process",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "process",
            "inquiry",
            "services"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around inquiry",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "inquiry",
            "services",
            "case studies"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Northstar Studio Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around case studies",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "case studies",
            "process",
            "inquiry"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around process",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "process",
            "inquiry",
            "services"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around inquiry",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "inquiry",
            "services",
            "case studies"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Northstar Studio Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around case studies",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "case studies",
            "process",
            "inquiry"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around process",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "process",
            "inquiry",
            "services"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around inquiry",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "inquiry",
            "services",
            "case studies"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, case studies, process, inquiry.",
          "blocks": [
            "services",
            "case studies",
            "process"
          ]
        }
      ]
    }
  ]
});

export default templates;
