import { createTemplateSet } from "../shared/createTemplateSet";

const templates = createTemplateSet({
  "folder": "yoga-studios",
  "niche": "Yoga Studios",
  "terms": [
    "classes",
    "teachers",
    "memberships",
    "retreats"
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
      "title": "Stillpoint Yoga Studio",
      "layout": "splitHero",
      "layoutName": "Split Hero",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Classes built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        },
        {
          "id": "services",
          "label": "Services",
          "path": "/services",
          "eyebrow": "Services page",
          "title": "Services designed around teachers",
          "summary": "A clean services page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "teachers",
            "memberships",
            "retreats"
          ]
        },
        {
          "id": "about",
          "label": "About",
          "path": "/about",
          "eyebrow": "About page",
          "title": "About designed around memberships",
          "summary": "A clean about page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "memberships",
            "retreats",
            "classes"
          ]
        },
        {
          "id": "pricing",
          "label": "Pricing",
          "path": "/pricing",
          "eyebrow": "Pricing page",
          "title": "Pricing designed around retreats",
          "summary": "A clean pricing page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "retreats",
            "classes",
            "teachers"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around classes",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        }
      ]
    },
    {
      "slug": "bento-grid",
      "title": "Stillpoint Yoga Collective",
      "layout": "bentoGrid",
      "layoutName": "Bento Grid",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Classes built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        },
        {
          "id": "work",
          "label": "Work",
          "path": "/work",
          "eyebrow": "Work page",
          "title": "Work designed around teachers",
          "summary": "A clean work page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "teachers",
            "memberships",
            "retreats"
          ]
        },
        {
          "id": "process",
          "label": "Process",
          "path": "/process",
          "eyebrow": "Process page",
          "title": "Process designed around memberships",
          "summary": "A clean process page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "memberships",
            "retreats",
            "classes"
          ]
        },
        {
          "id": "team",
          "label": "Team",
          "path": "/team",
          "eyebrow": "Team page",
          "title": "Team designed around retreats",
          "summary": "A clean team page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "retreats",
            "classes",
            "teachers"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around classes",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        }
      ]
    },
    {
      "slug": "sidebar-navigation",
      "title": "Stillpoint Yoga House",
      "layout": "sidebarNav",
      "layoutName": "Sidebar Navigation",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Classes built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        },
        {
          "id": "menu",
          "label": "Menu",
          "path": "/menu",
          "eyebrow": "Menu page",
          "title": "Menu designed around teachers",
          "summary": "A clean menu page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "teachers",
            "memberships",
            "retreats"
          ]
        },
        {
          "id": "stories",
          "label": "Stories",
          "path": "/stories",
          "eyebrow": "Stories page",
          "title": "Stories designed around memberships",
          "summary": "A clean stories page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "memberships",
            "retreats",
            "classes"
          ]
        },
        {
          "id": "booking",
          "label": "Booking",
          "path": "/booking",
          "eyebrow": "Booking page",
          "title": "Booking designed around retreats",
          "summary": "A clean booking page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "retreats",
            "classes",
            "teachers"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around classes",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        }
      ]
    },
    {
      "slug": "editorial-stack",
      "title": "Stillpoint Yoga Works",
      "layout": "editorialStack",
      "layoutName": "Editorial Stack",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Classes built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        },
        {
          "id": "packages",
          "label": "Packages",
          "path": "/packages",
          "eyebrow": "Packages page",
          "title": "Packages designed around teachers",
          "summary": "A clean packages page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "teachers",
            "memberships",
            "retreats"
          ]
        },
        {
          "id": "gallery",
          "label": "Gallery",
          "path": "/gallery",
          "eyebrow": "Gallery page",
          "title": "Gallery designed around memberships",
          "summary": "A clean gallery page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "memberships",
            "retreats",
            "classes"
          ]
        },
        {
          "id": "reviews",
          "label": "Reviews",
          "path": "/reviews",
          "eyebrow": "Reviews page",
          "title": "Reviews designed around retreats",
          "summary": "A clean reviews page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "retreats",
            "classes",
            "teachers"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around classes",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        }
      ]
    },
    {
      "slug": "service-directory",
      "title": "Stillpoint Yoga Atelier",
      "layout": "serviceDirectory",
      "layoutName": "Service Directory",
      "pages": [
        {
          "id": "home",
          "label": "Home",
          "path": "/",
          "eyebrow": "Modern website starter",
          "title": "Classes built for trust and action",
          "summary": "A clean home page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        },
        {
          "id": "overview",
          "label": "Overview",
          "path": "/overview",
          "eyebrow": "Overview page",
          "title": "Overview designed around teachers",
          "summary": "A clean overview page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "teachers",
            "memberships",
            "retreats"
          ]
        },
        {
          "id": "locations",
          "label": "Locations",
          "path": "/locations",
          "eyebrow": "Locations page",
          "title": "Locations designed around memberships",
          "summary": "A clean locations page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "memberships",
            "retreats",
            "classes"
          ]
        },
        {
          "id": "journal",
          "label": "Journal",
          "path": "/journal",
          "eyebrow": "Journal page",
          "title": "Journal designed around retreats",
          "summary": "A clean journal page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "retreats",
            "classes",
            "teachers"
          ]
        },
        {
          "id": "contact",
          "label": "Contact",
          "path": "/contact",
          "eyebrow": "Contact page",
          "title": "Contact designed around classes",
          "summary": "A clean contact page with focused copy blocks, visual proof, contact cues, and conversion sections for classes, teachers, memberships, retreats.",
          "blocks": [
            "classes",
            "teachers",
            "memberships"
          ]
        }
      ]
    }
  ]
});

export default templates;
