export const useCurrency = (amount: number | Ref<number> | ComputedRef<number>) => {
  const currency = computed(() => {
    return new Intl.NumberFormat('en-In', {
      style: 'currency',
      currency: 'USD',
    }).format(isRef(amount) ? amount.value : amount)
  })

  return { currency }
}
