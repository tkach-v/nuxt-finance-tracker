export enum transactionViewOptionsEnum {
  YEARLY = 'Yearly',
  MONTHLY = 'Monthly',
  WEEKLY = 'Weekly',
  DAILY = 'Daily',
}

export type Transaction = {
  id: number
  created_at: string
  amount: number
  type: string
  description: string
  category: string
}
