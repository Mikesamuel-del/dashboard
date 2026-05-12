import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import Logo from "../components/Logo";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Login failed");
      }

      setAuth({
        token: data.token,
        user: data.user,
      });

      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mm-auth-shell">
      <div className="mm-auth-card">
        <div className="mm-auth-brand">
          <Logo size="lg" />
          <p className="mm-auth-tagline">
            Welcome back to Marketminds
          </p>
        </div>

        <h2 className="mm-auth-title">Login</h2>

        {error ? (
          <div className="auth-error">{error}</div>
        ) : null}

        <form onSubmit={submit} className="mm-auth-form">
          <label>
            Email

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@email.com"
              required
            />
          </label>

          <label>
            Password

            <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                required
                style={{
                  width: "100%",
                  paddingRight: "45px",
                }}
              />

              <span
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  userSelect: "none",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </label>

          <button
            disabled={loading}
            type="submit"
            className="mm-auth-btn"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mm-auth-inline">
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>
        </form>

        <p className="mm-auth-footer">
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
