export default function NicheShowcase({ template }) {
  return (
    <section aria-label="Plumbers showcase">
      <h2>{template.title}</h2>
      <p>{template.description}</p>
    </section>
  );
}
