import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const canAccessWriting = (pkg) =>
  (pkg || "none").toLowerCase() === "gold";

/* ===== WRITING GIGS (curated real-world style tasks) ===== */
const WRITING_TASKS = [
  {
    id: 1,
    title: "Blog Writing Task",
    description:
      "Write a 500-word article on 'How to start freelancing online'.",
    reward: 50,
    link: "https://www.upwork.com/",
  },
  {
    id: 2,
    title: "Product Review Writing",
    description:
      "Write a review for a smartphone or digital product.",
    reward: 40,
    link: "https://www.fiverr.com/",
  },
  {
    id: 3,
    title: "Social Media Content Writing",
    description:
      "Create 10 short captions for Instagram marketing.",
    reward: 30,
    link: "https://www.freelancer.com/",
  },
  {
    id: 4,
    title: "SEO Article Writing",
    description:
      "Write SEO optimized article for a business website.",
    reward: 60,
    link: "https://www.peopleperhour.com/",
  },
];

export default function Writing() {
  const { user, updateUser } = useAuth();

  const [completed, setCompleted] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  if (!canAccessWriting(user?.package)) {
    return (
      <div className="container">
        <h2>Upgrade Required</h2>
        <p>
          Online Writing is available on the Gold package only.
        </p>
        <Link to="/">← Back to Dashboard</Link>
      </div>
    );
  }

  const completeTask = async (task) => {
    if (completed.includes(task.id)) {
      alert("Task already completed.");
      return;
    }

    setLoadingId(task.id);

    try {
      // OPTIONAL backend reward tracking
      await fetch(
        `${API_BASE}/api/user/writing-reward`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            reward: task.reward,
          }),
        }
      ).catch(() => {});

      const newBalance =
        Number(user?.balance || 0) +
        task.reward;

      updateUser({
        balance: newBalance,
      });

      setCompleted((prev) => [
        ...prev,
        task.id,
      ]);

      alert(
        `You earned KES ${task.reward}`
      );
    } catch (err) {
      console.log(err);
      alert("Failed to complete task");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div
      className="container"
      style={{
        padding: "16px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Link to="/">← Back to Dashboard</Link>

      <h1 style={{ marginTop: "10px" }}>
        Online Writing Jobs
      </h1>

      <p style={{ opacity: 0.8 }}>
        Complete writing tasks and earn KES rewards.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {WRITING_TASKS.map((task) => {
          const isDone =
            completed.includes(task.id);

          return (
            <div
              key={task.id}
              style={{
                padding: "16px",
                borderRadius: "14px",
                background:
                  "rgba(255,255,255,0.05)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3>{task.title}</h3>

              <p style={{ opacity: 0.8 }}>
                {task.description}
              </p>

              <p>
                Reward:{" "}
                <b>KES {task.reward}</b>
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href={task.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "10px 14px",
                    background:
                      "#6b7280",
                    color: "#fff",
                    borderRadius:
                      "10px",
                    textDecoration:
                      "none",
                  }}
                >
                  Open Platform
                </a>

                <button
                  onClick={() =>
                    completeTask(task)
                  }
                  disabled={
                    isDone ||
                    loadingId === task.id
                  }
                  style={{
                    padding: "10px 14px",
                    background: isDone
                      ? "#555"
                      : "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius:
                      "10px",
                    cursor: "pointer",
                  }}
                >
                  {loadingId === task.id
                    ? "Processing..."
                    : isDone
                    ? "Completed"
                    : "Claim Reward"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
