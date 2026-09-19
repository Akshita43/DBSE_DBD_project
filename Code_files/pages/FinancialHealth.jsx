
import React, { useEffect, useState } from "react";

function FinancialHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialHealth();
  }, []);

  const fetchFinancialHealth = async () => {
    try {
      const savedUser = localStorage.getItem("bankingUser");

      if (!savedUser) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:8080/api/financial-health/${user.customerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch financial health");
      }

      const data = await response.json();

      setHealth(data);
    } catch (error) {
      console.error("Financial health fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const score = health?.overallScore || 0;

  const getScoreText = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  const categories = health
    ? [
        {
          name: "Savings",
          score: health.savingsScore,
          icon: "💰",
          description: "Your savings habits are strong.",
        },
        {
          name: "Spending",
          score: health.spendingScore,
          icon: "💳",
          description: "Your spending is within a healthy range.",
        },
        {
          name: "Investments",
          score: health.investmentScore,
          icon: "📈",
          description: "Your investment portfolio is well balanced.",
        },
        {
          name: "Debt Management",
          score: health.debtScore,
          icon: "🏦",
          description: "Your current debt level is manageable.",
        },
        {
          name: "Emergency Fund",
          score: health.emergencyFundScore,
          icon: "🛡️",
          description: "You have a good emergency fund position.",
        },
      ]
    : [];

  const recommendations = [
    {
      icon: "💰",
      title: "Increase Monthly Savings",
      text: "Try to save a little more from your monthly income.",
      tag: "Savings",
    },
    {
      icon: "📊",
      title: "Diversify Investments",
      text: "Consider maintaining a balanced mix of investment options.",
      tag: "Investments",
    },
    {
      icon: "🛡️",
      title: "Maintain Emergency Fund",
      text: "Continue building your emergency savings for unexpected expenses.",
      tag: "Security",
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Financial Health</h1>
          <p>
            Understand your financial position and improve your habits.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <p>Loading financial health...</p>
        </div>
      ) : (
        <>
          {/* Main Score */}
          <div className="financial-score-card">
            <div className="score-circle">
              <div className="score-number">{score}</div>
              <div className="score-label">/ 100</div>
            </div>

            <div className="score-content">
              <span className="score-small-title">
                Your Financial Health Score
              </span>

              <h2>{getScoreText()}</h2>

              <p>
                Your financial health is in a strong position. Keep
                maintaining good savings and spending habits.
              </p>

              <div className="score-status">
                <span>Last updated: Today</span>
                <span>↑ 4 points from last month</span>
              </div>
            </div>
          </div>

          {/* Health Categories */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Financial Health Breakdown</h2>
                <p>
                  See how different areas contribute to your overall
                  score.
                </p>
              </div>
            </div>

            <div className="health-category-list">
              {categories.map((category) => (
                <div
                  className="health-category"
                  key={category.name}
                >
                  <div className="health-category-icon">
                    {category.icon}
                  </div>

                  <div className="health-category-content">
                    <div className="health-category-header">
                      <div>
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                      </div>

                      <strong>
                        {category.score}/100
                      </strong>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${category.score}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Personalized Recommendations</h2>
                <p>
                  Simple steps to improve your financial health.
                </p>
              </div>
            </div>

            <div className="recommendation-list">
              {recommendations.map((item) => (
                <div
                  className="recommendation-card"
                  key={item.title}
                >
                  <div className="recommendation-icon">
                    {item.icon}
                  </div>

                  <div className="recommendation-content">
                    <div className="recommendation-title">
                      <h3>{item.title}</h3>
                      <span>{item.tag}</span>
                    </div>

                    <p>{item.text}</p>
                  </div>

                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      alert(
                        `Opening recommendation: ${item.title}`
                      )
                    }
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Tips */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Financial Tips</h2>
                <p>
                  Small habits can make a big difference.
                </p>
              </div>
            </div>

            <div className="tips-grid">
              <div className="tip-card">
                <span>01</span>
                <h3>Follow a Budget</h3>
                <p>
                  Keep track of your income and expenses to avoid
                  unnecessary spending.
                </p>
              </div>

              <div className="tip-card">
                <span>02</span>
                <h3>Build Savings</h3>
                <p>
                  Set aside a portion of your income regularly for
                  future needs.
                </p>
              </div>

              <div className="tip-card">
                <span>03</span>
                <h3>Invest Wisely</h3>
                <p>
                  Choose investments based on your goals and risk
                  tolerance.
                </p>
              </div>

              <div className="tip-card">
                <span>04</span>
                <h3>Manage Debt</h3>
                <p>
                  Make timely payments and avoid taking unnecessary
                  debt.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="info-banner">
            <div className="info-banner-icon">ℹ️</div>

            <div>
              <strong>Financial Health Information</strong>
              <p>
                This score is a simulated feature for the banking
                application project and should not be considered
                professional financial advice.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FinancialHealth;

