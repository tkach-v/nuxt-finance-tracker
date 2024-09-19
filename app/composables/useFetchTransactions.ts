import type { Period, Transaction } from '~/types'

export const useFetchTransactions = (period: Ref<Period> | ComputedRef<Period>) => {
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
      acc[date]?.push(transaction)
      return acc
    }, {} as Record<string, Transaction[]>)
  })

  const fetchTransactions = async () => {
    pending.value = true
    try {
      const { data } = await useAsyncData<Transaction[]>(
        `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
        async () => {
          const { data, error } = await supabase
            .from('transactions')
            .select()
            .gte('created_at', period.value.from.toISOString())
            .lte('created_at', period.value.to.toISOString())
            .order('created_at', { ascending: false })

          if (error) return []
          return data
        },
      )
      return data.value || []
    }
    finally {
      pending.value = false
    }
  }

  const refresh = async () => transactions.value = await fetchTransactions()

  watch(period, refresh, { immediate: true })

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
