import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { Notification } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'notifications'

export function useNotifications() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return (data ?? []) as Notification[]
    },
    enabled: !!user,
    refetchInterval: 15000,
  })
}

export function useUnreadNotificationCount() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, 'unread-count', user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('read', false)
      if (error) throw error
      return count ?? 0
    },
    enabled: !!user,
    refetchInterval: 15000,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user!.id)
        .eq('read', false)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('All notifications marked as read.')
    },
  })
}

/** Send a notification to a user (admin/teacher only) */
export function useSendNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      userId,
      type,
      title,
      message,
      data,
    }: {
      userId: string
      type: string
      title: string
      message?: string
      data?: Record<string, unknown>
    }) => {
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        type,
        title,
        message,
        data,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}
