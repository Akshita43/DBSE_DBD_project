import React, { useEffect, useState } from "react";
import { useBanking } from "../context/BankingContext";

function Settings() {
  const { user, updateUser } = useBanking();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    transactionAlerts: true,
    promotionalOffers: false,
    darkMode: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const savedUser = localStorage.getItem("bankingUser");

      if (!savedUser) {
        setLoading(false);
        return;
      }

      const loggedInUser = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:8080/api/settings/${loggedInUser.customerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
      });

      setPreferences({
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
        transactionAlerts: data.transactionAlerts,
        promotionalOffers: data.promotionalOffers,
        darkMode: false,
      });
    } catch (error) {
      console.error("Settings fetch error:", error);
      showMessage("Unable to load settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const savedUser = localStorage.getItem("bankingUser");

      if (!savedUser) {
        showMessage("User not found.", "error");
        return;
      }

      const loggedInUser = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:8080/api/settings/${loggedInUser.customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...profile,
            emailNotifications:
              preferences.emailNotifications,
            smsNotifications:
              preferences.smsNotifications,
            transactionAlerts:
              preferences.transactionAlerts,
            promotionalOffers:
              preferences.promotionalOffers,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Failed to save settings");
      }

      updateUser(profile);

      const updatedUser = {
        ...loggedInUser,
        ...profile,
      };

      localStorage.setItem(
        "bankingUser",
        JSON.stringify(updatedUser)
      );

      setSaved(true);

      showMessage("Settings updated successfully.");

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Settings update error:", error);
      showMessage(
        "Unable to update settings.",
        "error"
      );
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const togglePreference = async (key) => {
    const updatedPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    setPreferences(updatedPreferences);

    try {
      const savedUser = localStorage.getItem("bankingUser");

      if (!savedUser) return;

      const loggedInUser = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:8080/api/settings/${loggedInUser.customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...profile,
            emailNotifications:
              updatedPreferences.emailNotifications,
            smsNotifications:
              updatedPreferences.smsNotifications,
            transactionAlerts:
              updatedPreferences.transactionAlerts,
            promotionalOffers:
              updatedPreferences.promotionalOffers,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update preference");
      }

      showMessage("Preference updated successfully.");
    } catch (error) {
      console.error("Preference update error:", error);

      setPreferences(preferences);

      showMessage(
        "Unable to update preference.",
        "error"
      );
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);

    showMessage(
      "Account deletion request submitted. This is a demo feature."
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile and account preferences.</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={
            messageType === "error"
              ? "form-error"
              : "form-success"
          }
          style={{ marginBottom: "20px" }}
        >
          {message}
        </div>
      )}

      {/* Profile */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Personal Information</h2>
            <p>Update your basic account information.</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit}>

          <div className="profile-section">
            <div className="large-avatar">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div>
              <h3>{profile.name}</h3>
              <p>
                Customer ID:{" "}
                {user?.customerId || "AB123456"}
              </p>

              <span className="status-badge status-success">
                Verified Customer
              </span>
            </div>
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Customer ID</label>

              <input
                type="text"
                value={
                  user?.customerId || "AB123456"
                }
                disabled
              />
            </div>

          </div>

          <div className="settings-actions">

            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>

            {saved && (
              <span className="save-success">
                ✓ Changes saved successfully
              </span>
            )}

          </div>

        </form>
      </div>

      {/* Preferences */}
      <div className="card">

        <div className="card-header">
          <div>
            <h2>Preferences</h2>
            <p>
              Customize how you receive banking updates.
            </p>
          </div>
        </div>

        <div className="preference-list">

          <div className="preference-item">
            <div>
              <h3>Email Notifications</h3>
              <p>
                Receive important banking updates by email.
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={
                  preferences.emailNotifications
                }
                onChange={() =>
                  togglePreference(
                    "emailNotifications"
                  )
                }
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="preference-item">
            <div>
              <h3>SMS Notifications</h3>
              <p>
                Receive important alerts through SMS.
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={
                  preferences.smsNotifications
                }
                onChange={() =>
                  togglePreference(
                    "smsNotifications"
                  )
                }
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="preference-item">
            <div>
              <h3>Transaction Alerts</h3>
              <p>
                Get notified about account transactions.
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={
                  preferences.transactionAlerts
                }
                onChange={() =>
                  togglePreference(
                    "transactionAlerts"
                  )
                }
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="preference-item">
            <div>
              <h3>Promotional Offers</h3>
              <p>
                Receive offers and information about
                banking products.
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={
                  preferences.promotionalOffers
                }
                onChange={() =>
                  togglePreference(
                    "promotionalOffers"
                  )
                }
              />
              <span className="slider"></span>
            </label>
          </div>

        </div>
      </div>

      {/* Account Preferences */}
      <div className="card">

        <div className="card-header">
          <div>
            <h2>Account Preferences</h2>
            <p>
              Manage your application preferences.
            </p>
          </div>
        </div>

        <div className="settings-option-list">

          <div className="settings-option">

            <div className="settings-option-icon">
              🌐
            </div>

            <div>
              <h3>Language</h3>
              <p>
                Choose your preferred language.
              </p>
            </div>

            <select defaultValue="English">
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
            </select>

          </div>

          <div className="settings-option">

            <div className="settings-option-icon">
              💱
            </div>

            <div>
              <h3>Currency</h3>
              <p>
                Default currency used throughout the
                application.
              </p>
            </div>

            <select defaultValue="INR">
              <option>INR - ₹</option>
              <option>USD - $</option>
              <option>EUR - €</option>
            </select>

          </div>

        </div>
      </div>

      {/* Danger Zone */}
      <div className="card danger-zone">

        <div className="card-header">
          <div>
            <h2>Account Management</h2>
            <p>
              Actions that affect your banking account.
            </p>
          </div>
        </div>

        <div className="danger-option">

          <div>
            <h3>Request Account Deletion</h3>

            <p>
              Submit a request to permanently close
              your banking account.
            </p>
          </div>

          <button
            className="btn btn-danger"
            onClick={() =>
              setShowDeleteConfirm(true)
            }
          >
            Delete Account
          </button>

        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>Confirm Account Deletion</h2>
                <p>
                  Are you sure you want to request
                  account deletion?
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
              >
                ×
              </button>

            </div>

            <div className="form-error">
              ⚠️ This is a demo feature. Your account
              will not actually be deleted.
            </div>

            <div className="modal-actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteAccount}
              >
                Confirm Request
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Security Reminder */}
      <div className="info-banner">

        <div className="info-banner-icon">
          🔐
        </div>

        <div>
          <strong>Keep Your Account Secure</strong>

          <p>
            Always keep your contact information up to
            date and enable security notifications to
            protect your account.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Settings;