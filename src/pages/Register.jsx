import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import Logo from "../components/Logo";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword,
    setConfirmPassword] = useState("");

  // REFERRAL CODE
  const [referredBy,
    setReferredBy] = useState(() => {
    try {
      const params =
        new URLSearchParams(
          location.search
        );

      return params.get("ref") || "";
    } catch {
      return "";
    }
  });

  const [showPassword,
    setShowPassword] = useState(false);

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
        `${API_BASE}/api/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            email,
            password,
            confirmPassword,

            // REFERRAL CODE
            referredBy:
              referredBy || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message ||
            "Registration failed"
        );
      }

      toast.success(
        data.message ||
          "Account created successfully"
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
        err?.message ||
          "Registration failed"
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
            Create your Marketminds
            account
          </p>
        </div>

        <h2 className="mm-auth-title">
          Register
        </h2>

        <form
          onSubmit={submit}
          className="mm-auth-form"
        >
          <label>
            Full name

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              type="text"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label>
            Phone number

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              type="text"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label>
            Email

            <input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              type="email"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </label>

          {/* REFERRAL FIELD */}
          <label>
            Referral code (optional)

            <input
              value={referredBy}
              onChange={(e) =>
                setReferredBy(
                  e.target.value
                )
              }
              type="text"
              placeholder="Referral code"
              style={{
                width: "100%",
                boxSizing: "border-box",
              }}
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
              ? "Creating account..."
              : "Register"}
          </button>
        </form>

        <p className="mm-auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
