<template>
  <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-900 dark:text-gray-100">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <UIcon
          :name="iconName"
          :class="[iconColor]"
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
      </UDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types'
import type { Transaction } from '~/types'

type Props = {
  transaction: Transaction
}

const props = defineProps<Props>()

const emit = defineEmits(['deleted'])
const { currency } = useCurrency(props.transaction.amount)

const isIncome = computed(() => props.transaction.type === 'Income')
const iconName = computed(() => isIncome.value ? 'i-heroicons:arrow-up-right' : 'i-heroicons:arrow-down-left')
const iconColor = computed(() => isIncome.value ? 'text-green-600' : 'text-red-600')

const isLoading = ref(false)
const toast = useToast()
const supabase = useSupabaseClient()

const deleteTransaction = async () => {
  isLoading.value = true

  try {
    await supabase.from('transactions')
      .delete()
      .eq('id', props.transaction.id)
    toast.add({
      title: 'Transaction deleted',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
    emit('deleted', props.transaction.id)
  }
  catch (error) {
    toast.add({
      title: `Error: ${error}`,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
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
      click: () => console.log('Edit'),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction,
    },
  ],
]
</script>
