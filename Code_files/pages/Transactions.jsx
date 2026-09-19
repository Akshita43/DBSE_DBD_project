import React, { useEffect, useMemo, useState } from "react";
import { useBanking } from "../context/BankingContext";

function Transactions() {
  const {
    transactions,
    setTransactions,
  } = useBanking();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // LOAD TRANSACTIONS FROM SPRING BOOT
  useEffect(() => {
    const savedUser = localStorage.getItem("bankingUser");

    if (!savedUser) {
      return;
    }

    const loggedInUser = JSON.parse(savedUser);

    if (!loggedInUser?.customerId) {
      return;
    }

    fetch(
      `http://localhost:8080/api/transactions/${loggedInUser.customerId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load transactions");
        }

        return response.json();
      })
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => {
        console.error(
          "Transaction loading error:",
          error
        );
      });
  }, [setTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchText = search.toLowerCase();

      const transactionId =
        transaction.id?.toString().toLowerCase();

      const matchesSearch =
        transaction.description
          ?.toLowerCase()
          .includes(searchText) ||
        transactionId?.includes(searchText) ||
        transaction.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "All" ||
        transaction.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        transaction.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    transactions,
    search,
    typeFilter,
    statusFilter,
  ]);

  const formatAmount = (amount) => {
    return `₹${Math.abs(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalCredits = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter((t) => t.amount < 0)
    .reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>
            View and manage your recent banking
            transactions.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon success">↓</div>

          <div>
            <span>Total Credits</span>

            <h2>
              ₹
              {totalCredits.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon danger">↑</div>

          <div>
            <span>Total Debits</span>

            <h2>
              ₹
              {totalDebits.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">↔</div>

          <div>
            <span>Total Transactions</span>

            <h2>{transactions.length}</h2>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="filter-row">
          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="All">All Types</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Completed">
              Completed
            </option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Transaction History</h2>

            <p>
              Showing {filteredTransactions.length} of{" "}
              {transactions.length} transactions
            </p>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>

            <h3>No transactions found</h3>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map(
                  (transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {formatDate(transaction.date)}
                      </td>

                      <td>
                        <div className="transaction-info">
                          <div
                            className={`transaction-icon ${
                              transaction.amount > 0
                                ? "credit-icon"
                                : "debit-icon"
                            }`}
                          >
                            {transaction.amount > 0
                              ? "↓"
                              : "↑"}
                          </div>

                          <div>
                            <strong>
                              {transaction.description}
                            </strong>

                            <small>
                              {transaction.id}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        {transaction.category ||
                          "General"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            transaction.amount > 0
                              ? "badge-success"
                              : "badge-danger"
                          }`}
                        >
                          {transaction.amount > 0
                            ? "Credit"
                            : "Debit"}
                        </span>
                      </td>

                      <td>
                        <strong
                          className={
                            transaction.amount > 0
                              ? "amount-credit"
                              : "amount-debit"
                          }
                        >
                          {transaction.amount > 0
                            ? "+"
                            : "-"}

                          {formatAmount(
                            transaction.amount
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            transaction.status ===
                            "Completed"
                              ? "status-success"
                              : transaction.status ===
                                "Pending"
                              ? "status-warning"
                              : "status-danger"
                          }`}
                        >
                          {transaction.status ||
                            "Completed"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;