{/* ===== SMART ALERTS ===== */}
{notifications.length > 0 && (
  <div
    className="dashboard-alerts"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      marginBottom: "20px",
    }}
  >
    {notifications.map((note, index) => (
      <div
        key={index}
        style={{
          padding: "16px",
          borderRadius: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          color: "#fff",
          background:
            note.type === "warning"
              ? "#f59e0b"
              : note.type === "danger"
              ? "#dc2626"
              : note.type === "success"
              ? "#16a34a"
              : "#2563eb",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "220px",
            lineHeight: "1.5",
          }}
        >
          {note.message}
        </div>

        <Link
          to={note.link}
          style={{
            background: "#ffffff",
            color: "#111827",
            padding: "10px 16px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "600",
            whiteSpace: "nowrap",
          }}
        >
          {note.action}
        </Link>
      </div>
    ))}
  </div>
)}
