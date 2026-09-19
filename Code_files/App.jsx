import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
// ===============================
// DEMO BANK DATA
// ===============================

const userData = {
  name: "Anand Akshita",
  customerId: "ABB482109",
  email: "anand.akshita@abbank.com",
  phone: "+91 98765 43210",

  accounts: [
    {
      id: "savings",
      name: "Savings Account",
      number: "XXXX XXXX 4821",
      type: "Savings",
      balance: 125840.5,
      ifsc: "ABBL0004821",
      branch: "Kukatpally Branch"
    },
    {
      id: "current",
      name: "Current Account",
      number: "XXXX XXXX 7214",
      type: "Current",
      balance: 82450.0,
      ifsc: "ABBL0007214",
      branch: "Kukatpally Branch"
    }
  ],

  transactions: [
    {
      id: "TXN20260908",
      date: "08 Sep 2026, 10:30 AM",
      description: "Salary Credit",
      party: "Infosys Ltd",
      category: "Deposit",
      type: "credit",
      amount: 45000,
      status: "Completed"
    },
    {
      id: "TXN20260907",
      date: "07 Sep 2026, 05:20 PM",
      description: "Online Shopping",
      party: "Amazon",
      category: "Transfer",
      type: "debit",
      amount: 2499,
      status: "Completed"
    },
    {
      id: "TXN20260906",
      date: "06 Sep 2026, 02:10 PM",
      description: "Electricity Bill",
      party: "TSSPDCL",
      category: "Bills",
      type: "debit",
      amount: 1850,
      status: "Completed"
    },
    {
      id: "TXN20260905",
      date: "05 Sep 2026, 11:40 AM",
      description: "UPI Transfer",
      party: "Rahul Sharma",
      category: "Transfer",
      type: "debit",
      amount: 3500,
      status: "Completed"
    },
    {
      id: "TXN20260904",
      date: "04 Sep 2026, 09:30 AM",
      description: "Cash Deposit",
      party: "AB Bank",
      category: "Deposit",
      type: "credit",
      amount: 10000,
      status: "Completed"
    },
    {
      id: "TXN20260903",
      date: "03 Sep 2026, 04:15 PM",
      description: "ATM Withdrawal",
      party: "AB Bank ATM",
      category: "Withdrawal",
      type: "debit",
      amount: 5000,
      status: "Completed"
    }
  ],

  loans: [
    {
      name: "Personal Loan",
      number: "PL-482109",
      amount: 250000,
      outstanding: 175000,
      emi: 8500,
      rate: "10.5%"
    },
    {
      name: "Education Loan",
      number: "EL-721450",
      amount: 500000,
      outstanding: 420000,
      emi: 7200,
      rate: "8.5%"
    }
  ]
};

// ===============================
// HELPER
// ===============================

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
}

// ===============================
// SIDEBAR
// ===============================

function Sidebar() {
  const navigate = useNavigate();

  const menu = [
    ["Dashboard", "/dashboard", "▦"],
    ["My Accounts", "/accounts", "▣"],
    ["Transfer Money", "/transfer", "↗"],
    ["Deposit Money", "/deposit", "＋"],
    ["Withdraw Money", "/withdraw", "−"],
    ["Transactions", "/transactions", "☷"],
    ["Loans", "/loans", "▤"],
    ["Investments", "/investments", "◈"],
    ["Financial Health", "/financial-health", "♥"],
    ["Notifications", "/notifications", "♢"],
    ["Security", "/security", "⚿"],
    ["Settings", "/settings", "⚙"]
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="bank-icon">⌂</div>

        <div>
          <h2>AB Bank</h2>
          <span>ONLINE BANKING</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="avatar">
          A
        </div>

        <div>
          <strong>{userData.name}</strong>
          <small>{userData.customerId}</small>
        </div>
      </div>

      <nav className="sidebar-nav">

        {menu.map(([name, path, icon]) => (
          <Link
            key={path}
            to={path}
            className="sidebar-link"
          >
            <span className="sidebar-icon">{icon}</span>
            {name}
          </Link>
        ))}

      </nav>

      <div className="sidebar-bottom">

        <button
          className="sidebar-admin"
          onClick={() => navigate("/admin")}
        >
          🛡 Admin Portal
        </button>

        <button
          className="logout-button"
          onClick={() => navigate("/login")}
        >
          ⇥ Sign Out
        </button>

      </div>

    </aside>
  );
}

// ===============================
// TOP BAR
// ===============================

