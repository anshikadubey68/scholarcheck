import Link from "next/link";
import { notFound } from "next/navigation";
import ResultView from "../../../components/ResultView";
import scholarships from "../../../data/scholarships.json";
import { analyze } from "../../../lib/detector";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return scholarships.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const s = scholarships.find((x) => x.id === id);
  return { title: s ? `${s.name} | ScholarCheck` : "Not found | ScholarCheck" };
}

export default async function ScholarshipPage({ params }: Props) {
  const { id } = await params;
  const s = scholarships.find((x) => x.id === id);
  if (!s) notFound();
  const result = analyze({ url: s.url, text: s.text, orgName: s.orgName, contactEmail: s.contactEmail });

  return (
    <div style={{ paddingBottom: 64 }}>
      <section className="hero">
        <p><Link href="/directory">Back to directory</Link></p>
        <h1>{s.name}</h1>
        <p>{s.orgName}, listed at {s.url}</p>
      </section>
      <div className="panel">
        <ResultView result={result} />
        <h2 style={{ marginTop: 28, fontWeight: 700 }}>Text that was analyzed</h2>
        <blockquote className="quote">{s.text}</blockquote>
      </div>
    </div>
  );
}