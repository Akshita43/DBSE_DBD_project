import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBanking } from "../context/BankingContext";

function Deposit() {
  const navigate = useNavigate();

  const {
    accounts,
    depositMoney,
  } = useBanking();

  const [accountNumber, setAccountNumber] = useState(
    accounts[0]?.accountNumber || ""
  );

  const [amount, setAmount] = useState("");
  const [depositType, setDepositType] = useState("Cash Deposit");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // OTP states
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const selectedAccount = accounts.find(
    (account) =>
      account.accountNumber === accountNumber
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  // Step 1: Deposit button
  const handleDeposit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    const value = Number(amount);

    if (!value || value <= 0) {
      setError("Please enter a valid deposit amount.");
      return;
    }

    // Open OTP popup
    setOtpError("");
    setOtp("");
    setShowOtp(true);
  };

  // Step 2: Verify OTP and deposit
  const confirmDeposit = async () => {
    if (otp !== "123456") {
      setOtpError(
        "Invalid OTP. Use 123456 in demo mode."
      );
      return;
    }

    const result = await depositMoney(
      accountNumber,
      Number(amount),
      depositType
    );

    if (!result.success) {
      setShowOtp(false);
      setError(result.message);
      return;
    }

    setShowOtp(false);
    setOtp("");

    setTransactionId(`DEP${Date.now()}`);

    setSuccess(true);

    setAmount("");
  };

  return (
    <div className="deposit-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <p className="page-greeting">
            Banking
          </p>

          <h1>Deposit Money</h1>

          <p>
            Add money to your AB Bank account.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate("/accounts")}
        >
          ← My Accounts
        </button>
      </div>

      {/* MAIN GRID */}

      <div className="banking-form-grid">

        {/* FORM */}

        <div className="banking-form-card">

          <div className="banking-card-header">

            <div className="banking-card-icon deposit-icon">
              ↓
            </div>

            <div>
              <h2>Make a Deposit</h2>

              <p>
                Enter the amount you want to add.
              </p>
            </div>

          </div>

          {error && (
            <div className="form-error">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="form-success">
              <strong>
                ✓ Deposit Successful
              </strong>

              <span>
                Transaction ID: {transactionId}
              </span>
            </div>
          )}

          <form onSubmit={handleDeposit}>

            {/* ACCOUNT */}

            <div className="form-group">

              <label>Select Account</label>

              <select
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value)
                }
              >

                {accounts.map((account) => (

                  <option
                    key={account.id}
                    value={account.accountNumber}
                  >
                    {account.type} —{" "}
                    {account.accountNumber}
                  </option>

                ))}

              </select>

            </div>

            {/* BALANCE */}

            <div className="available-balance-box">

              <span>
                Current Balance
              </span>

              <strong>
                {formatCurrency(
                  selectedAccount?.balance
                )}
              </strong>

            </div>

            {/* AMOUNT */}

            <div className="form-group">

              <label>Deposit Amount</label>

              <div className="money-input">

                <span>₹</span>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="Enter amount"
                />

              </div>

            </div>

            {/* QUICK AMOUNTS */}

            <div className="quick-amounts">

              <span>Quick select:</span>

              <button
                type="button"
                onClick={() => setAmount("1000")}
              >
                ₹1,000
              </button>

              <button
                type="button"
                onClick={() => setAmount("5000")}
              >
                ₹5,000
              </button>

              <button
                type="button"
                onClick={() => setAmount("10000")}
              >
                ₹10,000
              </button>

              <button
                type="button"
                onClick={() => setAmount("25000")}
              >
                ₹25,000
              </button>

            </div>

            {/* DEPOSIT TYPE */}

            <div className="form-group">

              <label>Deposit Method</label>

              <select
                value={depositType}
                onChange={(e) =>
                  setDepositType(e.target.value)
                }
              >

                <option value="Cash Deposit">
                  Cash Deposit
                </option>

                <option value="Cheque Deposit">
                  Cheque Deposit
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

              </select>

            </div>

            <button
              type="submit"
              className="primary-btn full-width"
            >
              Deposit Money
            </button>

          </form>

        </div>

        {/* SIDE INFO */}

        <div className="banking-info-card">

          <div className="info-card-header">

            <div>
              <h3>Deposit Information</h3>

              <p>
                Important information
              </p>
            </div>

            <span className="info-card-icon">
              ℹ️
            </span>

          </div>

          <div className="info-list">

            <div className="info-list-item">
              <span>✓</span>

              <p>
                Deposits are added instantly in demo mode.
              </p>
            </div>

            <div className="info-list-item">
              <span>✓</span>

              <p>
                You can deposit into any active account.
              </p>
            </div>

            <div className="info-list-item">
              <span>✓</span>

              <p>
                Every deposit creates a transaction record.
              </p>
            </div>

            <div className="info-list-item">
              <span>✓</span>

              <p>
                Your updated balance is shown immediately.
              </p>
            </div>

          </div>

          <div className="deposit-security">
            🔒 Secure Banking
          </div>

        </div>

      </div>

      {/* RECENT TRANSACTIONS LINK */}

      <div className="bottom-action">

        <button
          className="text-btn"
          onClick={() =>
            navigate("/transactions")
          }
        >
          View Recent Transactions →
        </button>

      </div>

      {/* OTP POPUP */}

      {showOtp && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>Verify Deposit</h2>

                <p>
                  Enter the OTP to authorize this deposit.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowOtp(false)}
              >
                ×
              </button>

            </div>

            {otpError && (
              <div className="form-error">
                ⚠️ {otpError}
              </div>
            )}

            <div className="form-group">

              <label>Enter 6-digit OTP</label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="Enter OTP"
              />

            </div>

            <div className="transfer-otp-info">
              Demo OTP: <strong>123456</strong>
            </div>

            <div className="modal-actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowOtp(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmDeposit}
              >
                Verify & Deposit
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Deposit;