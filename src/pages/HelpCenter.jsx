import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function HelpCenter() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      question: "How do I activate my account?",
      answer:
        "Choose a package and complete payment via M-Pesa STK push.",
    },
    {
      question: "What is minimum withdrawal?",
      answer:
        "Bronze: KES 3500, Silver: KES 2500, Gold: KES 2000.",
    },
    {
      question: "Why can't I withdraw?",
      answer:
        "You need an active package before withdrawing.",
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        color: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Help Center
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        Find answers to common questions.
      </p>

      {faqs.map((faq, index) => (
        <div
          key={index}
          style={{
            marginBottom: "15px",
            border: "1px solid #333",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() =>
              setOpen(
                open === index
                  ? null
                  : index
              )
            }
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              background: "#111827",
              color: "white",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {faq.question}
          </button>

          {open === index && (
            <div
              style={{
                padding: "15px",
                background: "#1f2937",
              }}
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}

      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#60a5fa",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
