import React, { useState } from "react";
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
    a: "Share your unique referral code (found in the Referral box on your dashboard). You earn a commission every time someone joins and activates a package using your code. Gold members earn up to 3 referral levels deep.",
  },
  {
    q: "Why can't I withdraw?",
    a: "Withdrawals require an active package. If you see a 'Buy a package first' message, head to the Packages section on your dashboard and activate one.",
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

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container">
      <div className="help-hero">
        <div className="help-hero-brand">
          <Logo size="md" />
        </div>
        <h1 className="help-hero-title">Help Center</h1>
        <p className="help-hero-sub">
          Answers to the most common questions about Marketminds — earnings,
          withdrawals, packages, and referrals.
        </p>

        <div className="help-search">
          <input
            type="text"
            placeholder="Search help articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="help-grid">
        <section className="help-faq-card">
          <h2>Frequently Asked Questions</h2>

          <div className="help-faq-list">
            {filtered.length === 0 && (
              <p className="help-empty">No results for "{query}".</p>
            )}

            {filtered.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.q}
                  className={`help-faq-item${isOpen ? " is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="help-faq-q"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <span className="help-faq-toggle">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <div className="help-faq-a">{item.a}</div>}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="help-contact-card">
          <h3>Still need help?</h3>
          <p>
            Our support team is available 7 days a week. Reach out via any of
            the channels below.
          </p>

          <ul className="help-contact-list">
            <li>
              <strong>Email</strong>
              <a href="mailto: marketmindshelp387@gmail.com">
                marketmindshelp387@gmail.com
              </a>
            </li>
            <li>
              <strong>WhatsApp</strong>
              <a href="https://wa.me/254748459757" target="_blank" rel="noreferrer">
                +254 748 459 757
              </a>
            </li>
            <li>
              <strong>Hours</strong>
              <span>Mon - Sun, 8:00 AM - 9:00 PM EAT</span>
            </li>
          </ul>

          <Link to="/" className="help-back-btn">
            ← Back to Dashboard
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default HelpCenter;
