<template>
  <div>
    <div
      class="font-bold"
      :class="[color]"
    >
      {{ title }}
    </div>
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton
        v-if="loading"
        class="h-8 w-full"
      />
      <div v-else>
        {{ currency }}
      </div>
    </div>
    <div>
      <USkeleton
        v-if="loading"
        class="h-6 w-full"
      />
      <div
        v-else
        class="flex space-x-1 items-center text-sm"
      >
        <UIcon
          :name="iconName"
          class="w-6 h-6"
          :class="{ green: trendingUp, red: !trendingUp }"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageChange }}% vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  title: string
  amount: number
  lastAmount: number
  color: string
  loading: boolean
}

const props = defineProps<Props>()

const { amount } = toRefs(props)

const trendingUp = computed(() => props.amount >= props.lastAmount)
const iconName = computed(() => trendingUp.value ? 'i-heroicons:arrow-trending-up' : 'i-heroicons:arrow-trending-down')

const { currency } = useCurrency(amount)

const percentageChange = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) return 0

  const ratio = ((props.amount - props.lastAmount) / props.lastAmount) * 100
  return ratio.toFixed(1)
})
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
