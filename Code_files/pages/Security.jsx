
import React, { useEffect, useState } from "react";

function Security() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [pinData, setPinData] = useState({
    current: "",
    newPin: "",
    confirm: "",
  });

  const [securityMessage, setSecurityMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const getCustomerId = () => {
    const savedUser = localStorage.getItem("bankingUser");

    if (!savedUser) {
      return null;
    }

    const user = JSON.parse(savedUser);

    return user?.customerId || null;
  };

  const loadSecuritySettings = async () => {
    try {
      const customerId = getCustomerId();

      if (!customerId) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/security/${customerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load security settings");
      }

      const data = await response.json();

      setTwoFactor(data.twoFactor);
      setBiometric(data.biometric);
      setLoginAlerts(data.loginAlerts);
    } catch (error) {
      console.error("Security settings error:", error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message, type = "success") => {
    setSecurityMessage(message);
    setMessageType(type);

    setTimeout(() => {
      setSecurityMessage("");
    }, 3000);
  };

  const updateSecuritySettings = async (
    newTwoFactor,
    newBiometric,
    newLoginAlerts,
    message
  ) => {
    try {
      const customerId = getCustomerId();

      if (!customerId) {
        showMessage("User not found.", "error");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/security/${customerId}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            twoFactor: newTwoFactor,
            biometric: newBiometric,
            loginAlerts: newLoginAlerts,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Failed to update settings");
      }

      setTwoFactor(newTwoFactor);
      setBiometric(newBiometric);
      setLoginAlerts(newLoginAlerts);

      showMessage(message);
    } catch (error) {
      console.error("Security update error:", error);
      showMessage(
        "Unable to update security settings.",
        "error"
      );
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      !passwordData.current ||
      !passwordData.newPassword ||
      !passwordData.confirm
    ) {
      showMessage(
        "Please fill in all password fields.",
        "error"
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirm
    ) {
      showMessage(
        "New password and confirmation password do not match.",
        "error"
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage(
        "Password must contain at least 6 characters.",
        "error"
      );
      return;
    }

    try {
      const customerId = getCustomerId();

      const response = await fetch(
        `http://localhost:8080/api/security/${customerId}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwordData.current,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        showMessage(data, "error");
        return;
      }

      showMessage("Password changed successfully.");

      setPasswordData({
        current: "",
        newPassword: "",
        confirm: "",
      });
    } catch (error) {
      console.error("Password change error:", error);
      showMessage(
        "Unable to connect to the banking server.",
        "error"
      );
    }
  };

  const handlePinChange = async (e) => {
    e.preventDefault();

    if (
      !pinData.current ||
      !pinData.newPin ||
      !pinData.confirm
    ) {
      showMessage(
        "Please fill in all PIN fields.",
        "error"
      );
      return;
    }

    if (pinData.newPin !== pinData.confirm) {
      showMessage(
        "New PIN and confirmation PIN do not match.",
        "error"
      );
      return;
    }

    if (pinData.newPin.length !== 4) {
      showMessage(
        "PIN must contain exactly 4 digits.",
        "error"
      );
      return;
    }

    try {
      const customerId = getCustomerId();

      const response = await fetch(
        `http://localhost:8080/api/security/${customerId}/pin`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPin: pinData.current,
            newPin: pinData.newPin,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        showMessage(data, "error");
        return;
      }

      showMessage(
        "Transaction PIN changed successfully."
      );

      setPinData({
        current: "",
        newPin: "",
        confirm: "",
      });
    } catch (error) {
      console.error("PIN change error:", error);
      showMessage(
        "Unable to connect to the banking server.",
        "error"
      );
    }
  };

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Security</h1>

          <p>
            Manage your account security and
            authentication settings.
          </p>
        </div>
      </div>

      {/* Security Message */}
      {securityMessage && (
        <div
          className={
            messageType === "error"
              ? "form-error"
              : "form-success"
          }
          style={{ marginBottom: "20px" }}
        >
          {securityMessage}
        </div>
      )}

      {loading ? (
        <div className="card">
          <p>Loading security settings...</p>
        </div>
      ) : (
        <>
          {/* Security Score */}
          <div className="security-score-card">

            <div className="security-score-icon">
              🛡️
            </div>

            <div className="security-score-content">
              <span>Security Status</span>

              <h2>Strong</h2>

              <p>
                Your account has multiple security
                features enabled.
              </p>
            </div>

            <div className="security-score-value">
              <strong>85%</strong>

              <span>Protected</span>
            </div>

          </div>

          {/* Authentication */}
          <div className="card">

            <div className="card-header">
              <div>
                <h2>
                  Authentication & Verification
                </h2>

                <p>
                  Control how your account is protected.
                </p>
              </div>
            </div>

            <div className="security-settings">

              {/* 2FA */}
              <div className="security-setting">

                <div className="security-setting-icon">
                  🔐
                </div>

                <div className="security-setting-content">

                  <h3>
                    Two-Factor Authentication
                  </h3>

                  <p>
                    Add an extra layer of security using
                    OTP verification during login.
                  </p>

                  <span
                    className={
                      twoFactor
                        ? "security-enabled"
                        : "security-disabled"
                    }
                  >
                    {twoFactor
                      ? "Enabled"
                      : "Disabled"}
                  </span>

                </div>

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={(e) => {
                      const enabled =
                        e.target.checked;

                      updateSecuritySettings(
                        enabled,
                        biometric,
                        loginAlerts,
                        enabled
                          ? "Two-Factor Authentication enabled."
                          : "Two-Factor Authentication disabled."
                      );
                    }}
                  />

                  <span className="slider"></span>

                </label>

              </div>

              {/* Biometric */}
              <div className="security-setting">

                <div className="security-setting-icon">
                  👆
                </div>

                <div className="security-setting-content">

                  <h3>Biometric Login</h3>

                  <p>
                    Use fingerprint or biometric
                    authentication for faster account
                    access.
                  </p>

                  <span
                    className={
                      biometric
                        ? "security-enabled"
                        : "security-disabled"
                    }
                  >
                    {biometric
                      ? "Enabled"
                      : "Not Configured"}
                  </span>

                </div>

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={biometric}
                    onChange={(e) => {
                      const enabled =
                        e.target.checked;

                      updateSecuritySettings(
                        twoFactor,
                        enabled,
                        loginAlerts,
                        enabled
                          ? "Biometric login enabled for this demo."
                          : "Biometric login disabled."
                      );
                    }}
                  />

                  <span className="slider"></span>

                </label>

              </div>

              {/* Login Alerts */}
              <div className="security-setting">

                <div className="security-setting-icon">
                  🔔
                </div>

                <div className="security-setting-content">

                  <h3>Login Alerts</h3>

                  <p>
                    Receive notifications whenever a new
                    login is detected.
                  </p>

                  <span
                    className={
                      loginAlerts
                        ? "security-enabled"
                        : "security-disabled"
                    }
                  >
                    {loginAlerts
                      ? "Enabled"
                      : "Disabled"}
                  </span>

                </div>

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={loginAlerts}
                    onChange={(e) => {
                      const enabled =
                        e.target.checked;

                      updateSecuritySettings(
                        twoFactor,
                        biometric,
                        enabled,
                        enabled
                          ? "Login alerts enabled."
                          : "Login alerts disabled."
                      );
                    }}
                  />

                  <span className="slider"></span>

                </label>

              </div>

            </div>

          </div>

          {/* Change Password */}
          <div className="card">

            <div className="card-header">

              <div>

                <h2>Change Password</h2>

                <p>
                  Update your banking account password.
                </p>

              </div>

            </div>

            <form
              className="security-form"
              onSubmit={handlePasswordChange}
            >

              <div className="form-group">

                <label>
                  Current Password
                </label>

                <div className="password-input">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    New Password
                  </label>

                  <input
                    type="password"
                    value={
                      passwordData.newPassword
                    }
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword:
                          e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirm:
                          e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                  />

                </div>

              </div>

              <div className="password-rules">

                <span>
                  ✓ At least 6 characters
                </span>

                <span>
                  ✓ Use numbers and letters
                </span>

                <span>
                  ✓ Avoid easily guessed passwords
                </span>

              </div>

              <button
                type="submit"
                className="btn btn-primary"
              >
                Change Password
              </button>

            </form>

          </div>

          {/* Transaction PIN */}
          <div className="card">

            <div className="card-header">

              <div>

                <h2>Transaction PIN</h2>

                <p>
                  Change the PIN used to authorize
                  transactions.
                </p>

              </div>

            </div>

            <form
              className="security-form"
              onSubmit={handlePinChange}
            >

              <div className="form-group">

                <label>
                  Current PIN
                </label>

                <div className="password-input">

                  <input
                    type={
                      showPin
                        ? "text"
                        : "password"
                    }
                    maxLength="4"
                    inputMode="numeric"
                    value={pinData.current}
                    onChange={(e) =>
                      setPinData({
                        ...pinData,
                        current:
                          e.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    }
                    placeholder="Enter current PIN"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPin(!showPin)
                    }
                  >
                    {showPin
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    New PIN
                  </label>

                  <input
                    type="password"
                    maxLength="4"
                    inputMode="numeric"
                    value={pinData.newPin}
                    onChange={(e) =>
                      setPinData({
                        ...pinData,
                        newPin:
                          e.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    }
                    placeholder="4-digit PIN"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Confirm PIN
                  </label>

                  <input
                    type="password"
                    maxLength="4"
                    inputMode="numeric"
                    value={pinData.confirm}
                    onChange={(e) =>
                      setPinData({
                        ...pinData,
                        confirm:
                          e.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    }
                    placeholder="Confirm PIN"
                  />

                </div>

              </div>

              <button
                type="submit"
                className="btn btn-primary"
              >
                Change Transaction PIN
              </button>

            </form>

          </div>

          {/* Recent Security Activity */}
          <div className="card">

            <div className="card-header">

              <div>

                <h2>
                  Recent Security Activity
                </h2>

                <p>
                  Recent activity related to your
                  account security.
                </p>

              </div>

            </div>

            <div className="security-activity-list">

              <div className="security-activity">

                <div className="activity-icon success">
                  ✓
                </div>

                <div>
                  <strong>
                    Successful Login
                  </strong>

                  <p>
                    Chrome on Windows • Today,
                    10:24 AM
                  </p>
                </div>

                <span className="activity-status">
                  Successful
                </span>

              </div>

              <div className="security-activity">

                <div className="activity-icon success">
                  ✓
                </div>

                <div>
                  <strong>
                    OTP Verification
                  </strong>

                  <p>
                    Login verification completed •
                    Today, 10:24 AM
                  </p>
                </div>

                <span className="activity-status">
                  Verified
                </span>

              </div>

              <div className="security-activity">

                <div className="activity-icon security">
                  🔐
                </div>

                <div>
                  <strong>
                    Password Updated
                  </strong>

                  <p>
                    Account password was last updated
                    30 days ago.
                  </p>
                </div>

                <span className="activity-status">
                  Secure
                </span>

              </div>

            </div>

          </div>

          {/* Security Warning */}
          <div className="warning-banner">

            <div className="warning-banner-icon">
              ⚠️
            </div>

            <div>

              <strong>
                Stay Safe
              </strong>

              <p>
                Never share your password, OTP, PIN or
                banking credentials with anyone. The bank
                will never ask you to share these details.
              </p>

            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default Security;