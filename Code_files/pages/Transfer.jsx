import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBanking } from "../context/BankingContext";

function Transfer() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    accounts,
    transferMoney,
  } = useBanking();

  const [step, setStep] = useState(1);

  const [fromAccount, setFromAccount] = useState("");

  const [recipientName, setRecipientName] =
    useState("");

  const [recipientAccount, setRecipientAccount] =
    useState("");

  const [ifsc, setIfsc] = useState("");

  const [amount, setAmount] = useState("");

  const [purpose, setPurpose] =
    useState("Personal");

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const [receipt, setReceipt] = useState(null);

  const [loading, setLoading] = useState(false);

  /*
   * IMPORTANT:
   * Accounts come from Spring Boot after the page loads.
   * So we update the selected account when backend
   * accounts become available.
   */
  useEffect(() => {
    if (accounts.length === 0) {
      return;
    }

    const requestedAccount =
      location.state?.fromAccount;

    const requestedExists = accounts.some(
      (account) =>
        account.accountNumber === requestedAccount
    );

    if (requestedExists) {
      setFromAccount(requestedAccount);
    } else {
      setFromAccount(accounts[0].accountNumber);
    }
  }, [accounts, location.state]);

  const selectedAccount = accounts.find(
    (account) =>
      account.accountNumber === fromAccount
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  // STEP 1

  const validateStepOne = () => {
    setError("");

    if (!fromAccount) {
      setError("Please select a sender account.");
      return false;
    }

    if (!recipientName.trim()) {
      setError("Please enter recipient name.");
      return false;
    }

    if (!recipientAccount.trim()) {
      setError(
        "Please enter recipient account number."
      );
      return false;
    }

    if (!ifsc.trim()) {
      setError("Please enter IFSC code.");
      return false;
    }

    return true;
  };

  // STEP 2

  const validateStepTwo = () => {
    setError("");

    const transferAmount = Number(amount);

    if (!transferAmount || transferAmount <= 0) {
      setError("Please enter a valid amount.");
      return false;
    }

    if (!selectedAccount) {
      setError("Sender account not found.");
      return false;
    }

    if (
      transferAmount >
      Number(selectedAccount.balance)
    ) {
      setError("Insufficient balance.");
      return false;
    }

    return true;
  };

  // NEXT

  const handleNext = async () => {
    if (step === 1) {
      if (validateStepOne()) {
        setStep(2);
      }

      return;
    }

    if (step === 2) {
      if (validateStepTwo()) {
        setStep(3);
      }

      return;
    }

    if (step === 3) {
      setStep(4);
      return;
    }

    if (step === 4) {
      if (otp !== "123456") {
        setError(
          "Invalid OTP. Use 123456 in demo mode."
        );

        return;
      }

      setError("");
      setLoading(true);

      const result = await transferMoney(
        fromAccount,
        recipientAccount,
        Number(amount),
        `${purpose} transfer to ${recipientName}`
      );

      setLoading(false);

      if (!result.success) {
        setError(result.message);
        return;
      }

      const newReceipt = {
        transactionId: `TRF${Date.now()}`,
        recipientName,
        recipientAccount,
        fromAccount,
        amount: Number(amount),
        purpose,
        date: new Date().toLocaleDateString(
          "en-IN"
        ),
        time: new Date().toLocaleTimeString(
          "en-IN"
        ),
      };

      setReceipt(newReceipt);
      setSuccess(true);
      setStep(5);
    }
  };

  // BACK

  const handleBack = () => {
    setError("");

    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/dashboard");
    }
  };

  // RESET

  const handleNewTransfer = () => {
    setStep(1);
    setRecipientName("");
    setRecipientAccount("");
    setIfsc("");
    setAmount("");
    setPurpose("Personal");
    setOtp("");
    setError("");
    setSuccess(false);
    setReceipt(null);

    if (accounts.length > 0) {
      setFromAccount(accounts[0].accountNumber);
    }
  };

  return (
    <div className="transfer-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>

          <p className="page-greeting">
            Banking
          </p>

          <h1>Transfer Money</h1>

          <p>
            Send money securely to another bank
            account.
          </p>

        </div>

      </div>

      {/* PROGRESS */}

      <div className="transfer-progress">

        {[1, 2, 3, 4, 5].map((number) => (

          <div
            key={number}
            className={
              step >= number
                ? "progress-step active"
                : "progress-step"
            }
          >

            <div className="progress-number">
              {number}
            </div>

            <span>
              {number === 1 && "Recipient"}
              {number === 2 && "Amount"}
              {number === 3 && "Review"}
              {number === 4 && "Verify"}
              {number === 5 && "Complete"}
            </span>

          </div>

        ))}

      </div>

      {/* FORM CARD */}

      <div className="transfer-card">

        {error && (
          <div className="form-error">
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1 */}

        {step === 1 && (

          <div className="transfer-step">

            <div className="transfer-step-header">

              <span className="step-icon">
                👤
              </span>

              <div>

                <h2>Recipient Details</h2>

                <p>
                  Enter the details of the person
                  you want to transfer money to.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>From Account</label>

                <select
                  value={fromAccount}
                  onChange={(e) =>
                    setFromAccount(e.target.value)
                  }
                  disabled={accounts.length === 0}
                >

                  {accounts.map((account) => (

                    <option
                      key={account.id}
                      value={account.accountNumber}
                    >

                      {account.type} -{" "}
                      {account.accountNumber} -{" "}
                      {formatCurrency(
                        account.balance
                      )}

                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>Recipient Name</label>

                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) =>
                    setRecipientName(
                      e.target.value
                    )
                  }
                  placeholder="Enter recipient name"
                />

              </div>

              <div className="form-group">

                <label>
                  Recipient Account Number
                </label>

                <input
                  type="text"
                  value={recipientAccount}
                  onChange={(e) =>
                    setRecipientAccount(
                      e.target.value
                    )
                  }
                  placeholder="Enter account number"
                />

              </div>

              <div className="form-group">

                <label>IFSC Code</label>

                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) =>
                    setIfsc(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="Example: ABBK0001234"
                />

              </div>

            </div>

          </div>

        )}

        {/* STEP 2 */}

        {step === 2 && (

          <div className="transfer-step">

            <div className="transfer-step-header">

              <span className="step-icon">
                ₹
              </span>

              <div>

                <h2>Transfer Amount</h2>

                <p>
                  Enter the amount you want to
                  transfer.
                </p>

              </div>

            </div>

            <div className="amount-input-container">

              <span>₹</span>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="0.00"
                min="1"
              />

            </div>

            <div className="available-balance">

              Available balance:{" "}

              <strong>
                {formatCurrency(
                  selectedAccount?.balance
                )}
              </strong>

            </div>

            <div className="form-group">

              <label>
                Purpose of Transfer
              </label>

              <select
                value={purpose}
                onChange={(e) =>
                  setPurpose(e.target.value)
                }
              >

                <option value="Personal">
                  Personal
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Rent">
                  Rent
                </option>

                <option value="Bills">
                  Bills
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>

        )}

        {/* STEP 3 */}

        {step === 3 && (

          <div className="transfer-step">

            <div className="transfer-step-header">

              <span className="step-icon">
                ✓
              </span>

              <div>

                <h2>Review Transfer</h2>

                <p>
                  Please verify the details before
                  continuing.
                </p>

              </div>

            </div>

            <div className="review-box">

              <div className="review-row">
                <span>From Account</span>

                <strong>
                  {fromAccount}
                </strong>
              </div>

              <div className="review-row">
                <span>Recipient</span>

                <strong>
                  {recipientName}
                </strong>
              </div>

              <div className="review-row">
                <span>Account Number</span>

                <strong>
                  {recipientAccount}
                </strong>
              </div>

              <div className="review-row">
                <span>IFSC Code</span>

                <strong>
                  {ifsc}
                </strong>
              </div>

              <div className="review-row">
                <span>Purpose</span>

                <strong>
                  {purpose}
                </strong>
              </div>

              <div className="review-row total">

                <span>Transfer Amount</span>

                <strong>
                  {formatCurrency(amount)}
                </strong>

              </div>

            </div>

          </div>

        )}

        {/* STEP 4 */}

        {step === 4 && (

          <div className="transfer-step otp-transfer-step">

            <div className="transfer-step-header">

              <span className="step-icon">
                🔐
              </span>

              <div>

                <h2>Verify Transfer</h2>

                <p>
                  Enter the OTP to authorize this
                  transaction.
                </p>

              </div>

            </div>

            <div className="transfer-otp-info">

              <p>
                A verification code has been sent
                to your registered mobile number.
              </p>

              <span>
                Demo OTP:{" "}
                <strong>123456</strong>
              </span>

            </div>

            <div className="form-group otp-transfer-input">

              <label>
                Enter 6-digit OTP
              </label>

              <input
                type="text"
                maxLength="6"
                inputMode="numeric"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                placeholder="Enter OTP"
              />

            </div>

          </div>

        )}

        {/* STEP 5 */}

        {step === 5 &&
          success &&
          receipt && (

            <div className="transfer-success">

              <div className="success-check">
                ✓
              </div>

              <h2>
                Transfer Successful!
              </h2>

              <p>
                Your money has been transferred
                successfully.
              </p>

              <div className="receipt">

                <div className="receipt-header">

                  <strong>
                    AB Bank
                  </strong>

                  <span>
                    Transaction Receipt
                  </span>

                </div>

                <div className="receipt-row">

                  <span>
                    Transaction ID
                  </span>

                  <strong>
                    {receipt.transactionId}
                  </strong>

                </div>

                <div className="receipt-row">

                  <span>Date</span>

                  <strong>
                    {receipt.date}
                  </strong>

                </div>

                <div className="receipt-row">

                  <span>Time</span>

                  <strong>
                    {receipt.time}
                  </strong>

                </div>

                <div className="receipt-row">

                  <span>Recipient</span>

                  <strong>
                    {receipt.recipientName}
                  </strong>

                </div>

                <div className="receipt-row">

                  <span>Account</span>

                  <strong>
                    {receipt.recipientAccount}
                  </strong>

                </div>

                <div className="receipt-row">

                  <span>Purpose</span>

                  <strong>
                    {receipt.purpose}
                  </strong>

                </div>

                <div className="receipt-total">

                  <span>Amount</span>

                  <strong>
                    {formatCurrency(
                      receipt.amount
                    )}
                  </strong>

                </div>

              </div>

              <div className="success-actions">

                <button
                  className="secondary-btn"
                  onClick={() =>
                    navigate("/transactions")
                  }
                >
                  View Transactions
                </button>

                <button
                  className="primary-btn"
                  onClick={handleNewTransfer}
                >
                  New Transfer
                </button>

              </div>

            </div>

          )}

        {/* BUTTONS */}

        {step < 5 && (

          <div className="transfer-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={handleBack}
              disabled={loading}
            >
              ← Back
            </button>

            <button
              type="button"
              className="primary-btn"
              onClick={handleNext}
              disabled={
                loading ||
                accounts.length === 0
              }
            >

              {loading
                ? "Processing..."
                : step === 4
                ? "Verify & Transfer"
                : "Continue →"}

            </button>

          </div>

        )}

      </div>

      {/* SECURITY NOTE */}

      <div className="transfer-security">

        <span>🔒</span>

        <div>

          <strong>
            Secure Transfer
          </strong>

          <p>
            All transactions are protected using
            secure authentication.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Transfer;