<template>
  <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold">
    <div class="flex items-center justify-between">
      {{ date }}
    </div>
    <div class="flex items-center justify-end mr-10">
      {{ currency }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/types'

type Props = {
  date: string
  transactions: Transaction[]
}

const props = defineProps<Props>()

const sum = computed(() => {
  return props.transactions.reduce((acc, transaction) => {
    return transaction.type === 'Income' ? acc + transaction.amount : acc - transaction.amount
  }, 0)
})

const { currency } = useCurrency(sum.value)
</script>
