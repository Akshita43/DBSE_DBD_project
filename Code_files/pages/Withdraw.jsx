import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBanking } from "../context/BankingContext";

function Withdraw() {
  const navigate = useNavigate();

  const {
    accounts,
    withdrawMoney,
  } = useBanking();

  const [accountNumber, setAccountNumber] = useState("");

  const [amount, setAmount] = useState("");
  const [withdrawType, setWithdrawType] =
    useState("ATM Withdrawal");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] =
    useState("");

  // OTP states
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // Set first account after accounts load from backend
  useEffect(() => {
    if (accounts.length > 0 && !accountNumber) {
      setAccountNumber(accounts[0].accountNumber);
    }
  }, [accounts, accountNumber]);

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

  // Step 1: Validate withdrawal and open OTP
  const handleWithdraw = (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    const value = Number(amount);

    if (!accountNumber) {
      setError("Please select an account.");
      return;
    }

    if (!value || value <= 0) {
      setError(
        "Please enter a valid withdrawal amount."
      );
      return;
    }

    if (
      selectedAccount &&
      value > Number(selectedAccount.balance)
    ) {
      setError("Insufficient balance.");
      return;
    }

    // Open OTP popup
    setOtp("");
    setOtpError("");
    setShowOtp(true);
  };

  // Step 2: Verify OTP and withdraw
  const confirmWithdraw = async () => {
    if (otp !== "123456") {
      setOtpError(
        "Invalid OTP. Use 123456 in demo mode."
      );
      return;
    }

    const result = await withdrawMoney(
      accountNumber,
      Number(amount),
      withdrawType
    );

    if (!result.success) {
      setShowOtp(false);
      setError(result.message);
      return;
    }

    setShowOtp(false);
    setOtp("");

    setTransactionId(`WTH${Date.now()}`);

    setSuccess(true);

    setAmount("");
  };

  return (
    <div className="withdraw-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <p className="page-greeting">
            Banking
          </p>

          <h1>Withdraw Money</h1>

          <p>
            Withdraw money from your AB Bank account.
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

            <div className="banking-card-icon withdraw-icon">
              ↑
            </div>

            <div>
              <h2>Make a Withdrawal</h2>

              <p>
                Enter the amount you want to withdraw.
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
                ✓ Withdrawal Successful
              </strong>

              <span>
                Transaction ID: {transactionId}
              </span>

            </div>
          )}

          <form onSubmit={handleWithdraw}>

            {/* ACCOUNT */}

            <div className="form-group">

              <label>Select Account</label>

              <select
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value)
                }
              >

                <option value="">
                  Select an account
                </option>

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

            {/* AVAILABLE BALANCE */}

            <div className="available-balance-box">

              <span>
                Available Balance
              </span>

              <strong>
                {formatCurrency(
                  selectedAccount?.balance
                )}
              </strong>

            </div>

            {/* AMOUNT */}

            <div className="form-group">

              <label>Withdrawal Amount</label>

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
                onClick={() => setAmount("500")}
              >
                ₹500
              </button>

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

            </div>

            {/* WITHDRAWAL TYPE */}

            <div className="form-group">

              <label>Withdrawal Method</label>

              <select
                value={withdrawType}
                onChange={(e) =>
                  setWithdrawType(e.target.value)
                }
              >

                <option value="ATM Withdrawal">
                  ATM Withdrawal
                </option>

                <option value="Branch Withdrawal">
                  Branch Withdrawal
                </option>

                <option value="Cash Withdrawal">
                  Cash Withdrawal
                </option>

              </select>

            </div>

            <button
              type="submit"
              className="primary-btn full-width"
            >
              Withdraw Money
            </button>

          </form>

        </div>

        {/* SIDE INFO */}

        <div className="banking-info-card">

          <div className="info-card-header">

            <div>
              <h3>Withdrawal Information</h3>

              <p>
                Keep your account secure
              </p>
            </div>

            <span className="info-card-icon">
              💳
            </span>

          </div>

          <div className="info-list">

            <div className="info-list-item">
              <span>✓</span>

              <p>
                You cannot withdraw more than your
                available balance.
              </p>
            </div>

            <div className="info-list-item">
              <span>✓</span>

              <p>
                Withdrawals are reflected instantly
                in demo mode.
              </p>
            </div>

            <div className="info-list-item">
              <span>✓</span>

              <p>
                Every withdrawal creates a transaction
                record.
              </p>
            </div>

            <div className="info-list-item">
              <span>✓</span>

              <p>
                Always keep your banking credentials
                private.
              </p>
            </div>

          </div>

          <div className="withdraw-security">
            🛡️ Secure Withdrawal
          </div>

        </div>

      </div>

      {/* TRANSACTIONS */}

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
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >

          <div
            className="modal"
            style={{
              background: "#ffffff",
              width: "420px",
              maxWidth: "90%",
              borderRadius: "12px",
              padding: "25px",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.25)",
            }}
          >

            <div className="modal-header">

              <div>
                <h2>Verify Withdrawal</h2>

                <p>
                  Enter the OTP to authorize this withdrawal.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  setShowOtp(false);
                  setOtp("");
                  setOtpError("");
                }}
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
                onChange={(e) => {
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  );
                  setOtpError("");
                }}
                placeholder="Enter OTP"
                autoFocus
              />

            </div>

            <div className="transfer-otp-info">
              Demo OTP: <strong>123456</strong>
            </div>

            <div className="modal-actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowOtp(false);
                  setOtp("");
                  setOtpError("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmWithdraw}
              >
                Verify & Withdraw
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Withdraw;