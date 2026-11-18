export default function DirectoryLoading() {
  return (
    <div style={{ paddingBottom: 64 }}>
      <div style={{ padding: "40px 0 24px", maxWidth: 720 }}>
        <div className="skeleton" style={{ width: 140, height: 16, marginBottom: 12, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: "80%", height: 38, marginBottom: 12, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: "95%", height: 20, borderRadius: 4 }} />
      </div>

      <div className="panel" style={{ padding: 22, marginBottom: 24 }}>
        <div className="skeleton" style={{ width: "100%", height: 44, marginBottom: 16, borderRadius: 6 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ width: "100%", height: 38, borderRadius: 6 }} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="panel" style={{ padding: 20, height: 130 }}>
            <div className="skeleton" style={{ width: 120, height: 16, marginBottom: 10, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: "60%", height: 22, marginBottom: 8, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: "40%", height: 14, borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
