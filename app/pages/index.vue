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
        color="red"
        title="Income"
        :amount="4000"
        :last-amount="3000"
        :loading="true"
      />
      <TrendItem
        color="green"
        title="Income"
        :amount="4000"
        :last-amount="3000"
        :loading="false"
      />
      <TrendItem
        color="red"
        title="Income"
        :amount="4000"
        :last-amount="7000"
        :loading="false"
      />
      <TrendItem
        color="green"
        title="Income"
        :amount="4000"
        :last-amount="3000"
        :loading="false"
      />
    </section>
    <section>
      <TransactionItem />
      <TransactionItem />
      <TransactionItem />
      <TransactionItem />
    </section>
  </div>
</template>

<script setup lang="ts">
import { transactionViewOptionsEnum } from '~/types'

const transactionViewOptions = Object.values(transactionViewOptionsEnum)

const selectedView = ref(transactionViewOptions[0])
</script>
