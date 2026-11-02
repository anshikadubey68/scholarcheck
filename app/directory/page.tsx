import DirectoryList from "../../components/DirectoryList";
import scholarships from "../../data/scholarships.json";
import { analyze } from "../../lib/detector";

export const metadata = { title: "Directory | ScholarCheck" };

export default function Directory() {
  const items = scholarships.map((s) => {
    const r = analyze({ url: s.url, text: s.text, orgName: s.orgName, contactEmail: s.contactEmail });
    return { id: s.id, name: s.name, org: s.orgName, url: s.url, score: r.score, level: r.level };
  });
  return (
    <>
      <section className="hero">
        <h1>Scholarship directory</h1>
        <p>Every listing is scored by the same checks you can run yourself on the home page.</p>
      </section>
      <DirectoryList items={items} />
    </>
  );
}