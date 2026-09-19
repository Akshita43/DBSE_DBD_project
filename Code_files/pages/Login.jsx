import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("customer");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [generatedCaptcha] = useState("7K4P9");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();

  setError("");

  if (!userId || !password) {
    setError("Please enter your login ID and password.");
    return;
  }

  if (!captcha) {
    setError("Please enter the CAPTCHA.");
    return;
  }

  if (captcha.toUpperCase() !== generatedCaptcha) {
    setError("Invalid CAPTCHA. Please try again.");
    return;
  }

  // Admin login stays as demo for now
  if (loginType === "admin") {
    if (userId === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "admin");
      navigate("/admin");
      return;
    }

    setError("Invalid admin credentials.");
    return;
  }

  // Customer login through Spring Boot backend
try {
  const response = await fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerId: userId,
      password: password,
    }),
  });

  if (!response.ok) {
    setError("Invalid customer ID or password.");
    return;
  }

  const user = await response.json();

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", "customer");
  localStorage.setItem("bankingUser", JSON.stringify(user));

  if (rememberMe) {
    localStorage.setItem("rememberDevice", "true");
  }

  navigate("/otp");

} catch (error) {
  console.error(error);
  setError("Unable to connect to the banking server.");
}
};

  const handleBiometric = () => {
    setError("Biometric authentication is available in the demo.");
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">

        <div className="login-brand">
          <div className="brand-logo">AB</div>

          <div>
            <h1>AB Bank</h1>
            <p>Digital Banking</p>
          </div>
        </div>

        <div className="login-welcome">
          <h2>Banking made simple.</h2>

          <p>
            Manage your accounts, transfer money, track transactions
            and take control of your financial future.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <div className="feature-icon">🔒</div>

              <div>
                <strong>Secure Banking</strong>
                <span>Advanced security keeps your money safe.</span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">⚡</div>

              <div>
                <strong>Fast & Easy</strong>
                <span>Complete your banking anytime, anywhere.</span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">📊</div>

              <div>
                <strong>Smart Insights</strong>
                <span>Understand your spending and finances.</span>
              </div>
            </div>

          </div>
        </div>

        <div className="login-security-note">
          🛡️ Your connection is protected with bank-grade security.
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-container">

          <div className="login-header">
            <h2>Welcome back</h2>

            <p>
              Sign in to access your AB Bank account
            </p>
          </div>


          {/* CUSTOMER / ADMIN TABS */}

          <div className="login-tabs">

            <button
              type="button"
              className={
                loginType === "customer"
                  ? "login-tab active"
                  : "login-tab"
              }
              onClick={() => {
                setLoginType("customer");
                setError("");
              }}
            >
              Customer Login
            </button>

            <button
              type="button"
              className={
                loginType === "admin"
                  ? "login-tab active"
                  : "login-tab"
              }
              onClick={() => {
                setLoginType("admin");
                setError("");
              }}
            >
              Admin Login
            </button>

          </div>


          {/* LOGIN FORM */}

          <form onSubmit={handleLogin} className="login-form">

            {error && (
              <div className="login-error">
                ⚠️ {error}
              </div>
            )}


            {/* USER ID */}

            <div className="form-group">

              <label>
                {loginType === "customer"
                  ? "Customer ID / Email"
                  : "Admin ID"}
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  type="text"
                  value={userId}
                  onChange={(e) =>
                    setUserId(e.target.value)
                  }
                  placeholder={
                    loginType === "customer"
                      ? "Enter customer ID or email"
                      : "Enter admin ID"
                  }
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <div className="form-label-row">

                <label>Password</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    setError(
                      "Password recovery will be available soon."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
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
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {/* CAPTCHA */}

            <div className="form-group">

              <label>Security Verification</label>

              <div className="captcha-row">

                <div className="captcha-box">
                  {generatedCaptcha}
                </div>

                <input
                  type="text"
                  value={captcha}
                  onChange={(e) =>
                    setCaptcha(e.target.value)
                  }
                  placeholder="Enter CAPTCHA"
                />

              </div>

            </div>


            {/* REMEMBER DEVICE */}

            {loginType === "customer" && (
              <div className="remember-row">

                <label className="checkbox-label">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>
                    Remember this device
                  </span>

                </label>

              </div>
            )}


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
            >
              🔐 Secure Sign In
            </button>


            {/* BIOMETRIC */}

            {loginType === "customer" && (
              <>
                <div className="login-divider">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  className="biometric-button"
                  onClick={handleBiometric}
                >
                  <span className="fingerprint-icon">
                    ◎
                  </span>

                  Sign in with Fingerprint
                </button>
              </>
            )}

          </form>


          {/* DEMO CREDENTIALS */}

          <div className="demo-login">

            <h4>Demo Credentials</h4>

            {loginType === "customer" ? (
              <p>
                Customer ID: <strong>customer</strong>
                <br />
                Password: <strong>123456</strong>
              </p>
            ) : (
              <p>
                Admin ID: <strong>admin</strong>
                <br />
                Password: <strong>admin123</strong>
              </p>
            )}

            <small>
              CAPTCHA: <strong>7K4P9</strong>
            </small>

          </div>


          <div className="login-footer">
            <span>🔒 256-bit SSL Secure</span>
            <span>•</span>
            <span>AB Bank Digital Banking</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;