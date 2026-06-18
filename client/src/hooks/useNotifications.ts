import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { Notification } from '@/types'
import toast from 'react-hot-toast'

const K = 'notifications'

export function useNotifications() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, user?.id],
    queryFn: () => api.get<Notification[]>('/notifications'),
    enabled: !!user,
    refetchInterval: 15000,
  })
}

export function useUnreadNotificationCount() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, 'unread-count', user?.id],
    queryFn: async () => {
      const { count } = await api.get<{ count: number }>('/notifications/unread-count')
      return count
    },
    enabled: !!user,
    refetchInterval: 15000,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: [K, user?.id] }),
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.patch('/notifications/read-all', {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('All notifications marked as read.') },
  })
}

export function useSendNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { userId: string; type: string; title: string; message?: string; data?: Record<string, unknown> }) =>
      api.post('/notifications', {
        user_id: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        data: payload.data,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [K] }),
  })
}
