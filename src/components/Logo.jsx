import React from "react";
import logo from "../assets/marketminds-logo.png";

/**
 * Marketminds brand logo + wordmark.
 * Use the `size` prop ("sm" | "md" | "lg") to control how big it renders.
 */
const Logo = ({ size = "md", showWordmark = true, className = "" }) => {
  return (
    <div className={`mm-logo mm-logo--${size} ${className}`}>
      <img src={logo} alt="Marketminds logo" className="mm-logo-img" />
      {showWordmark && (
        <span className="mm-logo-wordmark">
          Market<span className="mm-logo-wordmark-accent">minds</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
