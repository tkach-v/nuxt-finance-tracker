import type { Transaction } from '~/types'

export const useFetchTransactions = () => {
  const supabase = useSupabaseClient()

  const transactions = ref<Transaction[]>([])
  const pending = ref(false)

  const income = computed(() => transactions.value.filter(transaction => transaction.type === 'Income').reduce((acc, transaction) => acc + transaction.amount, 0))
  const expenses = computed(() => transactions.value.filter(transaction => transaction.type === 'Expense').reduce((acc, transaction) => acc + transaction.amount, 0))

  const transactionsGroupedByDate = computed(() => {
    return transactions.value.reduce((acc, transaction) => {
      const date = new Date(transaction.created_at).toISOString().split('T')[0] as string
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(transaction)
      return acc
    }, {} as Record<string, Transaction[]>)
  })

  const fetchTransactions = async () => {
    pending.value = true
    try {
      const { data } = await useAsyncData<Transaction[]>('transactions', async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select()
          .order('created_at', { ascending: false })

        if (error) return []
        return data
      })

      return data.value || []
    }
    finally {
      pending.value = false
    }
  }

  const refresh = async () => transactions.value = await fetchTransactions()

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
    },
    income,
    expenses,
    refresh,
    pending,
  }
}
