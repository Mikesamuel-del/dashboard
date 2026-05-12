import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const FAQS = [
  {
    q: "How do I activate my account to start earning?",
    a: "Go to the Dashboard, choose a package (Bronze, Silver or Gold), and complete the deposit via M-Pesa STK push. Your package is activated automatically once the payment is confirmed.",
  },
  {
    q: "What is the minimum withdrawal amount?",
    a: "Bronze members: KES 3,500. Silver members: KES 2,500. Gold members: KES 2,000. Withdrawals are processed to the M-Pesa number on your account.",
  },
  {
    q: "How does the referral program work?",
    a: "Share your unique referral code found in the Referral box on your dashboard. You earn a commission every time someone joins and activates a package using your code.",
  },
  {
    q: "Why can't I withdraw?",
    a: "Withdrawals require an active package. If you see a 'Buy a package first' message, go to the Packages section and activate one.",
  },
  {
    q: "I deposited but my balance hasn't updated. What should I do?",
    a: "Wait 1-2 minutes and refresh your dashboard. If the balance still does not reflect, contact support with your M-Pesa transaction code.",
  },
  {
    q: "How do I change my M-Pesa number or password?",
    a: "Open the Account page from the dashboard quick-links. You can update your phone number and reset your password from there.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] =
    useState(null);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return FAQS.filter(
      (f) =>
        f.q
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        f.a
          .toLowerCase()
          .includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div
      className="container"
      style={{
        padding: "16px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        className="help-hero"
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <div
          className="help-hero-brand"
          style={{
            marginBottom: "10px",
          }}
        >
          <Logo size="md" />
        </div>

        <h1
          className="help-hero-title"
          style={{
            fontSize: "2rem",
            marginBottom: "10px",
          }}
        >
          Help Center
        </h1>

        <p
          className="help-hero-sub"
          style={{
            maxWidth: "600px",
            margin: "0 auto 20px",
            lineHeight: "1.6",
          }}
        >
          Answers to the most common
          questions about Marketminds —
          earnings, withdrawals, packages,
          and referrals.
        </p>

        <div
          className="help-search"
          style={{
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            placeholder="Search help articles..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border:
                "1px solid rgba(255,255,255,0.1)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div
        className="help-grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <section
          className="help-faq-card"
          style={{
            padding: "20px",
            borderRadius: "16px",
            background:
              "rgba(255,255,255,0.04)",
          }}
        >
          <h2
            style={{
              marginBottom: "18px",
            }}
          >
            Frequently Asked Questions
          </h2>

          <div className="help-faq-list">
            {filtered.length === 0 && (
              <p className="help-empty">
                No results for "{query}"
              </p>
            )}

            {filtered.map((item, i) => {
              const isOpen =
                openIndex === i;

              return (
                <div
                  key={i}
                  className={`help-faq-item ${
                    isOpen
                      ? "is-open"
                      : ""
                  }`}
                  style={{
                    marginBottom: "14px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <button
                    type="button"
                    className="help-faq-q"
                    onClick={() =>
                      setOpenIndex(
                        isOpen
                          ? null
                          : i
                      )
                    }
                    style={{
                      width: "100%",
                      border: "none",
                      padding: "16px",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "15px",
                      background:
                        "rgba(255,255,255,0.03)",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    <span>{item.q}</span>

                    <span
                      className="help-faq-toggle"
                      style={{
                        fontSize: "22px",
                        marginLeft: "10px",
                      }}
                    >
                      {isOpen
                        ? "−"
                        : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      className="help-faq-a"
                      style={{
                        padding: "16px",
                        lineHeight: "1.7",
                        background:
                          "rgba(255,255,255,0.02)",
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <aside
          className="help-contact-card"
          style={{
            padding: "20px",
            borderRadius: "16px",
            background:
              "rgba(255,255,255,0.04)",
          }}
        >
          <h3
            style={{
              marginBottom: "12px",
            }}
          >
            Still need help?
          </h3>

          <p
            style={{
              lineHeight: "1.6",
              marginBottom: "20px",
            }}
          >
            Our support team is available
            7 days a week.
          </p>

          <ul
            className="help-contact-list"
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <li>
              <strong>Email</strong>
              <br />

              <a
                href="mailto:support@marketminds.co.ke"
                style={{
                  wordBreak:
                    "break-word",
                }}
              >
                support@marketminds.co.ke
              </a>
            </li>

            <li>
              <strong>WhatsApp</strong>
              <br />

              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noreferrer"
              >
                +254 700 000 000
              </a>
            </li>

            <li>
              <strong>Hours</strong>
              <br />
              <span>
                Mon - Sun, 8:00 AM -
                9:00 PM EAT
              </span>
            </li>
          </ul>

          <Link
            to="/"
            className="help-back-btn"
            style={{
              display: "inline-block",
              marginTop: "24px",
              padding:
                "12px 18px",
              borderRadius: "10px",
              textDecoration:
                "none",
              background:
                "#2563eb",
              color: "#fff",
              fontWeight: "600",
            }}
          >
            ← Back to Dashboard
          </Link>
        </aside>
      </div>
    </div>
  );
}
