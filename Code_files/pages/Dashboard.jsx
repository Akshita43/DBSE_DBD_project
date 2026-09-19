import React from "react";
import { useNavigate } from "react-router-dom";
import { useBanking } from "../context/BankingContext";
import StatCard from "../components/StatCard";
import AccountCard from "../components/AccountCard";
import TransactionTable from "../components/TransactionTable";

function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    accounts,
    transactions,
    getTotalBalance,
  } = useBanking();

  const totalBalance = getTotalBalance();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Calculate total money received
  const totalCredits = transactions
    .filter((transaction) => Number(transaction.amount) > 0)
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  // Calculate total money spent
  const totalDebits = transactions
    .filter((transaction) => Number(transaction.amount) < 0)
    .reduce(
      (total, transaction) =>
        total + Math.abs(Number(transaction.amount)),
      0
    );

  return (
    <div className="dashboard-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <p className="page-greeting">
            Welcome back 👋
          </p>

          <h1>
            {user?.name || "Customer"}
          </h1>

          <p>
            Here's what's happening with your
            finances today.
          </p>
        </div>

        <div className="header-actions">

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
            onClick={() =>
              navigate("/transfer")
            }
          >
            + Transfer Money
          </button>

        </div>

      </div>


      {/* STAT CARDS */}

      <div className="stats-grid">

        <StatCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon="₹"
          subtitle={`Across ${accounts.length} accounts`}
        />

        <StatCard
          title="Money Received"
          value={formatCurrency(totalCredits)}
          icon="↑"
          subtitle="Total credits"
          trend="+8.4%"
        />

        <StatCard
          title="Money Spent"
          value={formatCurrency(totalDebits)}
          icon="↓"
          subtitle="Total debits"
        />

        <StatCard
          title="Active Accounts"
          value={accounts.length}
          icon="▣"
          subtitle="All accounts active"
        />

      </div>


      {/* QUICK ACTIONS */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>Quick Actions</h2>
            <p>
              Manage your everyday banking
            </p>
          </div>

        </div>


        <div className="quick-actions">

          <button
            className="quick-action"
            onClick={() =>
              navigate("/transfer")
            }
          >
            <div className="quick-action-icon">
              ↔
            </div>

            <div>
              <strong>Transfer Money</strong>
              <span>
                Send money to another account
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>
          </button>


          <button
            className="quick-action"
            onClick={() =>
              navigate("/deposit")
            }
          >
            <div className="quick-action-icon">
              ↓
            </div>

            <div>
              <strong>Deposit Money</strong>
              <span>
                Add money to your account
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>
          </button>


          <button
            className="quick-action"
            onClick={() =>
              navigate("/withdraw")
            }
          >
            <div className="quick-action-icon">
              ↑
            </div>

            <div>
              <strong>Withdraw Money</strong>
              <span>
                Withdraw from your account
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>
          </button>


          <button
            className="quick-action"
            onClick={() =>
              navigate("/accounts")
            }
          >
            <div className="quick-action-icon">
              ▣
            </div>

            <div>
              <strong>My Accounts</strong>
              <span>
                View all your accounts
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>
          </button>

        </div>

      </section>


      {/* ACCOUNTS */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>My Accounts</h2>

            <p>
              Your available bank accounts
            </p>
          </div>

          <button
            className="text-btn"
            onClick={() =>
              navigate("/accounts")
            }
          >
            View All →
          </button>

        </div>


        <div className="accounts-grid">

          {accounts.slice(0, 2).map((account) => (
            <AccountCard
              key={account.id}
              account={account}
            />
          ))}

        </div>

      </section>


      {/* RECENT TRANSACTIONS */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>Recent Transactions</h2>

            <p>
              Your latest banking activity
            </p>
          </div>

          <button
            className="text-btn"
            onClick={() =>
              navigate("/transactions")
            }
          >
            View All →
          </button>

        </div>


        <div className="dashboard-table-card">

          <TransactionTable
            transactions={transactions}
            limit={5}
            showViewAll={true}
          />

        </div>

      </section>


      {/* BOTTOM GRID */}

      <div className="dashboard-bottom-grid">


        {/* FINANCIAL HEALTH */}

        <div className="dashboard-info-card">

          <div className="info-card-header">

            <div>
              <h3>Financial Health</h3>
              <p>
                Your financial overview
              </p>
            </div>

            <span className="info-card-icon">
              ♥
            </span>

          </div>


          <div className="health-score">

            <div className="health-circle">
              <strong>82</strong>
              <span>/100</span>
            </div>

            <div>
              <strong>Good</strong>
              <p>
                You're doing well with your
                finances.
              </p>
            </div>

          </div>


          <button
            className="card-link"
            onClick={() =>
              navigate("/financial-health")
            }
          >
            View Financial Health →
          </button>

        </div>


        {/* INVESTMENTS */}

        <div className="dashboard-info-card">

          <div className="info-card-header">

            <div>
              <h3>Investments</h3>
              <p>
                Grow your wealth
              </p>
            </div>

            <span className="info-card-icon">
              ◈
            </span>

          </div>


          <div className="investment-summary">

            <span>Total Investment</span>

            <strong>
              ₹75,000
            </strong>

            <span className="investment-profit">
              +₹6,450 (8.6%)
            </span>

          </div>


          <button
            className="card-link"
            onClick={() =>
              navigate("/investments")
            }
          >
            View Investments →
          </button>

        </div>


        {/* LOANS */}

        <div className="dashboard-info-card">

          <div className="info-card-header">

            <div>
              <h3>Active Loans</h3>
              <p>
                Manage your loans
              </p>
            </div>

            <span className="info-card-icon">
              ▥
            </span>

          </div>


          <div className="loan-summary">

            <span>Outstanding Amount</span>

            <strong>
              ₹2,45,000
            </strong>

            <span>
              Next EMI: ₹12,500
            </span>

          </div>


          <button
            className="card-link"
            onClick={() =>
              navigate("/loans")
            }
          >
            Manage Loans →
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;