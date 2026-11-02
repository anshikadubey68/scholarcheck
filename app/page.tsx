import AnalyzeForm from "../components/AnalyzeForm";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Check a scholarship before you apply</h1>
        <p>Paste the link and the text of the offer. We look for lookalike websites, payment demands, fake organizations, copied descriptions and pressure tactics, and show the evidence for every warning.</p>
      </section>
      <AnalyzeForm />
    </>
  );
}