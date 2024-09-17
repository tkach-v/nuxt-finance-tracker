<template>
  <div>
    <section class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-extrabold">
        Summary
      </h1>
      <div>
        <USelectMenu
          v-model="selectedView"
          :options="transactionViewOptions"
        />
      </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
      <TrendItem
        color="green"
        title="Income"
        :amount="income"
        :last-amount="0"
        :loading="isLoading"
      />
      <TrendItem
        color="red"
        title="Expenses"
        :amount="expenses"
        :last-amount="0"
        :loading="isLoading"
      />
      <TrendItem
        color="red"
        title="Income"
        :amount="4000"
        :last-amount="0"
        :loading="isLoading"
      />
      <TrendItem
        color="green"
        title="Income"
        :amount="4000"
        :last-amount="0"
        :loading="isLoading"
      />
    </section>
    <section class="flex justify-between mb-10">
      <h2 class="font-bold text-xl">
        Transactions ({{ transactions.length }})
      </h2>
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isModalOpened = true"
      />
      <TransactionModal v-model="isModalOpened" />
    </section>
    <section v-if="!isLoading">
      <div
        v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
        :key="date"
      >
        <DailyTransactionSummary
          :date="date"
          :transactions="transactionsOnDay"
        />
        <TransactionItem
          v-for="transaction in transactionsOnDay"
          :key="transaction.id"
          :transaction="transaction"
          @deleted="refetchTransactions"
        />
      </div>
    </section>
    <section v-else>
      <USkeleton
        v-for="i in 4"
        :key="i"
        class="h-8 w-full mb-2"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { type Transaction, TransactionViewOption } from '~/types'

const transactionViewOptions = Object.values(TransactionViewOption)
const supabase = useSupabaseClient()

const selectedView = ref(transactionViewOptions[0])
const transactions = ref<Transaction[]>([])
const isLoading = ref(false)
const isModalOpened = ref(false)

const income = computed(() => transactions.value.filter(transaction => transaction.type === 'Income').reduce((acc, transaction) => acc + transaction.amount, 0))
const expenses = computed(() => transactions.value.filter(transaction => transaction.type === 'Expense').reduce((acc, transaction) => acc + transaction.amount, 0))

const fetchTransactions = async () => {
  isLoading.value = true
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
    isLoading.value = false
  }
}

const refetchTransactions = async () => transactions.value = await fetchTransactions()

await refetchTransactions()

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
</script>
