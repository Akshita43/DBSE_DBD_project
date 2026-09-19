import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const BankingContext = createContext();

const defaultAccounts = [
  {
    id: 1,
    accountNumber: "XXXX XXXX 4521",
    type: "Savings",
    balance: 125450.75,
    ifscCode: "ABBL0004521",
    branch: "Kukatpally Branch",
    status: "Active",
  },
  {
    id: 2,
    accountNumber: "XXXX XXXX 7832",
    type: "Current",
    balance: 45890.5,
    ifscCode: "ABBL0007832",
    branch: "Kukatpally Branch",
    status: "Active",
  },
];

const defaultTransactions = [
  {
    id: "TXN001",
    date: "2026-09-11",
    description: "Amazon Purchase",
    category: "Shopping",
    type: "Debit",
    accountNumber: "XXXX XXXX 4521",
    amount: -2499,
    status: "Completed",
    reference: "TXN10001",
  },
  {
    id: "TXN002",
    date: "2026-09-10",
    description: "Salary Credit",
    category: "Salary",
    type: "Credit",
    accountNumber: "XXXX XXXX 4521",
    amount: 45000,
    status: "Completed",
    reference: "TXN10002",
  },
  {
    id: "TXN003",
    date: "2026-09-09",
    description: "Electricity Bill",
    category: "Bills",
    type: "Debit",
    accountNumber: "XXXX XXXX 4521",
    amount: -1850,
    status: "Completed",
    reference: "TXN10003",
  },
  {
    id: "TXN004",
    date: "2026-09-08",
    description: "UPI Transfer Received",
    category: "Transfer",
    type: "Credit",
    accountNumber: "XXXX XXXX 7832",
    amount: 5000,
    status: "Completed",
    reference: "TXN10004",
  },
];

const defaultNotifications = [
  {
    id: 1,
    title: "Welcome to AB Bank",
    message: "Your banking account is ready.",
    type: "info",
    icon: "🏦",
    read: false,
  },
  {
    id: 2,
    title: "Security Alert",
    message: "Your account security settings are active.",
    type: "warning",
    icon: "🔒",
    read: false,
  },
  {
    id: 3,
    title: "Salary Credited",
    message: "Your salary has been credited successfully.",
    type: "success",
    icon: "💰",
    read: false,
  },
  {
    id: 4,
    title: "Bill Payment",
    message: "Your electricity bill payment was completed.",
    type: "success",
    icon: "✓",
    read: true,
  },
  {
    id: 5,
    title: "New Features",
    message: "Explore loans and investment options.",
    type: "info",
    icon: "✨",
    read: false,
  },
];

const defaultUser = {
  customerId: "AB123456",
  name: "Anand Akshita",
  email: "anand.akshita@abbank.com",
  phone: "9876543210",
};

