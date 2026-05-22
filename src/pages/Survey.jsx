import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Your Freecash referral link
const FREECASH_URL = "https://freecash.com/r/YOUR_REFERRAL_CODE";

// Only Silver + Gold can access
const canAccessAdsSurvey = (pkg) => {
  const p = (pkg || "none").toLowerCase();
  return p === "gold" || p === "silver";
};

export default function Ads() {
  const { user } = useAuth();

  if (!canAccessAdsSurvey(user?.package)) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Upgrade Required</h2>

        <p style={styles.text}>
          Ads & Surveys are available on Silver or Gold packages.
        </p>

        <Link style={styles.link} to="/">
          ← Go back to Dashboard
        </Link>
      </div>
    );
  }

  const openFreecash = () => {
    window.open(FREECASH_URL, "_blank");
  };

  return (
    <div style={styles.container}>
      <Link style={styles.link} to="/">
        ← Back to Dashboard
      </Link>

      <h1 style={styles.title}>Earn with Freecash</h1>

      <p style={styles.subtitle}>
        Complete surveys, games, and offers to earn rewards.
      </p>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Freecash Offerwall</h3>

        <p style={styles.text}>
          Access verified surveys and tasks through Freecash.
        </p>

        <button onClick={openFreecash} style={styles.button}>
          Open Freecash
        </button>
      </div>
    </div>
  );
}

/* ===== GOLD + DARK THEME ===== */

const styles = {
  container: {
    minHeight: "100vh",
    padding: "20px",
    maxWidth: "700px",
    margin: "0 auto",
    background: "#0b0b0f",
    color: "#f5f5f5",
  },

  title: {
    color: "#d4af37",
    fontSize: "28px",
    marginTop: "15px",
  },

  subtitle: {
    opacity: 0.8,
    marginBottom: "20px",
  },

  text: {
    opacity: 0.85,
  },

  card: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "14px",
    background: "rgba(255, 215, 0, 0.06)",
    border: "1px solid rgba(212, 175, 55, 0.3)",
  },

  cardTitle: {
    color: "#d4af37",
    marginBottom: "10px",
  },

  button: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#d4af37",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },

  link: {
    color: "#d4af37",
    textDecoration: "none",
    display: "inline-block",
    marginBottom: "10px",
  },
};
