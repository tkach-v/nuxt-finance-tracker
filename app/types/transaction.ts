export enum TransactionViewOption {
  YEARLY = 'Yearly',
  MONTHLY = 'Monthly',
  WEEKLY = 'Weekly',
  DAILY = 'Daily',
}

export enum TransactionCategory {
  FOOD = 'Food',
  HOUSING = 'Housing',
  CAR = 'Car',
  ENTERTAINMENT = 'Entertainment',
}

export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
  SAVING = 'Saving',
  INVESTMENT = 'Investment',
}

export type Transaction = {
  id: number
  created_at: string
  amount: number
  type: string
  description: string
  category: string
}

export type Period = {
  to: Date
  from: Date
}
