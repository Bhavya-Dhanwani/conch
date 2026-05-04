import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "wedding-photographers",
  "niche": "Wedding Photographers",
  "terms": [
    "galleries",
    "packages",
    "stories",
    "booking"
  ],
  "palettes": [
    [
      "#fffaf3",
      "#c2410c",
      "#1c1917"
    ],
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
    ]
  ],
  "variants": [
    {
      "slug": "split-hero",
      "title": "Framehouse Vows Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Galleries built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around packages",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "packages",
            "stories",
            "booking"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around stories",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "stories",
            "booking",
            "galleries"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around booking",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "booking",
            "galleries",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around galleries",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Framehouse Vows Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Galleries built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around packages",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "packages",
            "stories",
            "booking"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around stories",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "stories",
            "booking",
            "galleries"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around booking",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "booking",
            "galleries",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around galleries",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Framehouse Vows House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Galleries built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around packages",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "packages",
            "stories",
            "booking"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around stories",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "stories",
            "booking",
            "galleries"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around booking",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "booking",
            "galleries",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around galleries",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Framehouse Vows Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Galleries built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around packages",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "packages",
            "stories",
            "booking"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around stories",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "stories",
            "booking",
            "galleries"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around booking",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "booking",
            "galleries",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around galleries",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Framehouse Vows Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Galleries built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around packages",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "packages",
            "stories",
            "booking"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around stories",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "stories",
            "booking",
            "galleries"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around booking",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "booking",
            "galleries",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around galleries",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for galleries, packages, stories, booking.",
          "blocks": [
            "galleries",
            "packages",
            "stories"
          ]
        }
      ]
    }
  ]
});

export default templates;
