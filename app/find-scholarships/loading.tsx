export default function FindScholarshipsLoading() {
  return (
    <div style={{ paddingBottom: 64 }}>
      <div style={{ padding: "40px 0 24px", maxWidth: 720 }}>
        <div className="skeleton" style={{ width: 140, height: 16, marginBottom: 12, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: "80%", height: 38, marginBottom: 12, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: "95%", height: 20, borderRadius: 4 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)", gap: 24, alignItems: "start" }}>
        <div className="panel" style={{ padding: 22, height: 500 }}>
          <div className="skeleton" style={{ width: 180, height: 24, marginBottom: 20, borderRadius: 6 }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ width: "100%", height: 42, marginBottom: 14, borderRadius: 6 }} />
          ))}
        </div>

        <div className="panel" style={{ padding: 22, height: 500 }}>
          <div className="skeleton" style={{ width: 180, height: 24, marginBottom: 20, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: "100%", height: 100, marginBottom: 14, borderRadius: 8 }} />
          <div className="skeleton" style={{ width: "100%", height: 100, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}
