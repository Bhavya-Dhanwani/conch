import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "real-estate-agents",
  "niche": "Real Estate Agents",
  "terms": [
    "listings",
    "neighborhoods",
    "valuation",
    "agents"
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
      "title": "Cedar & Key Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Listings built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around neighborhoods",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "neighborhoods",
            "valuation",
            "agents"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around valuation",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "valuation",
            "agents",
            "listings"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around agents",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "agents",
            "listings",
            "neighborhoods"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around listings",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Cedar & Key Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Listings built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around neighborhoods",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "neighborhoods",
            "valuation",
            "agents"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around valuation",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "valuation",
            "agents",
            "listings"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around agents",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "agents",
            "listings",
            "neighborhoods"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around listings",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Cedar & Key House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Listings built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around neighborhoods",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "neighborhoods",
            "valuation",
            "agents"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around valuation",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "valuation",
            "agents",
            "listings"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around agents",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "agents",
            "listings",
            "neighborhoods"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around listings",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Cedar & Key Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Listings built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around neighborhoods",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "neighborhoods",
            "valuation",
            "agents"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around valuation",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "valuation",
            "agents",
            "listings"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around agents",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "agents",
            "listings",
            "neighborhoods"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around listings",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Cedar & Key Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Listings built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around neighborhoods",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "neighborhoods",
            "valuation",
            "agents"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around valuation",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "valuation",
            "agents",
            "listings"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around agents",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "agents",
            "listings",
            "neighborhoods"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around listings",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for listings, neighborhoods, valuation, agents.",
          "blocks": [
            "listings",
            "neighborhoods",
            "valuation"
          ]
        }
      ]
    }
  ]
});

export default templates;
