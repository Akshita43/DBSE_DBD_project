import React from "react";
import { useNavigate } from "react-router-dom";

function AccountCard({
  account,
  showActions = true,
}) {
  const navigate = useNavigate();

  if (!account) {
    return null;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const handleTransfer = () => {
    navigate("/transfer", {
      state: {
        fromAccount: account.accountNumber,
      },
    });
  };

  return (
    <div className="account-card">
      <div className="account-card-header">
        <div>
          <span className="account-type">
            {account.type || "Savings Account"}
          </span>

          <h3>
            {account.accountNumber || "XXXX XXXX XXXX"}
          </h3>
        </div>

        <div className="account-card-icon">
          {account.type === "Current" ? "▣" : "₹"}
        </div>
      </div>

      <div className="account-card-body">
        <span>Available Balance</span>

        <h2>
          {formatCurrency(account.balance)}
        </h2>
      </div>

      <div className="account-card-footer">
        <div>
          <span>Account Status</span>

          <strong className="account-status">
            {account.status || "Active"}
          </strong>
        </div>

        {showActions && (
          <div className="account-actions">
            <button
              className="small-btn"
              onClick={handleTransfer}
            >
              Transfer
            </button>

            <button
              className="small-btn secondary"
              onClick={() => navigate("/transactions")}
            >
              History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountCard;