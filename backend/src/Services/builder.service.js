import { GoogleGenerativeAI } from "@google/generative-ai";
import { v2 as cloudinary } from "cloudinary";

import { AppError } from "../Utilities/appError.js";

const fallbackPalette = ["#f8fafc", "#2563eb", "#111827"];

const tidy = (value, fallback = "", maxLength = 220) => {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, maxLength) || fallback;
};

const slugify = (value) =>
  tidy(value, "page")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "page";

const arrayOfStrings = (value, fallback, limit = 6) => {
  if (!Array.isArray(value)) return fallback;
  const items = value.map((item) => tidy(item)).filter(Boolean).slice(0, limit);
  return items.length ? items : fallback;
};

const createSection = (title, eyebrow, text, items) => ({
  title,
  eyebrow,
  text,
  items,
});

export const buildLocalDraft = (prompt, logoUrl = "") => {
  const words = prompt
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const readableName = words.slice(0, 2).join(" ") || "Conch";
  const brand = `${readableName[0]?.toUpperCase() || "C"}${readableName.slice(1)} Studio`;

  return {
    brand,
    logoUrl,
    palette: fallbackPalette,
    navigation: ["Home", "Services", "About", "Pricing", "Contact"],
    pages: [
      {
        id: "home",
        label: "Home",
        headline: `A modern website for ${readableName.toLowerCase()}`,
        subheadline:
          "A full multipage draft with conversion-first copy, service structure, proof, and contact flow.",
        primaryAction: "Book a call",
        secondaryAction: "Explore services",
        sections: [
          createSection("Clear Positioning", "Hero", "A direct first section that explains the offer and audience.", [
            "Benefit-led headline",
            "Strong action buttons",
            "Logo-ready navigation",
          ]),
          createSection("Featured Services", "Offer", "A scannable grid that introduces the core services.", [
            "Starter offer",
            "Signature offer",
            "Custom work",
          ]),
          createSection("Trust Proof", "Proof", "A dedicated area for outcomes, testimonials, credentials, or local proof.", [
            "Client result",
            "Review quote",
            "Process metric",
          ]),
        ],
      },
      {
        id: "services",
        label: "Services",
        headline: "Services explained with detail and confidence",
        subheadline: "A full service page that helps visitors understand fit, pricing logic, and next steps.",
        primaryAction: "Request quote",
        secondaryAction: "Compare packages",
        sections: [
          createSection("Service Packages", "Services", "Three clean offers with outcomes and ideal customer fit.", [
            "Essentials",
            "Premium",
            "Custom",
          ]),
          createSection("How It Works", "Process", "A simple timeline that removes friction from buying.", [
            "Discovery",
            "Plan",
            "Launch",
          ]),
          createSection("Questions", "FAQ", "Short answers to common buyer objections.", [
            "Timeline",
            "Budget",
            "Support",
          ]),
        ],
      },
      {
        id: "about",
        label: "About",
        headline: "A credible story behind the business",
        subheadline: "A page for mission, team, experience, and personality without clutter.",
        primaryAction: "Meet the team",
        secondaryAction: "See work",
        sections: [
          createSection("Story", "About", "A concise origin story shaped around trust and expertise.", [
            "Mission",
            "Experience",
            "Values",
          ]),
          createSection("Team", "People", "Profiles or role cards for the people behind the service.", [
            "Founder",
            "Specialist",
            "Support",
          ]),
        ],
      },
      {
        id: "contact",
        label: "Contact",
        headline: "Make the next step obvious",
        subheadline: "A direct contact page with inquiry copy, availability cues, and simple conversion blocks.",
        primaryAction: "Send inquiry",
        secondaryAction: "Call now",
        sections: [
          createSection("Inquiry", "Contact", "A clean contact area for form fields and response expectations.", [
            "Name",
            "Email",
            "Project details",
          ]),
          createSection("Location", "Details", "Useful business information without overwhelming the page.", [
            "Hours",
            "Service area",
            "Response time",
          ]),
        ],
      },
    ],
  };
};

const extractJson = (text) => {
  const cleaned = text
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Generator did not return JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
};

const normalizeSection = (section, fallback, index) => ({
  title: tidy(section?.title, fallback.title || `Section ${index + 1}`),
  eyebrow: tidy(section?.eyebrow, fallback.eyebrow || "Section", 48),
  text: tidy(section?.text, fallback.text || "Generated content section.", 360),
  items: arrayOfStrings(section?.items, fallback.items || ["Detail", "Proof", "Action"], 5),
});

const normalizePage = (page, fallback, index) => {
  const label = tidy(page?.label, fallback.label || `Page ${index + 1}`, 42);
  const sections = Array.isArray(page?.sections) ? page.sections : [];

  return {
    id: slugify(page?.id || label),
    label,
    headline: tidy(page?.headline, fallback.headline, 120),
    subheadline: tidy(page?.subheadline, fallback.subheadline, 260),
    primaryAction: tidy(page?.primaryAction, fallback.primaryAction, 42),
    secondaryAction: tidy(page?.secondaryAction, fallback.secondaryAction, 42),
    sections: (sections.length ? sections : fallback.sections)
      .slice(0, 6)
      .map((section, sectionIndex) =>
        normalizeSection(section, fallback.sections[sectionIndex] || fallback.sections[0], sectionIndex),
      ),
  };
};

