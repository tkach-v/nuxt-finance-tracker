import { startOfYear, endOfYear, sub, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'
import { TransactionViewOption } from '~/types'

export const useSelectedTimePeriod = (period: Ref<TransactionViewOption> | ComputedRef<TransactionViewOption>) => {
  const current = computed(
    () => {
      switch (period.value) {
        case TransactionViewOption.YEARLY:
          return {
            from: startOfYear(new Date()),
            to: endOfYear(new Date()),
          }
        case TransactionViewOption.MONTHLY:
          return {
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date()),
          }
        case TransactionViewOption.WEEKLY:
          return {
            from: startOfWeek(new Date()),
            to: endOfWeek(new Date()),
          }
        case TransactionViewOption.DAILY:
          return {
            from: startOfDay(new Date()),
            to: endOfDay(new Date()),
          }
      }
    },
  )

  const previous = computed(
    () => {
      switch (period.value) {
        case TransactionViewOption.YEARLY:
          return {
            from: startOfYear(sub(new Date(), { years: 1 })),
            to: endOfYear(sub(new Date(), { years: 1 })),
          }
        case TransactionViewOption.MONTHLY:
          return {
            from: startOfMonth(sub(new Date(), { months: 1 })),
            to: endOfMonth(sub(new Date(), { months: 1 })),
          }
        case TransactionViewOption.WEEKLY:
          return {
            from: startOfWeek(sub(new Date(), { weeks: 1 })),
            to: endOfWeek(sub(new Date(), { weeks: 1 })),
          }
        case TransactionViewOption.DAILY:
          return {
            from: startOfDay(sub(new Date(), { days: 1 })),
            to: endOfDay(sub(new Date(), { days: 1 })),
          }
      }
    },
  )

  return { current, previous }
}
