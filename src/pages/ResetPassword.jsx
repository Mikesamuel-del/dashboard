import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import Logo from "../components/Logo";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

export default function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error(
        "Passwords do not match"
      );
    }

    if (password.length < 8) {
      return toast.error(
        "Password must be at least 8 characters"
      );
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/user/reset-password/${encodeURIComponent(
          token
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            password,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Reset failed"
        );
      }

      toast.success(
        data.message ||
          "Password updated"
      );

      if (data.token && data.user) {
        setAuth({
          token: data.token,
          user: data.user,
        });
      }

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err?.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mm-auth-shell">
      <div
        className="mm-auth-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          boxSizing: "border-box",
        }}
      >
        <div className="mm-auth-brand">
          <Logo size="lg" />

          <p className="mm-auth-tagline">
            Set a new password
          </p>
        </div>

        <h2 className="mm-auth-title">
          Reset Password
        </h2>

        <form
          onSubmit={submit}
          className="mm-auth-form"
        >
          <label>
            New password

            <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <input
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                minLength={8}
                placeholder="At least 8 characters"
                style={{
                  width: "100%",
                  paddingRight: "50px",
                  boxSizing: "border-box",
                }}
              />

              <span
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "20px",
                  userSelect: "none",
                }}
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </span>
            </div>
          </label>

          <label>
            Confirm password

            <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <input
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                required
                minLength={8}
                placeholder="Repeat password"
                style={{
                  width: "100%",
                  paddingRight: "50px",
                  boxSizing: "border-box",
                }}
              />

              <span
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "20px",
                  userSelect: "none",
                }}
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁️"}
              </span>
            </div>
          </label>

          <button
            disabled={loading}
            type="submit"
            className="mm-auth-btn"
          >
            {loading
              ? "Saving..."
              : "Update Password"}
          </button>
        </form>

        <p className="mm-auth-footer">
          <Link to="/login">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
