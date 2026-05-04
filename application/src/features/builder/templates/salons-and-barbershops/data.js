import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "salons-and-barbershops",
  "niche": "Salons and Barbershops",
  "terms": [
    "services",
    "stylists",
    "pricing",
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
      "title": "Velvet Room Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around stylists",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "stylists",
            "pricing",
            "booking"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around pricing",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "pricing",
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
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "booking",
            "services",
            "stylists"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Velvet Room Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around stylists",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "stylists",
            "pricing",
            "booking"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around pricing",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "pricing",
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
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "booking",
            "services",
            "stylists"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Velvet Room House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around stylists",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "stylists",
            "pricing",
            "booking"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around pricing",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "pricing",
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
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "booking",
            "services",
            "stylists"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Velvet Room Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around stylists",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "stylists",
            "pricing",
            "booking"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around pricing",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "pricing",
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
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "booking",
            "services",
            "stylists"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Velvet Room Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Services built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around stylists",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "stylists",
            "pricing",
            "booking"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around pricing",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "pricing",
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
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "booking",
            "services",
            "stylists"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around services",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for services, stylists, pricing, booking.",
          "blocks": [
            "services",
            "stylists",
            "pricing"
          ]
        }
      ]
    }
  ]
});

export default templates;
