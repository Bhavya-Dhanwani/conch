import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "pet-grooming-services",
  "niche": "Pet Grooming Services",
  "terms": [
    "grooming",
    "packages",
    "safety",
    "booking"
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
      "title": "Paw & Polish Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Grooming built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around packages",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "packages",
            "safety",
            "booking"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around safety",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "safety",
            "booking",
            "grooming"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around booking",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "booking",
            "grooming",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around grooming",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Paw & Polish Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Grooming built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around packages",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "packages",
            "safety",
            "booking"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around safety",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "safety",
            "booking",
            "grooming"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around booking",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "booking",
            "grooming",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around grooming",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Paw & Polish House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Grooming built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around packages",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "packages",
            "safety",
            "booking"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around safety",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "safety",
            "booking",
            "grooming"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around booking",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "booking",
            "grooming",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around grooming",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Paw & Polish Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Grooming built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around packages",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "packages",
            "safety",
            "booking"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around safety",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "safety",
            "booking",
            "grooming"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around booking",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "booking",
            "grooming",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around grooming",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Paw & Polish Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Grooming built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around packages",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "packages",
            "safety",
            "booking"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around safety",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "safety",
            "booking",
            "grooming"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around booking",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "booking",
            "grooming",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around grooming",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for grooming, packages, safety, booking.",
          "blocks": [
            "grooming",
            "packages",
            "safety"
          ]
        }
      ]
    }
  ]
});

export default templates;
