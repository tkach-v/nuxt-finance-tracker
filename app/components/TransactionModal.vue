<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        Add Transaction
      </template>
      <UForm
        :ref="form"
        :state="state"
        :schema="schema"
        @submit="onSubmit"
      >
        <UFormGroup
          label="Type"
          name="type"
          class="mb-4"
          :required="true"
        >
          <USelect
            v-model="state.type"
            :options="TransactionTypes"
            placeholder="Select the transaction type"
          />
        </UFormGroup>
        <UFormGroup
          label="Amount"
          :required="true"
          name="amount"
          class="mb-4"
        >
          <UInput
            v-model.number="state.amount"
            type="number"
            placeholder="Amount"
          />
        </UFormGroup>
        <UFormGroup
          label="Transaction date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            v-model="state.created_at"
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
          />
        </UFormGroup>
        <UFormGroup
          label="Description"
          name="description"
          class="mb-4"
        >
          <UInput
            v-model="state.description"
            placeholder="Description"
          />
        </UFormGroup>
        <UFormGroup
          v-if="state.type === TransactionType.EXPENSE"
          label="Category"
          name="category"
          class="mb-4"
          :required="true"
        >
          <USelect
            v-model="state.category"
            :options="TransactionCategories"
            placeholder="Select the category"
          />
        </UFormGroup>
        <UButton
          type="submit"
          color="black"
          variant="solid"
          label="Save"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { TransactionCategory, TransactionType } from '~/types'
import type { FormSubmitEvent } from '#ui/types'
import type { UForm } from '#components'

type Props = {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('Amount needs to be more than 0'),
})

const incomeSchema = z.object({
  type: z.literal('Income'),
})
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.nativeEnum(TransactionCategory),
})
const investmentSchema = z.object({
  type: z.literal('Investment'),
})
const savingSchema = z.object({
  type: z.literal('Saving'),
})

const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
  defaultSchema,
)

type Schema = z.output<typeof schema>

const TransactionCategories = Object.values(TransactionCategory)
const TransactionTypes = Object.values(TransactionType)

type TransactionState = {
  type?: TransactionType
  amount: number
  created_at?: string
  description?: string
  category?: TransactionCategory
}

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
}

const state = ref<TransactionState>({ ...initialState })
const form = ref<typeof UForm>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    if (!value) resetForm()
    emit('update:modelValue', value)
  },
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (form.value) return
  console.log(event)
}

const resetForm = () => {
  state.value = { ...initialState }
  form.value?.clear()
}
</script>