function Topbar({ title }) {
  return (
    <header className="topbar">

      <div className="topbar-left">

        <button className="menu-toggle">
          ☰
        </button>

        <h1>{title}</h1>

      </div>

      <div className="topbar-right">

        <div className="security-indicator">
          🛡 Audit Logged
        </div>

        <Link
          to="/notifications"
          className="notification-button"
        >
          ♢
          <span className="notification-dot"></span>
        </Link>

        <div className="topbar-avatar">
          A
        </div>

      </div>

    </header>
  );
}

// ===============================
// MAIN LAYOUT
// ===============================

function Layout({ title, children }) {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-content">

        <Topbar title={title} />

        <main className="page-content">
          {children}
        </main>

      </div>

    </div>
  );
}

// ===============================
// LOGIN PAGE
// ===============================

function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const captchaCode = "AB4821";

  function fillDemo() {

    if (role === "customer") {
      setEmail("anand.akshita@abbank.com");
      setPassword("password123");
    } else {
      setEmail("admin@abbank.com");
      setPassword("admin123");
    }

    setCaptcha(captchaCode);
  }

  function handleLogin(e) {

    e.preventDefault();

    if (!email || !password || !captcha) {
      setError("Please fill all required fields.");
      return;
    }

    if (captcha.toUpperCase() !== captchaCode) {
      setError("Incorrect security code.");
      return;
    }

    if (role === "admin") {
      if (
        email === "admin@abbank.com" &&
        password === "admin123"
      ) {
        navigate("/admin");
        return;
      }

      setError("Invalid admin credentials.");
      return;
    }

    if (
      email === "anand.akshita@abbank.com" &&
      password === "password123"
    ) {
      navigate("/otp");
      return;
    }

    setError("Invalid customer credentials.");
  }

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-card">

          <div className="auth-logo">

            <div className="auth-logo-icon">
              ⌂
            </div>

            <h1>AB Bank</h1>

            <p>
              Next-Gen Online Banking Portal
            </p>

          </div>

          {/* ROLE SWITCHER */}

          <div className="auth-role-tabs">

            <button
              className={
                role === "customer"
                  ? "auth-role-tab active"
                  : "auth-role-tab"
              }
              onClick={() => {
                setRole("customer");
                setError("");
              }}
            >
              👤 Customer Login
            </button>

            <button
              className={
                role === "admin"
                  ? "auth-role-tab active"
                  : "auth-role-tab"
              }
              onClick={() => {
                setRole("admin");
                setError("");
              }}
            >
              🛡 Admin Login
            </button>

          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label className="form-label">
                {role === "customer"
                  ? "Customer ID / Registered Email"
                  : "Admin Email"}
                <span className="required">*</span>
              </label>

              <input
                className="form-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === "customer"
                    ? "Enter customer ID or email"
                    : "Enter admin email"
                }
              />

            </div>

            <div className="form-group">

              <div className="password-label">

                <label className="form-label">
                  Password
                  <span className="required">*</span>
                </label>

                <a href="#forgot">
                  Forgot password?
                </a>

              </div>

              <div className="input-group">

                <input
                  className="form-input"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="input-group-action"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>

            {/* CAPTCHA */}

            <div className="form-group">

              <label className="form-label">
                Security Code (CAPTCHA)
                <span className="required">*</span>
              </label>

              <div className="captcha-container">

                <div className="captcha-box">
                  {captchaCode}
                </div>

                <button
                  type="button"
                  className="captcha-refresh-btn"
                  onClick={() => setCaptcha("")}
                >
                  ↻
                </button>

                <input
                  className="form-input captcha-input"
                  value={captcha}
                  onChange={(e) =>
                    setCaptcha(e.target.value)
                  }
                  placeholder="Enter code"
                  maxLength="6"
                />

              </div>

            </div>

            <label className="checkbox-group">

              <input type="checkbox" />

              <span>
                Remember this device
              </span>

            </label>

            <button
              className="btn btn-primary btn-block btn-lg"
              type="submit"
            >
              Sign In Securely
            </button>

          </form>

          <div className="biometric-section">

            <div className="divider-text">
              OR USE HIGH-SECURITY BIOMETRICS
            </div>

            <button
              className="btn btn-outline btn-block"
              onClick={() => navigate("/otp")}
            >
              🖐 Biometric Fingerprint Login
              (Simulation)
            </button>

          </div>

          {/* DEMO CREDENTIALS */}

          <div className="demo-credentials-box">

            <div className="demo-header">
              ⓘ
              <strong>
                Evaluation Demo Credentials
              </strong>
            </div>

            <div className="demo-content">

              {role === "customer" ? (
                <p>
                  Customer:
                  <code>
                    anand.akshita@abbank.com
                  </code>
                  /
                  <code>password123</code>
                </p>
              ) : (
                <p>
                  Admin:
                  <code>
                    admin@abbank.com
                  </code>
                  /
                  <code>admin123</code>
                </p>
              )}

              <button
                className="btn-fill-demo"
                onClick={fillDemo}
              >
                Auto-Fill Selected Credentials
              </button>

            </div>

          </div>

          <div className="auth-security-note">
            🛡 Bank-Grade 256-bit TLS Encryption.
            Protected with active anti-fraud simulation.
          </div>

        </div>

        <div className="auth-page-footer">
          © 2026 AB Bank Ltd. College Software
          Engineering Project Simulation.
        </div>

      </div>

    </div>
  );
}

