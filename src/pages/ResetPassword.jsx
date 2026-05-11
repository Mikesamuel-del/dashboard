import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/user/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to reset password");
      }

      const successMessage =
        data?.message || "Password reset successfully.";

      setMessage(successMessage);
      toast.success(successMessage);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const msg = err?.message || "Failed to reset password";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>

        {error ? <div className="auth-error">{error}</div> : null}
        {message ? <div className="auth-success">{message}</div> : null}

        <form onSubmit={submit} className="auth-form">
          <label>
            New Password
            <div style={{ position: "relative" }}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  paddingRight: "45px",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: 0,
                  lineHeight: 1,
                }}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <button disabled={loading} type="submit">
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <p className="auth-footer">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
