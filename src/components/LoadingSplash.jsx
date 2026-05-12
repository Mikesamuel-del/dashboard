import React from "react";
import logo from "../assets/marketminds-logo.png";

/**
 * Full-screen loading splash that shows the Marketminds logo while
 * the app is bootstrapping. Render it whenever your top-level loading
 * state is true (e.g. before the user/auth state has resolved).
 */
const LoadingSplash = ({ message = "Loading Marketminds..." }) => {
  return (
    <div className="mm-splash" role="status" aria-live="polite">
      <div className="mm-splash-inner">
        <img
          src={logo}
          alt="Marketminds"
          className="mm-splash-logo"
        />
        <div className="mm-splash-bar">
          <span className="mm-splash-bar-fill" />
        </div>
        <p className="mm-splash-text">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSplash;
