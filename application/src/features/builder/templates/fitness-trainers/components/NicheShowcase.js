export default function NicheShowcase({ template }) {
  return (
    <section aria-label="Fitness Trainers showcase">
      <h2>{template.title}</h2>
      <p>{template.description}</p>
    </section>
  );
}