// ===============================
// OTP PAGE
// ===============================

function OTP() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  function verifyOTP(e) {

    e.preventDefault();

    if (otp === "123456") {
      navigate("/dashboard");
    } else {
      alert("Invalid OTP. Demo OTP is 123456.");
    }

  }

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-card otp-card">

          <div className="auth-logo">

            <div className="auth-logo-icon">
              🛡
            </div>

            <h1>Verify Identity</h1>

            <p>
              Two-factor authentication
            </p>

          </div>

          <div className="otp-message">

            <div className="otp-icon">
              ✉
            </div>

            <h3>
              Enter the OTP
            </h3>

            <p>
              A 6-digit verification code has been
              sent to your registered mobile number.
            </p>

          </div>

          <form onSubmit={verifyOTP}>

            <input
              className="otp-input"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              maxLength="6"
              placeholder="000000"
            />

            <button className="btn btn-primary btn-block btn-lg">
              Verify & Continue
            </button>

          </form>

          <p className="demo-otp">
            Demo OTP: <strong>123456</strong>
          </p>

        </div>

      </div>

    </div>
  );
}

// ===============================
// DASHBOARD
// ===============================

function Dashboard() {

  const totalBalance =
    userData.accounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );

  return (
    <Layout title="Dashboard">

      <div className="page-header">

        <h1>
          Good afternoon, {userData.name.split(" ")[0]} 👋
        </h1>

        <p>
          Here's your financial overview for today.
        </p>

      </div>

      {/* BALANCE CARDS */}

      <div className="dashboard-grid">

        <div className="stat-card primary-stat">

          <div className="stat-card-top">
            <span>Total Balance</span>
            <span className="stat-icon">₹</span>
          </div>

          <h2>
            {formatCurrency(totalBalance)}
          </h2>

          <p>
            Across all accounts
          </p>

        </div>

        <div className="stat-card">

          <div className="stat-card-top">
            <span>Savings Account</span>
            <span className="stat-icon">▣</span>
          </div>

          <h2>
            {formatCurrency(
              userData.accounts[0].balance
            )}
          </h2>

          <p>
            {userData.accounts[0].number}
          </p>

        </div>

        <div className="stat-card">

          <div className="stat-card-top">
            <span>Current Account</span>
            <span className="stat-icon">▤</span>
          </div>

          <h2>
            {formatCurrency(
              userData.accounts[1].balance
            )}
          </h2>

          <p>
            {userData.accounts[1].number}
          </p>

        </div>

      </div>

      {/* QUICK ACTIONS */}

      <section className="section">

        <div className="section-header">

          <div>
            <h2>Quick Actions</h2>
            <p>
              Frequently used banking services
            </p>
          </div>

        </div>

        <div className="quick-actions">

          <Link
            to="/transfer"
            className="quick-action"
          >
            <span>↗</span>
            <strong>Transfer Money</strong>
            <small>Send money securely</small>
          </Link>

          <Link
            to="/deposit"
            className="quick-action"
          >
            <span>＋</span>
            <strong>Deposit</strong>
            <small>Add money to account</small>
          </Link>

          <Link
            to="/withdraw"
            className="quick-action"
          >
            <span>−</span>
            <strong>Withdraw</strong>
            <small>Withdraw funds</small>
          </Link>

          <Link
            to="/transactions"
            className="quick-action"
          >
            <span>☷</span>
            <strong>Transactions</strong>
            <small>View statement</small>
          </Link>

        </div>

      </section>

      {/* RECENT TRANSACTIONS */}

      <section className="section">

        <div className="section-header">

          <div>
            <h2>Recent Transactions</h2>
            <p>
              Your latest account activity
            </p>
          </div>

          <Link
            to="/transactions"
            className="btn btn-outline btn-sm"
          >
            View All
          </Link>

        </div>

        <div className="data-table-wrap">

          <table className="data-table">

            <thead>

              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {userData.transactions
                .slice(0, 5)
                .map((txn) => (

                  <tr key={txn.id}>

                    <td>{txn.date}</td>

                    <td>
                      <strong>
                        {txn.description}
                      </strong>
                      <small className="table-subtext">
                        {txn.party}
                      </small>
                    </td>

                    <td>
                      <span className="badge">
                        {txn.category}
                      </span>
                    </td>

                    <td
                      className={
                        txn.type === "credit"
                          ? "amount-credit"
                          : "amount-debit"
                      }
                    >
                      {txn.type === "credit"
                        ? "+"
                        : "-"}
                      {formatCurrency(txn.amount)}
                    </td>

                    <td>
                      <span className="badge badge-success">
                        {txn.status}
                      </span>
                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </section>

    </Layout>
  );
}

// ===============================
// ACCOUNTS
// ===============================

function Accounts() {

  return (
    <Layout title="My Accounts">

      <div className="page-header">

        <h1>My Accounts</h1>

        <p>
          View balances and details of your
          registered accounts.
        </p>

      </div>

      <div className="account-grid">

        {userData.accounts.map((account) => (

          <div className="account-card" key={account.id}>

            <div className="account-card-header">

              <div>

                <span className="account-type">
                  {account.type}
                </span>

                <h2>
                  {account.name}
                </h2>

              </div>

              <div className="account-icon">
                ₹
              </div>

            </div>

            <div className="account-number">
              {account.number}
            </div>

            <div className="account-balance-label">
              Available Balance
            </div>

            <div className="account-balance">
              {formatCurrency(account.balance)}
            </div>

            <div className="account-details">

              <div>
                <span>IFSC Code</span>
                <strong>{account.ifsc}</strong>
              </div>

              <div>
                <span>Branch</span>
                <strong>{account.branch}</strong>
              </div>

            </div>

            <div className="account-actions">

              <Link
                to="/transfer"
                className="btn btn-primary"
              >
                Transfer Funds
              </Link>

              <Link
                to="/transactions"
                className="btn btn-outline"
              >
                View Statement
              </Link>

            </div>

          </div>

        ))}

      </div>

    </Layout>
  );
}

// ===============================
// TRANSFER
// ===============================

function Transfer() {

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    recipient: "",
    account: "",
    ifsc: "",
    amount: "",
    purpose: ""
  });

  const [otp, setOtp] = useState("");

  const updateForm = (field, value) => {

    setForm({
      ...form,
      [field]: value
    });

  };

  function nextStep() {

    if (step === 1) {

      if (
        !form.recipient ||
        !form.account ||
        !form.ifsc
      ) {
        alert("Please enter recipient details.");
        return;
      }

    }

    if (step === 2) {

      if (!form.amount || Number(form.amount) <= 0) {
        alert("Enter a valid amount.");
        return;
      }

    }

    setStep(step + 1);

  }

  function verifyTransfer() {

    if (otp !== "123456") {
      alert("Demo OTP is 123456");
      return;
    }

    setStep(5);

  }

  return (
    <Layout title="Transfer Money">

      <div className="page-header">

        <h1>Transfer Money</h1>

        <p>
          Send money securely to another bank account.
        </p>

      </div>

      {/* STEPS */}

      <div className="transfer-steps">

        {[
          "Recipient",
          "Amount",
          "Review",
          "Verify",
          "Success"
        ].map((item, index) => (

          <div
            key={item}
            className={
              step >= index + 1
                ? "transfer-step active"
                : "transfer-step"
            }
          >

            <div className="step-number">
              {index + 1}
            </div>

            <span>{item}</span>

          </div>

        ))}

      </div>

      <div className="form-card">

        {/* STEP 1 */}

        {step === 1 && (

          <>
            <div className="form-card-header">

              <h2>Recipient Details</h2>

              <p>
                Enter the beneficiary's bank details.
              </p>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label className="form-label">
                  Recipient Name
                </label>

                <input
                  className="form-input"
                  value={form.recipient}
                  onChange={(e) =>
                    updateForm(
                      "recipient",
                      e.target.value
                    )
                  }
                  placeholder="Enter recipient name"
                />

              </div>

              <div className="form-group">

                <label className="form-label">
                  Account Number
                </label>

                <input
                  className="form-input"
                  value={form.account}
                  onChange={(e) =>
                    updateForm(
                      "account",
                      e.target.value
                    )
                  }
                  placeholder="Enter account number"
                />

              </div>

              <div className="form-group">

                <label className="form-label">
                  IFSC Code
                </label>

                <input
                  className="form-input"
                  value={form.ifsc}
                  onChange={(e) =>
                    updateForm(
                      "ifsc",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="e.g. SBIN0001234"
                />

              </div>

              <div className="form-group">

                <label className="form-label">
                  From Account
                </label>

                <select
                  className="form-input"
                  value={form.from}
                  onChange={(e) =>
                    updateForm(
                      "from",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select account
                  </option>

                  {userData.accounts.map(
                    (account) => (
                      <option
                        key={account.id}
                        value={account.id}
                      >
                        {account.name} -{" "}
                        {formatCurrency(
                          account.balance
                        )}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            <div className="form-actions">

              <button
                className="btn btn-primary"
                onClick={nextStep}
              >
                Continue →
              </button>

            </div>

          </>

        )}

        {/* STEP 2 */}

        {step === 2 && (

          <>
            <div className="form-card-header">

              <h2>Transfer Amount</h2>

              <p>
                Enter the amount and purpose of transfer.
              </p>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label className="form-label">
                  Amount (₹)
                </label>

                <input
                  className="form-input amount-input"
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    updateForm(
                      "amount",
                      e.target.value
                    )
                  }
                  placeholder="0.00"
                />

              </div>

              <div className="form-group">

                <label className="form-label">
                  Purpose
                </label>

                <select
                  className="form-input"
                  value={form.purpose}
                  onChange={(e) =>
                    updateForm(
                      "purpose",
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select purpose
                  </option>

                  <option>Shopping</option>
                  <option>Education</option>
                  <option>Family</option>
                  <option>Bills</option>
                  <option>Other</option>

                </select>

              </div>

            </div>

            <div className="form-actions">

              <button
                className="btn btn-outline"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>

              <button
                className="btn btn-primary"
                onClick={nextStep}
              >
                Review Transfer →
              </button>

            </div>

          </>

        )}

        {/* STEP 3 */}

        {step === 3 && (

          <>
            <div className="form-card-header">

              <h2>Review Transfer</h2>

              <p>
                Please verify the details before
                continuing.
              </p>

            </div>

            <div className="review-summary-card">

              <div className="review-row">
                <span>Recipient</span>
                <strong>{form.recipient}</strong>
              </div>

              <div className="review-row">
                <span>Account Number</span>
                <strong>{form.account}</strong>
              </div>

              <div className="review-row">
                <span>IFSC</span>
                <strong>{form.ifsc}</strong>
              </div>

              <div className="review-row">
                <span>Amount</span>
                <strong className="review-amount">
                  {formatCurrency(
                    Number(form.amount)
                  )}
                </strong>
              </div>

              <div className="review-row">
                <span>Purpose</span>
                <strong>
                  {form.purpose || "Not specified"}
                </strong>
              </div>

            </div>

            <div className="form-actions">

              <button
                className="btn btn-outline"
                onClick={() => setStep(2)}
              >
                ← Back
              </button>

              <button
                className="btn btn-primary"
                onClick={() => setStep(4)}
              >
                Confirm & Verify →
              </button>

            </div>

          </>

        )}

        {/* STEP 4 */}

        {step === 4 && (

          <>
            <div className="otp-message">

              <div className="otp-icon">
                🛡
              </div>

              <h2>
                OTP Verification
              </h2>

              <p>
                Enter the OTP to authorize this
                transaction.
              </p>

            </div>

            <input
              className="otp-input"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              maxLength="6"
              placeholder="000000"
            />

            <div className="form-actions">

              <button
                className="btn btn-outline"
                onClick={() => setStep(3)}
              >
                ← Back
              </button>

              <button
                className="btn btn-primary"
                onClick={verifyTransfer}
              >
                Verify Transfer
              </button>

            </div>

            <p className="demo-otp">
              Demo OTP: <strong>123456</strong>
            </p>

          </>

        )}

        {/* STEP 5 */}

        {step === 5 && (

          <div className="success-screen">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Transfer Successful
            </h2>

            <p>
              Your transfer has been successfully
              processed.
            </p>

            <div className="success-amount">
              {formatCurrency(
                Number(form.amount)
              )}
            </div>

            <div className="receipt-box">

              <div>
                <span>Recipient</span>
                <strong>{form.recipient}</strong>
              </div>

              <div>
                <span>Transaction ID</span>
                <strong>
                  TXN{Date.now()}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong className="text-success">
                  Completed
                </strong>
              </div>

            </div>

            <Link
              to="/transactions"
              className="btn btn-primary"
            >
              View Transactions
            </Link>

          </div>

        )}

      </div>

    </Layout>
  );
}

// ===============================
// TRANSACTIONS
// ===============================

function Transactions() {

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredTransactions =
    userData.transactions.filter((txn) => {

      const matchesSearch =
        txn.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        txn.party
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        txn.id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        type === "all" ||
        txn.type === type ||
        txn.category === type;

      const matchesStatus =
        status === "all" ||
        txn.status === status;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );

    });

  function exportCSV() {

    const header =
      "Date,Description,Party,Category,Type,Amount,Status\n";

    const rows =
      filteredTransactions
        .map((txn) =>
          [
            txn.date,
            txn.description,
            txn.party,
            txn.category,
            txn.type,
            txn.amount,
            txn.status
          ].join(",")
        )
        .join("\n");

    const blob = new Blob(
      [header + rows],
      { type: "text/csv" }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "AB-Bank-Statement.csv";

    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Layout title="Transaction History">

      <div className="page-header transaction-header">

        <div>

          <h1>
            All Transactions
          </h1>

          <p>
            Comprehensive record of all incoming
            credits, transfers, and withdrawals.
          </p>

        </div>

        <button
          className="btn btn-outline"
          onClick={exportCSV}
        >
          ↓ Export Statement (CSV)
        </button>

      </div>

      <div className="table-controls-bar">

        <div className="table-filters">

          <input
            className="form-input"
            placeholder="Search by recipient, description, ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="form-input filter-select"
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option value="all">
              All Types
            </option>

            <option value="credit">
              Credits (+)
            </option>

            <option value="debit">
              Debits (-)
            </option>

            <option value="Deposit">
              Deposits
            </option>

            <option value="Transfer">
              Transfers
            </option>

            <option value="Withdrawal">
              Withdrawals
            </option>

          </select>

          <select
            className="form-input filter-select"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >

            <option value="all">
              All Statuses
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>

          </select>

        </div>

      </div>

      <div className="data-table-wrap">

        <table className="data-table">

          <thead>

            <tr>

              <th>Date & Time</th>
              <th>Description / Party</th>
              <th>Transaction ID</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount (₹)</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {filteredTransactions.map(
              (txn) => (

                <tr key={txn.id}>

                  <td>
                    {txn.date}
                  </td>

                  <td>

                    <strong>
                      {txn.description}
                    </strong>

                    <small className="table-subtext">
                      {txn.party}
                    </small>

                  </td>

                  <td>
                    <code>
                      {txn.id}
                    </code>
                  </td>

                  <td>
                    {txn.category}
                  </td>

                  <td>
                    {txn.type === "credit"
                      ? "Credit"
                      : "Debit"}
                  </td>

                  <td
                    className={
                      txn.type === "credit"
                        ? "amount-credit"
                        : "amount-debit"
                    }
                  >
                    {txn.type === "credit"
                      ? "+"
                      : "-"}
                    {formatCurrency(txn.amount)}
                  </td>

                  <td>

                    <span className="badge badge-success">
                      {txn.status}
                    </span>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </Layout>
  );
}

// ===============================
// SIMPLE PAGE COMPONENTS
// ===============================

function Deposit() {

  const [amount, setAmount] = useState("");

  return (
    <Layout title="Deposit Money">

      <div className="page-header">
        <h1>Deposit Money</h1>
        <p>
          Add money to your AB Bank account.
        </p>
      </div>

      <div className="form-card">

        <div className="form-card-header">
          <h2>Deposit Funds</h2>
          <p>
            Enter the amount you want to deposit.
          </p>
        </div>

        <div className="form-group">

          <label className="form-label">
            Deposit Amount (₹)
          </label>

          <input
            className="form-input"
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="Enter amount"
          />

        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            alert(
              `Deposit of ₹${amount} initiated successfully.`
            )
          }
        >
          Deposit Money
        </button>

      </div>

    </Layout>
  );
}

function Withdraw() {

  const [amount, setAmount] = useState("");

  return (
    <Layout title="Withdraw Money">

      <div className="page-header">
        <h1>Withdraw Money</h1>
        <p>
          Withdraw funds from your account.
        </p>
      </div>

      <div className="form-card">

        <div className="form-card-header">
          <h2>Withdraw Funds</h2>
          <p>
            Enter the amount you want to withdraw.
          </p>
        </div>

        <div className="form-group">

          <label className="form-label">
            Withdrawal Amount (₹)
          </label>

          <input
            className="form-input"
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="Enter amount"
          />

        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            alert(
              `Withdrawal of ₹${amount} initiated successfully.`
            )
          }
        >
          Withdraw Money
        </button>

      </div>

    </Layout>
  );
}

function Loans() {

  return (
    <Layout title="Loans">

      <div className="page-header">

        <h1>Loans</h1>

        <p>
          Manage your active loans and EMIs.
        </p>

      </div>

      <div className="loan-grid">

        {userData.loans.map((loan) => (

          <div className="loan-card" key={loan.number}>

            <div className="loan-card-header">

              <div>
                <span>ACTIVE LOAN</span>
                <h2>{loan.name}</h2>
              </div>

              <div className="loan-icon">
                ₹
              </div>

            </div>

            <div className="loan-number">
              {loan.number}
            </div>

            <div className="loan-info-grid">

              <div>
                <span>Original Amount</span>
                <strong>
                  {formatCurrency(loan.amount)}
                </strong>
              </div>

              <div>
                <span>Outstanding</span>
                <strong>
                  {formatCurrency(
                    loan.outstanding
                  )}
                </strong>
              </div>

              <div>
                <span>Monthly EMI</span>
                <strong>
                  {formatCurrency(loan.emi)}
                </strong>
              </div>

              <div>
                <span>Interest Rate</span>
                <strong>
                  {loan.rate}
                </strong>
              </div>

            </div>

            <button
              className="btn btn-primary"
              onClick={() =>
                alert(
                  "Loan payment feature opened."
                )
              }
            >
              Manage Loan
            </button>

          </div>

        ))}

      </div>

    </Layout>
  );
}

function Investments() {

  const investments = [
    ["Mutual Funds", "₹85,000", "+12.4%"],
    ["Fixed Deposits", "₹1,50,000", "+7.1%"],
    ["Stocks", "₹62,500", "+9.8%"],
    ["Bonds", "₹40,000", "+6.5%"]
  ];

  return (
    <Layout title="Investments">

      <div className="page-header">

        <h1>Investments</h1>

        <p>
          Track your investments and portfolio.
        </p>

      </div>

      <div className="investment-grid">

        {investments.map(
          ([name, value, growth]) => (

            <div
              className="investment-card"
              key={name}
            >

              <div className="investment-icon">
                ◈
              </div>

              <h2>{name}</h2>

              <strong>{value}</strong>

              <span className="text-success">
                {growth}
              </span>

            </div>

          )
        )}

      </div>

    </Layout>
  );
}

function FinancialHealth() {

  return (
    <Layout title="Financial Health">

      <div className="page-header">

        <h1>Financial Health</h1>

        <p>
          Understand your overall financial position.
        </p>

      </div>

      <div className="health-card">

        <div className="health-score">
          <div className="score-circle">
            82
          </div>

          <div>
            <h2>Good Financial Health</h2>
            <p>
              Your financial health score is above
              average.
            </p>
          </div>
        </div>

        <div className="health-bars">

          <div className="health-item">
            <span>Savings</span>
            <div className="progress">
              <div style={{ width: "85%" }}></div>
            </div>
            <strong>85%</strong>
          </div>

          <div className="health-item">
            <span>Debt Management</span>
            <div className="progress">
              <div style={{ width: "72%" }}></div>
            </div>
            <strong>72%</strong>
          </div>

          <div className="health-item">
            <span>Investment</span>
            <div className="progress">
              <div style={{ width: "78%" }}></div>
            </div>
            <strong>78%</strong>
          </div>

        </div>

      </div>

    </Layout>
  );
}

function Notifications() {

  const notifications = [
    [
      "Successful Transfer",
      "Your recent money transfer was completed successfully.",
      "2 hours ago"
    ],
    [
      "Security Alert",
      "Your account security settings were recently reviewed.",
      "Yesterday"
    ],
    [
      "Statement Ready",
      "Your monthly account statement is available.",
      "3 days ago"
    ]
  ];

  return (
    <Layout title="Notifications">

      <div className="page-header">

        <h1>Notifications</h1>

        <p>
          Important updates and account alerts.
        </p>

      </div>

      <div className="notification-list">

        {notifications.map(
          ([title, message, time]) => (

            <div
              className="notification-card"
              key={title}
            >

              <div className="notification-icon">
                !
              </div>

              <div>

                <h3>{title}</h3>

                <p>{message}</p>

                <small>{time}</small>

              </div>

            </div>

          )
        )}

      </div>

    </Layout>
  );
}

function Security() {

  return (
    <Layout title="Security">

      <div className="page-header">

        <h1>Security Center</h1>

        <p>
          Manage your banking security settings.
        </p>

      </div>

      <div className="security-grid">

        <div className="security-card">

          <span className="security-card-icon">
            🛡
          </span>

          <h2>Two-Factor Authentication</h2>

          <p>
            Additional verification is required
            during important banking activities.
          </p>

          <span className="badge badge-success">
            Enabled
          </span>

        </div>

        <div className="security-card">

          <span className="security-card-icon">
            🖐
          </span>

          <h2>Biometric Login</h2>

          <p>
            Fingerprint authentication is available
            for secure login.
          </p>

          <button className="btn btn-outline">
            Manage
          </button>

        </div>

        <div className="security-card">

          <span className="security-card-icon">
            🔑
          </span>

          <h2>Password</h2>

          <p>
            Last changed 30 days ago.
          </p>

          <button className="btn btn-outline">
            Change Password
          </button>

        </div>

      </div>

    </Layout>
  );
}

function Settings() {

  return (
    <Layout title="Settings">

      <div className="page-header">

        <h1>Settings</h1>

        <p>
          Manage your profile and account preferences.
        </p>

      </div>

      <div className="settings-card">

        <div className="settings-section">

          <h2>Personal Information</h2>

          <div className="form-grid">

            <div className="form-group">

              <label className="form-label">
                Full Name
              </label>

              <input
                className="form-input"
                value={userData.name}
                readOnly
              />

            </div>

            <div className="form-group">

              <label className="form-label">
                Customer ID
              </label>

              <input
                className="form-input"
                value={userData.customerId}
                readOnly
              />

            </div>

            <div className="form-group">

              <label className="form-label">
                Email
              </label>

              <input
                className="form-input"
                value={userData.email}
                readOnly
              />

            </div>

            <div className="form-group">

              <label className="form-label">
                Phone
              </label>

              <input
                className="form-input"
                value={userData.phone}
                readOnly
              />

            </div>

          </div>

        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            alert("Settings saved successfully.")
          }
        >
          Save Changes
        </button>

      </div>

    </Layout>
  );
}

// ===============================
// ADMIN
// ===============================

function Admin() {

  const [maintenance, setMaintenance] =
    useState(false);

  return (
    <div className="admin-page">

      <div className="admin-topbar">

        <div>
          <h1>AB Bank Admin Portal</h1>
          <span>System Administration</span>
        </div>

        <Link
          to="/dashboard"
          className="btn btn-outline"
        >
          Customer Portal
        </Link>

      </div>

      <div className="admin-content">

        <div className="admin-welcome">

          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Monitor and manage the banking system.
            </p>
          </div>

          <span className="admin-status">
            ● System Online
          </span>

        </div>

        <div className="admin-stats">

          <div className="admin-stat">
            <span>Total Customers</span>
            <strong>1,248</strong>
          </div>

          <div className="admin-stat">
            <span>Active Accounts</span>
            <strong>2,845</strong>
          </div>

          <div className="admin-stat">
            <span>Today's Transactions</span>
            <strong>3,921</strong>
          </div>

          <div className="admin-stat">
            <span>Pending Requests</span>
            <strong>18</strong>
          </div>

        </div>

        <div className="admin-panels">

          <div className="admin-panel">

            <h2>System Controls</h2>

            <div className="admin-control">

              <div>
                <strong>Maintenance Mode</strong>
                <p>
                  Temporarily disable customer
                  transactions.
                </p>
              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={maintenance}
                  onChange={(e) =>
                    setMaintenance(
                      e.target.checked
                    )
                  }
                />

                <span></span>

              </label>

            </div>

          </div>

          <div className="admin-panel">

            <h2>Recent Audit Logs</h2>

            <div className="audit-row">
              <span>Customer Login</span>
              <small>2 min ago</small>
            </div>

            <div className="audit-row">
              <span>Transfer Approved</span>
              <small>8 min ago</small>
            </div>

            <div className="audit-row">
              <span>Password Updated</span>
              <small>21 min ago</small>
            </div>

            <div className="audit-row">
              <span>Admin Login</span>
              <small>1 hour ago</small>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// ===============================
// APP ROUTER
// ===============================

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/otp"
          element={<OTP />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/accounts"
          element={<Accounts />}
        />

        <Route
          path="/transfer"
          element={<Transfer />}
        />

        <Route
          path="/deposit"
          element={<Deposit />}
        />

        <Route
          path="/withdraw"
          element={<Withdraw />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/loans"
          element={<Loans />}
        />

        <Route
          path="/investments"
          element={<Investments />}
        />

        <Route
          path="/financial-health"
          element={<FinancialHealth />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/security"
          element={<Security />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />
<Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <Transactions />
    </ProtectedRoute>
  }
/>

<Route
  path="/loans"
  element={
    <ProtectedRoute>
      <Loans />
    </ProtectedRoute>
  }
/>
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;