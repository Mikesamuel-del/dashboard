import React from "react";
import { useNavigate } from "react-router-dom";

const canAccess = (pkg, feature) => {
  const p = (pkg || "none").toLowerCase();
  if (p === "gold") return true;
  if (p === "silver") return feature !== "writing";
  if (p === "bronze") return feature === "referral";
  return false;
};

const ActionButtons = ({ userPackage }) => {
  const navigate = useNavigate();

  return (
    <div className="actions">
      <button
        disabled={!canAccess(userPackage, "adsSurvey")}
        onClick={() => navigate("/ads")}
        title={
          canAccess(userPackage, "adsSurvey")
            ? ""
            : "Upgrade your package to access Ads & Surveys"
        }
      >
        🎥 Watch Ads to Earn
      </button>

      <button
        disabled={!canAccess(userPackage, "writing")}
        onClick={() => navigate("/writing")}
        title={
          canAccess(userPackage, "writing")
            ? ""
            : "Upgrade your package to access Writing"
        }
      >
        ✍️ Start Online Writing
      </button>

      <button
        disabled={!canAccess(userPackage, "adsSurvey")}
        onClick={() => navigate("/survey")}
        title={
          canAccess(userPackage, "adsSurvey")
            ? ""
            : "Upgrade your package to access Ads & Surveys"
        }
      >
        📋 Survey Questions
      </button>
    </div>
  );
};

export default ActionButtons;