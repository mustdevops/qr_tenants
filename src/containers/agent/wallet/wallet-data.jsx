export const balances = {
  currentBalance: 45000,
  pendingBalance: 3500,
};

export const transactions = [
  {
    id: 1,
    date: "2024-06-01",
    description: "Commission from Coffee House",
    amount: 250,
    status: "paid",
  },
  {
    id: 2,
    date: "2024-05-28",
    description: "Commission from Pizza Palace",
    amount: 180,
    status: "paid",
  },
  {
    id: 3,
    date: "2024-05-25",
    description: "Withdrawal to bank",
    amount: -5000,
    status: "completed",
  },
];

export const autoDeductions = [
  {
    id: 1,
    date: "2024-06-01",
    description: "Platform fee",
    amount: 50,
    frequency: "Monthly",
  },
  {
    id: 2,
    date: "2024-05-01",
    description: "Platform fee",
    amount: 50,
    frequency: "Monthly",
  },
];
