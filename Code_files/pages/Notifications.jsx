
import React, { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const savedUser = localStorage.getItem("bankingUser");

      if (!savedUser) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:8080/api/notifications/${user.customerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      setNotifications(data);
    } catch (error) {
      console.error("Notification fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications =
    filter === "Unread"
      ? notifications.filter(
          (notification) => !notification.read
        )
      : notifications;

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/read/${id}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const savedUser = localStorage.getItem("bankingUser");

      if (!savedUser) return;

      const user = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:8080/api/notifications/read-all/${user.customerId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your account activity.</p>
        </div>

        {unreadCount > 0 && (
          <button
            className="btn btn-secondary"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="card">
          <p>Loading notifications...</p>
        </div>
      ) : (
        <>
          {/* Notification Summary */}
          <div className="notification-summary">
            <div>
              <strong>{unreadCount}</strong>
              <span>Unread Notifications</span>
            </div>

            <div>
              <strong>{notifications.length}</strong>
              <span>Total Notifications</span>
            </div>
          </div>

          {/* Filters */}
          <div className="card">
            <div className="notification-filters">
              <button
                className={
                  filter === "All" ? "filter-active" : ""
                }
                onClick={() => setFilter("All")}
              >
                All
              </button>

              <button
                className={
                  filter === "Unread"
                    ? "filter-active"
                    : ""
                }
                onClick={() => setFilter("Unread")}
              >
                Unread
                {unreadCount > 0 && (
                  <span>{unreadCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="notification-list">
            {filteredNotifications.length === 0 ? (
              <div className="card empty-state">
                <div className="empty-icon">🔔</div>
                <h3>No notifications</h3>
                <p>You are all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  className={`notification-card ${
                    !notification.read
                      ? "notification-unread"
                      : ""
                  }`}
                  key={notification.id}
                >
                  <div
                    className={`notification-icon notification-${notification.type}`}
                  >
                    {notification.icon}
                  </div>

                  <div className="notification-content">
                    <div className="notification-title-row">
                      <h3>{notification.title}</h3>

                      {!notification.read && (
                        <span className="unread-dot"></span>
                      )}
                    </div>

                    <p>{notification.message}</p>

                    <span className="notification-time">
                      {notification.time}
                    </span>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                      >
                        Mark Read
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteNotification(notification.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notification Preferences */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Notification Preferences</h2>
                <p>
                  Choose which notifications you want to receive.
                </p>
              </div>
            </div>

            <div className="preference-list">
              <div className="preference-item">
                <div>
                  <h3>Transaction Alerts</h3>
                  <p>
                    Get notified when money is transferred or
                    received.
                  </p>
                </div>

                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <h3>Security Alerts</h3>
                  <p>
                    Receive alerts about account security and
                    logins.
                  </p>
                </div>

                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <h3>Investment Updates</h3>
                  <p>
                    Receive updates about your investments.
                  </p>
                </div>

                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <h3>Promotional Notifications</h3>
                  <p>
                    Receive information about offers and
                    banking products.
                  </p>
                </div>

                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Notifications;

