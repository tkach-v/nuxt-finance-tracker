<template>
  <UCard v-if="!success">
    <template #header>
      Sign-in to Finance Tracker
    </template>
    <form @submit="onSubmit">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        help="You will receive a confirmation email"
        required
      >
        <UInput
          v-model="email"
          type="email"
          placeholder="Email"
          required
        />
      </UFormGroup>
      <UButton
        type="submit"
        variant="solid"
        color="black"
        :loading="pending"
        :disabled="pending"
        @click="onSubmit"
      >
        Sign-in
      </UButton>
    </form>
  </UCard>
  <UCard v-else>
    <template #header>
      Email has been sent
    </template>
    <div class="text-center">
      <p class="mb-4">
        We have sent an email to <strong>{{ email }}</strong> with a link to sign-in.
      </p>
      <p>
        <strong>Important: </strong> the link will expire in 5 minutes.
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { useRedirectIfAuthenticated } from '~/composables/useRedirectIfAuthenticated'

const toast = useToast()
const supabase = useSupabaseClient()
useRedirectIfAuthenticated()

const success = ref(false)
const email = ref('')
const pending = ref(false)

const onSubmit = async () => {
  pending.value = true

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm',
      },
    })

    if (error) {
      toast.add({
        title: 'Authentication error',
        icon: 'i-heroicons:exclamation-circle',
        color: 'red',
        description: error.message,
      })
    }
    else {
      success.value = true
    }
  }
  finally {
    pending.value = false
  }
}
</script>

<style scoped>

</style>
