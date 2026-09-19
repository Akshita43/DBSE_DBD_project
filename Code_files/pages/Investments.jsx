
import React, { useEffect, useState } from "react";

function Investments() {
  const [showInvest, setShowInvest] = useState(false);
  const [investmentType, setInvestmentType] = useState("Fixed Deposit");
  const [investmentList, setInvestmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const savedUser = localStorage.getItem("bankingUser");

      if (!savedUser) {
        setInvestmentList([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:8080/api/investments/${user.customerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch investments");
      }

      const data = await response.json();

      setInvestmentList(data);
    } catch (error) {
      console.error("Investment fetch error:", error);
      setInvestmentList([]);
    } finally {
      setLoading(false);
    }
  };

  const totalInvested = investmentList.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const currentValue = investmentList.reduce(
    (sum, item) => sum + Number(item.currentValue || 0),
    0
  );

  const totalReturns = currentValue - totalInvested;

  const formatMoney = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getReturnRate = (investment) => {
    return `${investment.returnRate}%`;
  };

  const handleInvest = (e) => {
    e.preventDefault();

    const amount = Number(e.target.amount.value);

    if (!amount || amount <= 0) {
      alert("Please enter a valid investment amount.");
      return;
    }

    alert(
      `${investmentType} investment of ${formatMoney(
        amount
      )} request submitted successfully.`
    );

    setShowInvest(false);
    e.target.reset();
  };

  const fixedDeposits = investmentList
    .filter((item) => item.investmentType === "Fixed Deposit")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const mutualFunds = investmentList
    .filter((item) => item.investmentType === "Mutual Fund")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const otherInvestments = investmentList
    .filter(
      (item) =>
        item.investmentType !== "Fixed Deposit" &&
        item.investmentType !== "Mutual Fund"
    )
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Investments</h1>
          <p>Grow your money with smart investment options.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowInvest(true)}
        >
          + New Investment
        </button>
      </div>

      {/* Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">₹</div>

          <div>
            <span>Total Invested</span>
            <h2>{formatMoney(totalInvested)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">↗</div>

          <div>
            <span>Current Value</span>
            <h2>{formatMoney(currentValue)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">+</div>

          <div>
            <span>Total Returns</span>
            <h2>{formatMoney(totalReturns)}</h2>
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Portfolio Overview</h2>
            <p>Your current investment portfolio.</p>
          </div>
        </div>

        <div className="portfolio-overview">
          <div className="portfolio-total">
            <span>Portfolio Value</span>

            <h2>{formatMoney(currentValue)}</h2>

            <div className="return-positive">
              ↑ {formatMoney(totalReturns)} overall returns
            </div>
          </div>

          <div className="portfolio-breakdown">
            <div>
              <span>Fixed Deposits</span>
              <strong>{formatMoney(fixedDeposits)}</strong>
            </div>

            <div>
              <span>Mutual Funds</span>
              <strong>{formatMoney(mutualFunds)}</strong>
            </div>

            <div>
              <span>Other Investments</span>
              <strong>{formatMoney(otherInvestments)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Investments */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>My Investments</h2>
            <p>Track your active investments and returns.</p>
          </div>
        </div>

        <div className="investment-list">
          {loading ? (
            <p>Loading investments...</p>
          ) : investmentList.length === 0 ? (
            <p>No investments found.</p>
          ) : (
            investmentList.map((investment) => {
              const profit =
                Number(investment.currentValue || 0) -
                Number(investment.amount || 0);

              return (
                <div
                  className="investment-card"
                  key={investment.id}
                >
                  <div className="investment-top">
                    <div>
                      <span className="investment-type">
                        {investment.investmentType}
                      </span>

                      <h3>{investment.name}</h3>

                      <small>
                        INV{String(investment.id).padStart(6, "0")}
                      </small>
                    </div>

                    <span className="status-badge status-success">
                      {investment.status}
                    </span>
                  </div>

                  <div className="investment-details-grid">
                    <div>
                      <span>Invested Amount</span>
                      <strong>
                        {formatMoney(investment.amount)}
                      </strong>
                    </div>

                    <div>
                      <span>Current Value</span>
                      <strong>
                        {formatMoney(investment.currentValue)}
                      </strong>
                    </div>

                    <div>
                      <span>Returns</span>

                      <strong className="amount-credit">
                        +{formatMoney(profit)}
                      </strong>
                    </div>

                    <div>
                      <span>Return Rate</span>
                      <strong>
                        {getReturnRate(investment)}
                      </strong>
                    </div>

                    <div>
                      <span>Maturity</span>
                      <strong>
                        {investment.maturity}
                      </strong>
                    </div>
                  </div>

                  <div className="investment-actions">
                    <button
                      className="btn btn-secondary"
                      type="button"
                    >
                      View Details
                    </button>

                    <button
                      className="btn btn-outline"
                      type="button"
                    >
                      View Statement
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Investment Options */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Investment Options</h2>
            <p>
              Choose an investment according to your financial goals.
            </p>
          </div>
        </div>

        <div className="investment-options">
          <div className="investment-option">
            <div className="investment-option-icon">🏦</div>

            <h3>Fixed Deposit</h3>

            <p>
              Secure investment with guaranteed returns and flexible
              tenure options.
            </p>

            <strong>Returns up to 7.0%</strong>

            <button
              className="btn btn-primary"
              onClick={() => {
                setInvestmentType("Fixed Deposit");
                setShowInvest(true);
              }}
            >
              Invest Now
            </button>
          </div>

          <div className="investment-option">
            <div className="investment-option-icon">📈</div>

            <h3>Mutual Funds</h3>

            <p>
              Diversified investment options for long-term wealth
              creation.
            </p>

            <strong>Returns vary by market</strong>

            <button
              className="btn btn-primary"
              onClick={() => {
                setInvestmentType("Mutual Fund");
                setShowInvest(true);
              }}
            >
              Invest Now
            </button>
          </div>

          <div className="investment-option">
            <div className="investment-option-icon">💰</div>

            <h3>Recurring Deposit</h3>

            <p>
              Build your savings every month with disciplined recurring
              investments.
            </p>

            <strong>Returns up to 6.5%</strong>

            <button
              className="btn btn-primary"
              onClick={() => {
                setInvestmentType("Recurring Deposit");
                setShowInvest(true);
              }}
            >
              Start Now
            </button>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvest && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>New Investment</h2>
                <p>Create a new investment.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowInvest(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleInvest}>
              <div className="form-group">
                <label>Investment Type</label>

                <select
                  value={investmentType}
                  onChange={(e) =>
                    setInvestmentType(e.target.value)
                  }
                >
                  <option>Fixed Deposit</option>
                  <option>Mutual Fund</option>
                  <option>Recurring Deposit</option>
                </select>
              </div>

              <div className="form-group">
                <label>Investment Amount</label>

                <input
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  min="500"
                  required
                />
              </div>

              <div className="form-group">
                <label>Investment Duration</label>

                <select>
                  <option>1 Year</option>
                  <option>2 Years</option>
                  <option>3 Years</option>
                  <option>5 Years</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowInvest(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Confirm Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Investments;

