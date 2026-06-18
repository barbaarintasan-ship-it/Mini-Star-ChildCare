import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { Message, MessageForm } from '@/types'
import toast from 'react-hot-toast'

const K = 'messages'

export function useMessages(withUserId?: string) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, user?.id, withUserId],
    queryFn: () => api.get<Message[]>(`/messages${withUserId ? `?with=${withUserId}` : ''}`),
    enabled: !!user,
    refetchInterval: 5000,
  })
}

export function useUnreadCount() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, 'unread', user?.id],
    queryFn: async () => {
      const { count } = await api.get<{ count: number }>('/messages/unread-count')
      return count
    },
    enabled: !!user,
    refetchInterval: 10000,
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: MessageForm) => api.post<Message>('/messages', form),
    onSuccess: () => qc.invalidateQueries({ queryKey: [K] }),
    onError: () => toast.error('Failed to send message.'),
  })
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (fromUserId: string) =>
      api.patch('/messages/mark-read', { from_user_id: fromUserId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [K] }),
  })
}

export function useConversations() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, 'conversations', user?.id],
    queryFn: async () => {
      const rows = await api.get<Array<{
        from_id: string
        to_id: string
        from: { id: string; name: string; role: string; avatar_url?: string | null }
        to: { id: string; name: string; role: string; avatar_url?: string | null }
      }>>('/messages/conversations')

      const seen = new Set<string>()
      const conversations: Array<{
        partner: { id: string; name: string; role: string; avatar_url?: string | null }
        unread: number
      }> = []

      for (const msg of rows) {
        const partner = msg.from_id === user!.id ? msg.to : msg.from
        if (partner && !seen.has(partner.id)) {
          seen.add(partner.id)
          conversations.push({ partner, unread: 0 })
        }
      }
      return conversations
    },
    enabled: !!user,
    refetchInterval: 10000,
  })
}
