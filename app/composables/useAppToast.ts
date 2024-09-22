import type { Notification } from '#ui/types/notification'

export const useAppToast = () => {
  const toast = useToast()

  return {
    toastSuccess: ({ title, description }: Partial<Notification>) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-check-circle',
        color: 'green',
      })
    },
    toastError: ({ title, description }: Partial<Notification>) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      })
    },
  }
}
