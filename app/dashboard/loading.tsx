export default function DashboardLoading() {
  return (
    <div style={{ paddingBottom: 64 }}>
      {/* Top Welcome Header Skeleton */}
      <div
        className="panel"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          padding: "24px 28px",
          minHeight: 110,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 10, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: "70%", height: 32, marginBottom: 10, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: "50%", height: 16, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div className="skeleton" style={{ width: 170, height: 40, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: 90, height: 40, borderRadius: 6 }} />
        </div>
      </div>

      {/* 4 Metric Highlights Grid Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="panel" style={{ padding: "18px 20px", height: 115 }}>
            <div className="skeleton" style={{ width: 110, height: 12, marginBottom: 10, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: 70, height: 32, marginBottom: 8, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: 130, height: 12, borderRadius: 4 }} />
          </div>
        ))}
      </div>

      {/* 2-Column Dashboard Sections Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)", gap: 24, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="panel" style={{ padding: 22, height: 260 }}>
            <div className="skeleton" style={{ width: 190, height: 24, marginBottom: 20, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: "100%", height: 64, marginBottom: 12, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: "100%", height: 64, borderRadius: 8 }} />
          </div>

          <div className="panel" style={{ padding: 22, height: 240 }}>
            <div className="skeleton" style={{ width: 210, height: 24, marginBottom: 20, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: "100%", height: 50, marginBottom: 10, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: "100%", height: 50, borderRadius: 6 }} />
          </div>
        </div>

        <div className="panel" style={{ padding: 22, height: 420 }}>
          <div className="skeleton" style={{ width: 150, height: 24, marginBottom: 20, borderRadius: 6 }} />
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="skeleton" style={{ width: "100%", height: 26, marginBottom: 12, borderRadius: 4 }} />
          ))}
          <div className="skeleton" style={{ width: "100%", height: 38, marginTop: 14, borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );
}
