import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ADGEM_APP_ID = process.env.REACT_APP_ADGEM_APP_ID;
const ADGEM_WALL_URL = "https://api.adgem.com/v1/wall";

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

  const openAdGem = () => {
    if (!user?.id) {
      alert("User not found");
      return;
    }

    const url = `${ADGEM_WALL_URL}?appid=${ADGEM_APP_ID}&player_id=${user.id}`;

    // Open AdGem offerwall
    window.open(url, "_blank");
  };

  return (
    <div style={styles.container}>
      <Link style={styles.link} to="/">
        ← Back to Dashboard
      </Link>

      <h1 style={styles.title}>Earn with Ads</h1>

      <p style={styles.subtitle}>
        Complete offers and surveys to earn real rewards.
      </p>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>AdGem Offerwall</h3>

        <p style={styles.text}>
          Click below to access verified offers from AdGem. Your earnings will be
          automatically tracked.
        </p>

        <button onClick={openAdGem} style={styles.button}>
          Open Offerwall
        </button>
      </div>
    </div>
  );
}

/* ===== GOLD + LIGHT BLACK THEME ===== */
const styles = {
  container: {
    minHeight: "100vh",
    padding: "20px",
    maxWidth: "700px",
    margin: "0 auto",
    background: "#0b0b0f", // light black
    color: "#f5f5f5",
  },
  title: {
    color: "#d4af37", // gold
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
