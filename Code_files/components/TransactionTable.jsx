import React from "react";

function TransactionTable({
  transactions = [],
  limit,
  showViewAll = false,
}) {
  const displayedTransactions = limit
    ? transactions.slice(0, limit)
    : transactions;

  const formatCurrency = (amount) => {
    const value = Number(amount) || 0;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const transactionDate = new Date(date);

    if (Number.isNaN(transactionDate.getTime())) {
      return date;
    }

    return transactionDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (String(status).toLowerCase()) {
      case "completed":
      case "success":
      case "successful":
        return "status-success";

      case "pending":
        return "status-pending";

      case "failed":
        return "status-failed";

      default:
        return "";
    }
  };

  const getTransactionType = (transaction) => {
    if (transaction.type) {
      return transaction.type;
    }

    if (transaction.amount < 0) {
      return "Debit";
    }

    return "Credit";
  };

  if (displayedTransactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">☷</div>
        <h3>No transactions found</h3>
        <p>Your recent transactions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="transaction-table-wrapper">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Account</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {displayedTransactions.map((transaction, index) => {
            const amount = Number(transaction.amount) || 0;
            const type = getTransactionType(transaction);

            return (
              <tr
                key={
                  transaction.id ||
                  transaction.transactionId ||
                  index
                }
              >
                <td>
                  {formatDate(
                    transaction.date ||
                      transaction.createdAt
                  )}
                </td>

                <td>
                  <div className="transaction-description">
                    <div className="transaction-icon">
                      {amount < 0 ? "↓" : "↑"}
                    </div>

                    <div>
                      <strong>
                        {transaction.description ||
                          transaction.title ||
                          "Transaction"}
                      </strong>

                      {transaction.reference && (
                        <span>
                          Ref: {transaction.reference}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    className={
                      amount < 0
                        ? "transaction-debit"
                        : "transaction-credit"
                    }
                  >
                    {type}
                  </span>
                </td>

                <td>
                  {transaction.account ||
                    transaction.accountNumber ||
                    "-"}
                </td>

                <td>
                  <strong
                    className={
                      amount < 0
                        ? "amount-debit"
                        : "amount-credit"
                    }
                  >
                    {amount < 0 ? "-" : "+"}
                    {formatCurrency(amount)}
                  </strong>
                </td>

                <td>
                  <span
                    className={`status-badge ${getStatusClass(
                      transaction.status
                    )}`}
                  >
                    {transaction.status || "Completed"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showViewAll && transactions.length > displayedTransactions.length && (
        <div className="table-footer">
          <span>
            Showing {displayedTransactions.length} of{" "}
            {transactions.length} transactions
          </span>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;