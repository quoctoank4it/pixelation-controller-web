import React from "react";

const tabs = [
  { key: "home", label: "Home" },
  { key: "history", label: "History" },
  { key: "config", label: "Config" },
];

const Header = ({ active, onChange }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.brand}>Toan's App</div>
      <nav style={styles.nav}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              ...styles.tab,
              ...(active === t.key ? styles.active : {}),
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 32,
    padding: "12px 24px",
    background: "#111",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  brand: { fontWeight: 600 },
  nav: { display: "flex", gap: 8 },
  tab: {
    background: "transparent",
    border: "1px solid #444",
    color: "#ccc",
    padding: "6px 14px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
  },
  active: {
    background: "#28a745",
    color: "#fff",
  },
};

export default Header;