export function BankingProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("bankingUser");

    return savedUser
      ? JSON.parse(savedUser)
      : defaultUser;
  });

  const [accounts, setAccounts] = useState(() => {
    const savedAccounts =
      localStorage.getItem("bankingAccounts");

    return savedAccounts
      ? JSON.parse(savedAccounts)
      : defaultAccounts;
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions =
      localStorage.getItem("bankingTransactions");

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : defaultTransactions;
  });

  const [notifications, setNotifications] = useState(() => {
    const savedNotifications =
      localStorage.getItem("bankingNotifications");

    return savedNotifications
      ? JSON.parse(savedNotifications)
      : defaultNotifications;
  });

  /* Save user */

  useEffect(() => {
    localStorage.setItem(
      "bankingUser",
      JSON.stringify(user)
    );
  }, [user]);

  /* Save accounts */

  useEffect(() => {
    localStorage.setItem(
      "bankingAccounts",
      JSON.stringify(accounts)
    );
  }, [accounts]);

  /* Save transactions */

  useEffect(() => {
    localStorage.setItem(
      "bankingTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  /* Save notifications */

  useEffect(() => {
    localStorage.setItem(
      "bankingNotifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  /* Load accounts from Spring Boot backend */

  useEffect(() => {
    const savedUser =
      localStorage.getItem("bankingUser");

    if (!savedUser) return;

    const loggedInUser = JSON.parse(savedUser);

    if (!loggedInUser?.customerId) return;

    fetch(
      `http://localhost:8080/api/accounts/${loggedInUser.customerId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch accounts"
          );
        }

        return response.json();
      })
      .then((data) => {
        setAccounts(data);
      })
      .catch((error) => {
        console.error(
          "Account loading error:",
          error
        );
      });
  }, []);

  /* Get total balance */

  const getTotalBalance = () => {
    return accounts.reduce(
      (total, account) =>
        total + Number(account.balance || 0),
      0
    );
  };

  /* Get account */

  const getAccount = (accountNumber) => {
    return accounts.find(
      (account) =>
        account.accountNumber === accountNumber
    );
  };

  /* Add transaction */

  const addTransaction = ({
    description,
    type,
    accountNumber,
    amount,
    status = "Completed",
    category = "General",
  }) => {
    const now = Date.now();

    const transaction = {
      id: now,
      date: new Date()
        .toISOString()
        .split("T")[0],
      description,
      category,
      type,
      accountNumber,
      amount:
        type === "Debit"
          ? -Math.abs(Number(amount))
          : Math.abs(Number(amount)),
      status,
      reference: `TXN${now}`,
    };

    setTransactions((previous) => [
      transaction,
      ...previous,
    ]);

    return transaction;
  };

  /* Add notification */

  const addNotification = ({
    title,
    message,
    type = "info",
    icon = "ℹ️",
  }) => {
    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      icon,
      read: false,
    };

    setNotifications((previous) => [
      notification,
      ...previous,
    ]);

    return notification;
  };

  /* Deposit */

  const depositMoney = async (
    accountNumber,
    amount,
    description = "Cash Deposit"
  ) => {
    const value = Number(amount);

    if (!value || value <= 0) {
      return {
        success: false,
        message: "Enter a valid amount.",
      };
    }

    const savedUser =
      localStorage.getItem("bankingUser");

    if (!savedUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const loggedInUser = JSON.parse(savedUser);

    if (!loggedInUser?.customerId) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts/deposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId:
              loggedInUser.customerId,
            accountNumber,
            amount: value,
            description,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        return {
          success: false,
          message: data || "Deposit failed.",
        };
      }

      setAccounts((previous) =>
        previous.map((account) =>
          account.accountNumber === accountNumber
            ? {
                ...account,
                balance:
                  Number(account.balance) +
                  value,
              }
            : account
        )
      );

      addTransaction({
        accountNumber,
        amount: value,
        type: "Credit",
        description,
        category: "Deposit",
        status: "Completed",
      });

      addNotification({
        title: "Deposit Successful",
        message: `₹${value.toLocaleString(
          "en-IN"
        )} deposited into ${accountNumber}.`,
        type: "success",
        icon: "↓",
      });

      return {
        success: true,
        message: "Money deposited successfully.",
      };
    } catch (error) {
      console.error(
        "Deposit error:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to the banking server.",
      };
    }
  };

  /* Withdraw */

  const withdrawMoney = async (
    accountNumber,
    amount,
    description = "Cash Withdrawal"
  ) => {
    const value = Number(amount);

    if (!value || value <= 0) {
      return {
        success: false,
        message: "Enter a valid amount.",
      };
    }

    const savedUser =
      localStorage.getItem("bankingUser");

    if (!savedUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const loggedInUser = JSON.parse(savedUser);

    if (!loggedInUser?.customerId) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const account = getAccount(accountNumber);

    if (!account) {
      return {
        success: false,
        message: "Account not found.",
      };
    }

    if (Number(account.balance) < value) {
      return {
        success: false,
        message: "Insufficient balance.",
      };
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId:
              loggedInUser.customerId,
            accountNumber,
            amount: value,
            description,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        return {
          success: false,
          message:
            data || "Withdrawal failed.",
        };
      }

      setAccounts((previous) =>
        previous.map((item) =>
          item.accountNumber === accountNumber
            ? {
                ...item,
                balance:
                  Number(item.balance) -
                  value,
              }
            : item
        )
      );

      addTransaction({
        accountNumber,
        amount: value,
        type: "Debit",
        description,
        category: "Withdrawal",
        status: "Completed",
      });

      addNotification({
        title: "Withdrawal Successful",
        message: `₹${value.toLocaleString(
          "en-IN"
        )} withdrawn from ${accountNumber}.`,
        type: "success",
        icon: "↑",
      });

      return {
        success: true,
        message:
          "Money withdrawn successfully.",
      };
    } catch (error) {
      console.error(
        "Withdrawal error:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to the banking server.",
      };
    }
  };

  /* Transfer */

  const transferMoney = async (
    fromAccountNumber,
    toAccountNumber,
    amount,
    description = "Fund Transfer"
  ) => {
    const value = Number(amount);

    if (!value || value <= 0) {
      return {
        success: false,
        message: "Enter a valid amount.",
      };
    }

    if (
      !fromAccountNumber ||
      !toAccountNumber
    ) {
      return {
        success: false,
        message: "Select both accounts.",
      };
    }

    if (
      fromAccountNumber === toAccountNumber
    ) {
      return {
        success: false,
        message:
          "Source and destination accounts must be different.",
      };
    }

    const sourceAccount =
      getAccount(fromAccountNumber);

    if (!sourceAccount) {
      return {
        success: false,
        message: "Source account not found.",
      };
    }

    if (
      Number(sourceAccount.balance) < value
    ) {
      return {
        success: false,
        message: "Insufficient balance.",
      };
    }

    const savedUser =
      localStorage.getItem("bankingUser");

    if (!savedUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const loggedInUser = JSON.parse(savedUser);

    if (!loggedInUser?.customerId) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/accounts/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId:
              loggedInUser.customerId,
            fromAccountNumber,
            toAccountNumber,
            amount: value,
            description,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        return {
          success: false,
          message: data || "Transfer failed.",
        };
      }

      /* Update React balances */

      setAccounts((previous) =>
        previous.map((account) => {
          if (
            account.accountNumber ===
            fromAccountNumber
          ) {
            return {
              ...account,
              balance:
                Number(account.balance) -
                value,
            };
          }

          if (
            account.accountNumber ===
            toAccountNumber
          ) {
            return {
              ...account,
              balance:
                Number(account.balance) +
                value,
            };
          }

          return account;
        })
      );

      /* Add transaction */

      addTransaction({
        accountNumber: fromAccountNumber,
        amount: value,
        type: "Debit",
        description,
        category: "Transfer",
        status: "Completed",
      });

      /* Add notification */

      addNotification({
        title: "Transfer Successful",
        message: `₹${value.toLocaleString(
          "en-IN"
        )} transferred successfully.`,
        type: "success",
        icon: "↗",
      });

      return {
        success: true,
        message:
          "Money transferred successfully.",
      };
    } catch (error) {
      console.error(
        "Transfer error:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to the banking server.",
      };
    }
  };

  /* Update user */

  const updateUser = (updatedUser) => {
    setUser((previous) => ({
      ...previous,
      ...updatedUser,
    }));
  };

  /* Reset banking data */

  const resetBankingData = () => {
    setUser(defaultUser);
    setAccounts(defaultAccounts);
    setTransactions(defaultTransactions);
    setNotifications(defaultNotifications);

    localStorage.setItem(
      "bankingUser",
      JSON.stringify(defaultUser)
    );

    localStorage.setItem(
      "bankingAccounts",
      JSON.stringify(defaultAccounts)
    );

    localStorage.setItem(
      "bankingTransactions",
      JSON.stringify(defaultTransactions)
    );

    localStorage.setItem(
      "bankingNotifications",
      JSON.stringify(
        defaultNotifications
      )
    );
  };

  return (
    <BankingContext.Provider
      value={{
        user,
        setUser,

        accounts,
        setAccounts,

        transactions,
        setTransactions,

        notifications,
        setNotifications,

        getTotalBalance,
        getAccount,

        addTransaction,
        addNotification,

        depositMoney,
        withdrawMoney,
        transferMoney,

        updateUser,
        resetBankingData,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}

export function useBanking() {
  return useContext(BankingContext);
}

export default BankingContext;