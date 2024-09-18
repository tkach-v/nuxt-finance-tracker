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
        :loading="pending"
      />
      <TrendItem
        color="red"
        title="Expenses"
        :amount="expenses"
        :last-amount="0"
        :loading="pending"
      />
      <TrendItem
        color="red"
        title="Income"
        :amount="4000"
        :last-amount="0"
        :loading="pending"
      />
      <TrendItem
        color="green"
        title="Income"
        :amount="4000"
        :last-amount="0"
        :loading="pending"
      />
    </section>
    <section class="flex justify-between mb-10">
      <h2 class="font-bold text-xl">
        Transactions ({{ transactions.all.value.length }})
      </h2>
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isModalOpened = true"
      />
      <TransactionModal
        v-model="isModalOpened"
        @saved="refresh"
      />
    </section>
    <section v-if="!pending">
      <div
        v-for="(transactionsOnDay, date) in transactions.grouped.byDate.value"
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
          @deleted="refresh"
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
import { TransactionViewOption } from '~/types'

const transactionViewOptions = Object.values(TransactionViewOption)

const selectedView = ref(transactionViewOptions[0])
const isModalOpened = ref(false)

const {
  transactions,
  income,
  expenses,
  pending,
  refresh,
} = useFetchTransactions()

await refresh()
</script>
