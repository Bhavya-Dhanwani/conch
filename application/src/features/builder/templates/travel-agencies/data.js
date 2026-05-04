import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "travel-agencies",
  "niche": "Travel Agencies",
  "terms": [
    "destinations",
    "packages",
    "itineraries",
    "trip planning"
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
      "title": "Atlas Lane Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Destinations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around packages",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "packages",
            "itineraries",
            "trip planning"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around itineraries",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "itineraries",
            "trip planning",
            "destinations"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around trip planning",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "trip planning",
            "destinations",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around destinations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Atlas Lane Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Destinations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around packages",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "packages",
            "itineraries",
            "trip planning"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around itineraries",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "itineraries",
            "trip planning",
            "destinations"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around trip planning",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "trip planning",
            "destinations",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around destinations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Atlas Lane House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Destinations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around packages",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "packages",
            "itineraries",
            "trip planning"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around itineraries",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "itineraries",
            "trip planning",
            "destinations"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around trip planning",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "trip planning",
            "destinations",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around destinations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Atlas Lane Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Destinations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around packages",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "packages",
            "itineraries",
            "trip planning"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around itineraries",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "itineraries",
            "trip planning",
            "destinations"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around trip planning",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "trip planning",
            "destinations",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around destinations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Atlas Lane Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Destinations built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around packages",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "packages",
            "itineraries",
            "trip planning"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around itineraries",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "itineraries",
            "trip planning",
            "destinations"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around trip planning",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "trip planning",
            "destinations",
            "packages"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around destinations",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for destinations, packages, itineraries, trip planning.",
          "blocks": [
            "destinations",
            "packages",
            "itineraries"
          ]
        }
      ]
    }
  ]
});

export default templates;
