import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const canAccessAdsSurvey = (pkg) => {
  const p = (pkg || "none").toLowerCase();

  return (
    p === "gold" || p === "silver"
  );
};

/* ===== SURVEY PAGES ===== */

const SURVEYS = [
  {
    title: "Technology Usage",
    reward: 5,
    questions: [
      "How many hours do you spend online daily?",
      "Which smartphone brand do you use?",
      "Do you shop online regularly?",
    ],
  },

  {
    title: "Social Media Habits",
    reward: 5,
    questions: [
      "Which social media app do you use most?",
      "How many times do you check social media daily?",
      "Do online ads influence your purchases?",
    ],
  },

  {
    title: "Entertainment Preferences",
    reward: 5,
    questions: [
      "Which streaming platform do you prefer?",
      "How often do you watch movies weekly?",
      "Do you pay for music subscriptions?",
    ],
  },

  {
    title: "Shopping Experience",
    reward: 5,
    questions: [
      "Which online marketplace do you use most?",
      "Do you compare prices before buying?",
      "Have you ever purchased through social media?",
    ],
  },
];

export default function Survey() {
  const { user, updateUser } =
    useAuth();

  const [page, setPage] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [completedPages,
    setCompletedPages] =
    useState([]);

  if (
    !canAccessAdsSurvey(
      user?.package
    )
  ) {
    return (
      <div className="container">
        <h2>
          Upgrade Required
        </h2>

        <p>
          Surveys are available
          for Silver and Gold
          members only.
        </p>

        <Link to="/">
          Go back to Dashboard
        </Link>
      </div>
    );
  }

  const currentSurvey =
    SURVEYS[page];

  const handleComplete =
    async () => {
      if (
        completedPages.includes(page)
      ) {
        alert(
          "You already completed this survey."
        );

        return;
      }

      setLoading(true);

      try {
        /* ===== OPTIONAL BACKEND SAVE ===== */

        await fetch(
          `${API_BASE}/api/user/survey-reward`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              userId: user?.id,
              reward:
                currentSurvey.reward,
            }),
          }
        ).catch(() => {});

        /* ===== UPDATE LOCAL BALANCE ===== */

        const newBalance =
          Number(
            user?.balance || 0
          ) +
          currentSurvey.reward;

        updateUser({
          balance: newBalance,
        });

        setCompletedPages([
          ...completedPages,
          page,
        ]);

        alert(
          `You earned KES ${currentSurvey.reward}`
        );

        /* ===== NEXT PAGE ===== */

        if (
          page <
          SURVEYS.length - 1
        ) {
          setPage(page + 1);
        }
      } catch (err) {
        console.log(err);

        alert(
          "Failed to submit survey"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="container"
      style={{
        padding: "16px",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <Link to="/">
          ← Back to Dashboard
        </Link>
      </div>

      <div
        style={{
          background:
            "rgba(255,255,255,0.05)",
          padding: "20px",
          borderRadius: "16px",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
          }}
        >
          Paid Surveys
        </h1>

        <p
          style={{
            opacity: 0.8,
            marginBottom: "20px",
          }}
        >
          Complete surveys and
          earn KES 5 per page.
        </p>

        <div
          style={{
            marginBottom: "20px",
            padding: "14px",
            borderRadius: "12px",
            background:
              "rgba(37,99,235,0.15)",
          }}
        >
          <strong>
            Current Reward:
          </strong>{" "}
          KES{" "}
          {currentSurvey.reward}
        </div>

        <h2
          style={{
            marginBottom: "18px",
          }}
        >
          {currentSurvey.title}
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "18px",
          }}
        >
          {currentSurvey.questions.map(
            (question, index) => (
              <div
                key={index}
                style={{
                  padding: "14px",
                  borderRadius:
                    "12px",
                  background:
                    "rgba(255,255,255,0.04)",
                }}
              >
                <p
                  style={{
                    marginBottom:
                      "10px",
                    fontWeight:
                      "600",
                  }}
                >
                  {index + 1}.{" "}
                  {question}
                </p>

                <input
                  type="text"
                  placeholder="Type your answer..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    background:
                      "transparent",
                    color:
                      "inherit",
                    boxSizing:
                      "border-box",
                  }}
                />
              </div>
            )
          )}
        </div>

        <button
          onClick={
            handleComplete
          }
          disabled={
            loading ||
            completedPages.includes(
              page
            )
          }
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background:
              completedPages.includes(
                page
              )
                ? "#555"
                : "#16a34a",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Submitting..."
            : completedPages.includes(
                page
              )
            ? "Completed"
            : `Submit & Earn KES ${currentSurvey.reward}`}
        </button>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          Survey Page {page + 1} of{" "}
          {SURVEYS.length}
        </div>
      </div>
    </div>
  );
}
