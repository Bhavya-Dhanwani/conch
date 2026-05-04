const offerNames = ["Starter", "Signature", "Scale"];
const offerPrices = ["$1.2k", "$2.8k", "$5.4k"];

export function createTemplateSet(config) {
  return config.variants.map((variant, index) => {
    const palette = config.palettes[index % config.palettes.length];
    const slug = config.folder + "-" + variant.slug;
    return {
      slug,
      niche: config.niche,
      folder: config.folder,
      templateNumber: index + 1,
      title: variant.title,
      layout: variant.layout,
      layoutName: variant.layoutName,
      description: variant.layoutName + " multipage template for " + config.niche.toLowerCase() + " with modern minimal sections, clear navigation, and booking-ready content.",
      palette,
      sections: ["Hero", "Services", "Proof", "Pricing", "Contact"],
      pages: variant.pages,
      metrics: [{ value: "5", label: "Pages included" }, { value: "8+", label: "Reusable sections" }, { value: "100%", label: "React components" }],
      highlights: ["Focused " + config.terms[0] + " story", "Conversion block for " + config.terms[1], "Clean proof area for " + config.terms[2]],
      process: ["Clarify the visitor goal", "Show services and proof", "Guide visitors into a simple inquiry"],
      copyPoints: ["A compact section for " + config.terms[0] + " with strong hierarchy and useful detail.", "A trust-building block around " + config.terms[1] + " that keeps the page scannable.", "A final conversion area for " + config.terms[2] + " and " + config.terms[3] + "."],
      offers: offerNames.map((name, offerIndex) => ({ name, price: offerPrices[offerIndex], detail: name + " package layout with space for " + config.terms[offerIndex % config.terms.length] + "." })),
      prompt: "Build a modern minimal multipage " + config.niche.toLowerCase() + " website called " + variant.title + " using the " + variant.layoutName.toLowerCase() + " layout. Include pages for " + variant.pages.map((page) => page.label).join(", ") + ", clean React components, React Router data routes, and sections for " + config.terms.join(", ") + ".",
    };
  });
}
