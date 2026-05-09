import React from "react";

const EarningsCard = ({ title, amount }) => {
  return (
    <div className="card">
      <p>{title}</p>
      <h3>KES {amount}</h3>
    </div>
  );
};

export default EarningsCard;