<template>
  <div class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-900 dark:text-gray-100">
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon
          :name="iconName"
          :class="[iconColor, 'flex-shrink-0']"
        />
        <div>{{ transaction.description }}</div>
      </div>
      <UBadge
        v-if="transaction.category"
        color="white"
      >
        {{ transaction.category }}
      </UBadge>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <UDropdown
        :items="items"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          color="white"
          variant="ghost"
          trailing-icon="i-heroicons-ellipsis-horizontal"
          :loading="isLoading"
        />
        <TransactionModal
          v-model="isOpen"
          :transaction="transaction"
          @saved="emit('edited')"
        />
      </UDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types'
import type { Transaction } from '~/types'
import { useAppToast } from '~/composables/useAppToast'

type Props = {
  transaction: Transaction
}

const props = defineProps<Props>()

const emit = defineEmits(['deleted', 'edited'])
const { currency } = useCurrency(props.transaction.amount)

const isIncome = computed(() => props.transaction.type === 'Income')
const iconName = computed(() => isIncome.value ? 'i-heroicons:arrow-up-right' : 'i-heroicons:arrow-down-left')
const iconColor = computed(() => isIncome.value ? 'text-green-600' : 'text-red-600')

const isOpen = ref(false)
const isLoading = ref(false)
const { toastSuccess, toastError } = useAppToast()
const supabase = useSupabaseClient()

const deleteTransaction = async () => {
  isLoading.value = true

  try {
    await supabase.from('transactions')
      .delete()
      .eq('id', props.transaction.id)
    toastSuccess({ title: 'Transaction deleted' })
    emit('deleted', props.transaction.id)
  }
  catch (error) {
    toastError({ title: `Error: ${error}` })
  }
  finally {
    isLoading.value = false
  }
}

const items: DropdownItem[][] = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => isOpen.value = true,
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction,
    },
  ],
]
</script>