const normalizeDraft = (draft, prompt, logoUrl) => {
  const fallback = buildLocalDraft(prompt, logoUrl);
  const palette = Array.isArray(draft.palette) ? draft.palette.slice(0, 3) : fallback.palette;
  const pages = Array.isArray(draft.pages) ? draft.pages : [];

  return {
    brand: tidy(draft.brand, fallback.brand, 48),
    logoUrl: tidy(draft.logoUrl, logoUrl, 500),
    palette: palette.length === 3 ? palette : fallback.palette,
    navigation: arrayOfStrings(draft.navigation, fallback.navigation, 6),
    pages: (pages.length ? pages : fallback.pages)
      .slice(0, 6)
      .map((page, index) => normalizePage(page, fallback.pages[index] || fallback.pages[0], index)),
  };
};

const getGeminiPrompt = ({ prompt, mode, logoUrl }) => `
You are CONCH, an AI website builder. Generate a complete, modern, minimal, clean multipage website from the user's description.

User description:
${prompt}

Uploaded logo URL:
${logoUrl || "No logo uploaded"}

Build mode: ${mode}

Rules:
- Create complete webpage content, not just a landing screen.
- Shape the content so it can render in a modern ecommerce/storefront layout for any niche.
- Treat services, appointments, products, packages, listings, or consultations as catalog cards depending on the niche.
- Do not include a brand-logo strip, partner brand carousel, fake global brands, or copied brand names.
- Do not reference images from templates. Write content that works with fresh generated visual cards.
- Include 4 to 6 pages.
- Every page must have a hero headline, subheadline, two CTA labels, and 2 to 5 content sections.
- Every section must include title, eyebrow, one useful sentence, and 3 to 5 bullet items.
- Keep copy specific to the user's niche and business.
- Use a balanced palette with light background, accent, and dark text.
- Return only valid JSON.

Return this exact JSON shape:
{
  "brand": "short brand name",
  "logoUrl": "${logoUrl}",
  "palette": ["#lightBackground", "#accent", "#darkText"],
  "navigation": ["Home", "Services", "About", "Pricing", "Contact"],
  "pages": [
    {
      "id": "home",
      "label": "Home",
      "headline": "page hero headline",
      "subheadline": "page hero supporting text",
      "primaryAction": "primary button",
      "secondaryAction": "secondary button",
      "sections": [
        {
          "eyebrow": "small label",
          "title": "section title",
          "text": "one useful sentence",
          "items": ["item one", "item two", "item three"]
        }
      ]
    }
  ]
}
`;

export const generateWebsiteDraft = async ({ prompt = "", mode = "Instant", logoUrl = "" } = {}) => {
  const userPrompt = tidy(prompt, "", 1200);
  const uploadedLogoUrl = tidy(logoUrl, "", 500);

  if (!userPrompt) {
    throw new AppError("Prompt is required", 400);
  }

  if (!process.env.GEMINI_API_KEY) {
    return {
      source: "local",
      draft: buildLocalDraft(userPrompt, uploadedLogoUrl),
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || process.env.MODEL || "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: mode === "Deep" ? 0.78 : 0.48,
      },
    });
    const result = await model.generateContent(getGeminiPrompt({ prompt: userPrompt, mode, logoUrl: uploadedLogoUrl }));
    const text = result.response.text();

    return {
      source: "gemini",
      draft: normalizeDraft(extractJson(text), userPrompt, uploadedLogoUrl),
    };
  } catch (error) {
    return {
      source: "local",
      warning: error.message,
      draft: buildLocalDraft(userPrompt, uploadedLogoUrl),
    };
  }
};

const configureCloudinary = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new AppError(
      "Cloudinary env vars are missing: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
      500,
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

export const uploadBuilderLogo = async (file) => {
  if (!file) {
    throw new AppError("Logo file is required", 400);
  }

  configureCloudinary();

  let result;

  try {
    result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "conch/builder-logos",
          resource_type: "image",
          transformation: [{ width: 512, height: 512, crop: "limit" }],
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(uploadResult);
        },
      );

      stream.end(file.buffer);
    });
  } catch (error) {
    if (error.http_code === 401 || /invalid cloud_name/i.test(error.message || "")) {
      throw new AppError(
        "Cloudinary rejected the upload. Check CLOUDINARY_CLOUD_NAME in backend/.env; it must be your Cloudinary cloud name, not Root, folder name, API key, or account name.",
        500,
      );
    }

    throw new AppError(error.message || "Cloudinary upload failed", 500);
  }

  return {
    logoUrl: result.secure_url,
    publicId: result.public_id,
  };
};
