import React from "react";
import { useNavigate } from "react-router-dom";
import { useBanking } from "../context/BankingContext";
import AccountCard from "../components/AccountCard";

function Accounts() {
  const navigate = useNavigate();

  const {
    accounts,
    getTotalBalance,
  } = useBanking();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const totalBalance = getTotalBalance();

  return (
    <div className="accounts-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <p className="page-greeting">
            Banking
          </p>

          <h1>My Accounts</h1>

          <p>
            View and manage all your AB Bank accounts.
          </p>
        </div>

        <div className="header-actions">

          <button
            className="secondary-btn"
            onClick={() => navigate("/transactions")}
          >
            Transaction History
          </button>

          <button
            className="primary-btn"
            onClick={() => navigate("/transfer")}
          >
            + Transfer Money
          </button>

        </div>

      </div>


      {/* ACCOUNT SUMMARY */}

      <div className="account-summary">

        <div className="summary-item">

          <div className="summary-icon">
            ₹
          </div>

          <div>
            <span>Total Balance</span>

            <strong>
              {formatCurrency(totalBalance)}
            </strong>
          </div>

        </div>


        <div className="summary-item">

          <div className="summary-icon">
            ▣
          </div>

          <div>
            <span>Total Accounts</span>

            <strong>
              {accounts.length}
            </strong>
          </div>

        </div>


        <div className="summary-item">

          <div className="summary-icon">
            ✓
          </div>

          <div>
            <span>Active Accounts</span>

            <strong>
              {
                accounts.filter(
                  (account) =>
                    account.status === "Active"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      {/* ACCOUNTS */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>Your Accounts</h2>

            <p>
              All your active AB Bank accounts
            </p>
          </div>

        </div>


        <div className="accounts-grid accounts-page-grid">

          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
            />
          ))}

        </div>

      </section>


      {/* ACCOUNT DETAILS TABLE */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>Account Details</h2>

            <p>
              Overview of your account information
            </p>
          </div>

        </div>


        <div className="account-details-card">

          <div className="responsive-table">

            <table className="bank-table">

              <thead>

                <tr>
                  <th>Account Type</th>
                  <th>Account Number</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {accounts.map((account) => (

                  <tr key={account.id}>

                    <td>
                      <strong>
                        {account.type}
                      </strong>
                    </td>

                    <td>
                      {account.accountNumber}
                    </td>

                    <td>
                      <strong>
                        {formatCurrency(
                          account.balance
                        )}
                      </strong>
                    </td>

                    <td>
                      <span className="status-badge status-success">
                        {account.status}
                      </span>
                    </td>

                    <td>

                      <button
                        className="small-btn"
                        onClick={() =>
                          navigate("/transfer", {
                            state: {
                              fromAccount:
                                account.accountNumber,
                            },
                          })
                        }
                      >
                        Transfer
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* SECURITY INFO */}

      <div className="security-info-banner">

        <div className="security-info-icon">
          🛡️
        </div>

        <div>
          <strong>
            Your accounts are protected
          </strong>

          <p>
            AB Bank uses secure authentication
            and encryption to protect your
            banking information.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Accounts;