
import React, { useEffect, useState } from "react";

function Loans() {
  const [showApply, setShowApply] = useState(false);
  const [loanType, setLoanType] = useState("Personal Loan");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const savedUser = localStorage.getItem("bankingUser");

      if (!savedUser) {
        setLoans([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:8080/api/loans/${user.customerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch loans");
      }

      const data = await response.json();

      setLoans(data);
    } catch (error) {
      console.error("Loan fetch error:", error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const handleApply = (e) => {
    e.preventDefault();

    setShowApply(false);
  };

  const getLoanId = (loan) => {
    return `LN${String(loan.id).padStart(6, "0")}`;
  };

  const getProgress = (loan) => {
    if (!loan.loanAmount || !loan.outstandingAmount) {
      return 0;
    }

    return (
      ((loan.loanAmount - loan.outstandingAmount) /
        loan.loanAmount) *
      100
    );
  };

  const getInterest = (loan) => {
    return `${loan.interestRate}%`;
  };

  const getTenure = (loan) => {
    return `${loan.tenure} Months`;
  };

  const getPaidEmis = (loan) => {
    if (!loan.loanAmount || !loan.outstandingAmount || !loan.emi) {
      return 0;
    }

    return Math.max(
      0,
      Math.round(
        (loan.loanAmount - loan.outstandingAmount) /
          loan.emi
      )
    );
  };

  const totalLoanAmount = loans.reduce(
    (total, loan) => total + Number(loan.loanAmount || 0),
    0
  );

  const totalOutstanding = loans.reduce(
    (total, loan) =>
      total + Number(loan.outstandingAmount || 0),
    0
  );

  const activeLoans = loans.filter(
    (loan) => loan.status === "Active"
  ).length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Loans</h1>
          <p>Manage your loans and explore new loan options.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowApply(true)}
        >
          + Apply for Loan
        </button>
      </div>

      {/* Loan Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">₹</div>
          <div>
            <span>Total Loan Amount</span>
            <h2>{formatMoney(totalLoanAmount)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon danger">↘</div>
          <div>
            <span>Outstanding Amount</span>
            <h2>{formatMoney(totalOutstanding)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">✓</div>
          <div>
            <span>Active Loans</span>
            <h2>{activeLoans}</h2>
          </div>
        </div>
      </div>

      {/* Active Loans */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>My Active Loans</h2>
            <p>Details of your currently active loans.</p>
          </div>
        </div>

        <div className="loan-list">
          {loading ? (
            <p>Loading loans...</p>
          ) : loans.length === 0 ? (
            <p>No loans found.</p>
          ) : (
            loans.map((loan) => {
              const progress = getProgress(loan);

              return (
                <div className="loan-card" key={loan.id}>
                  <div className="loan-top">
                    <div>
                      <span className="loan-type">
                        {loan.loanType}
                      </span>

                      <h3>{getLoanId(loan)}</h3>
                    </div>

                    <span className="status-badge status-success">
                      {loan.status}
                    </span>
                  </div>

                  <div className="loan-details-grid">
                    <div>
                      <span>Original Amount</span>
                      <strong>
                        {formatMoney(loan.loanAmount)}
                      </strong>
                    </div>

                    <div>
                      <span>Outstanding</span>
                      <strong>
                        {formatMoney(loan.outstandingAmount)}
                      </strong>
                    </div>

                    <div>
                      <span>Monthly EMI</span>
                      <strong>
                        {formatMoney(loan.emi)}
                      </strong>
                    </div>

                    <div>
                      <span>Interest Rate</span>
                      <strong>
                        {getInterest(loan)}
                      </strong>
                    </div>

                    <div>
                      <span>Tenure</span>
                      <strong>
                        {getTenure(loan)}
                      </strong>
                    </div>

                    <div>
                      <span>EMIs Paid</span>
                      <strong>
                        {getPaidEmis(loan)}
                      </strong>
                    </div>
                  </div>

                  <div className="loan-progress">
                    <div className="progress-header">
                      <span>Repayment Progress</span>
                      <strong>
                        {Math.round(progress)}%
                      </strong>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="loan-actions">
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
                      Pay EMI
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Loan Products */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Available Loan Options</h2>
            <p>Choose a loan that suits your needs.</p>
          </div>
        </div>

        <div className="loan-options">
          <div className="loan-option">
            <div className="loan-option-icon">💰</div>
            <h3>Personal Loan</h3>
            <p>
              For personal expenses, travel, emergencies and more.
            </p>
            <strong>Interest from 10.5%</strong>

            <button
              className="btn btn-primary"
              onClick={() => {
                setLoanType("Personal Loan");
                setShowApply(true);
              }}
            >
              Apply Now
            </button>
          </div>

          <div className="loan-option">
            <div className="loan-option-icon">🎓</div>
            <h3>Education Loan</h3>
            <p>
              Financial support for higher education and studies.
            </p>
            <strong>Interest from 8.5%</strong>

            <button
              className="btn btn-primary"
              onClick={() => {
                setLoanType("Education Loan");
                setShowApply(true);
              }}
            >
              Apply Now
            </button>
          </div>

          <div className="loan-option">
            <div className="loan-option-icon">🏠</div>
            <h3>Home Loan</h3>
            <p>
              Flexible financing options for your dream home.
            </p>
            <strong>Interest from 8.25%</strong>

            <button
              className="btn btn-primary"
              onClick={() => {
                setLoanType("Home Loan");
                setShowApply(true);
              }}
            >
              Apply Now
            </button>
          </div>

          <div className="loan-option">
            <div className="loan-option-icon">🚗</div>
            <h3>Vehicle Loan</h3>
            <p>
              Finance your new car, bike or other vehicle.
            </p>
            <strong>Interest from 9.0%</strong>

            <button
              className="btn btn-primary"
              onClick={() => {
                setLoanType("Vehicle Loan");
                setShowApply(true);
              }}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApply && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Apply for Loan</h2>
                <p>
                  Fill in your details to submit a loan request.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowApply(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Loan Type</label>

                <select
                  value={loanType}
                  onChange={(e) =>
                    setLoanType(e.target.value)
                  }
                >
                  <option>Personal Loan</option>
                  <option>Education Loan</option>
                  <option>Home Loan</option>
                  <option>Vehicle Loan</option>
                </select>
              </div>

              <div className="form-group">
                <label>Required Amount</label>

                <input
                  type="number"
                  placeholder="Enter amount"
                  min="10000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Employment Type</label>

                <select required>
                  <option value="">
                    Select employment type
                  </option>
                  <option>Student</option>
                  <option>Salaried</option>
                  <option>Self Employed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Purpose</label>

                <textarea
                  placeholder="Enter the purpose of the loan"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApply(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loans;

