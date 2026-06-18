import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { Message, MessageForm } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'messages'

export function useMessages(withUserId?: string) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, user?.id, withUserId],
    queryFn: async () => {
      let query = supabase
        .from('messages')
        .select(`
          *,
          from:users!messages_from_id_fkey(id,name,role,avatar_url),
          to:users!messages_to_id_fkey(id,name,role,avatar_url),
          child:children(id,name)
        `)
        .order('created_at', { ascending: true })

      if (withUserId) {
        query = query.or(
          `and(from_id.eq.${user!.id},to_id.eq.${withUserId}),and(from_id.eq.${withUserId},to_id.eq.${user!.id})`
        )
      } else {
        query = query.or(`from_id.eq.${user!.id},to_id.eq.${user!.id}`)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Message[]
    },
    enabled: !!user,
    refetchInterval: 5000, // poll every 5s for new messages
  })
}

export function useUnreadCount() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [QUERY_KEY, 'unread', user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('to_id', user!.id)
        .eq('read', false)
      if (error) throw error
      return count ?? 0
    },
    enabled: !!user,
    refetchInterval: 10000,
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (form: MessageForm) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({ ...form, from_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => toast.error('Failed to send message.'),
  })
}

export function useMarkRead() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (fromUserId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('to_id', user!.id)
        .eq('from_id', fromUserId)
        .eq('read', false)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

/** Get list of unique conversation partners */
export function useConversations() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, 'conversations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          from_id, to_id,
          from:users!messages_from_id_fkey(id,name,role,avatar_url),
          to:users!messages_to_id_fkey(id,name,role,avatar_url)
        `)
        .or(`from_id.eq.${user!.id},to_id.eq.${user!.id}`)
        .order('created_at', { ascending: false })
      if (error) throw error

      // Unique partners
      const seen = new Set<string>()
      const conversations: Array<{ partner: { id: string; name: string; role: string; avatar_url?: string | null }; unread: number }> = []

      for (const msg of data ?? []) {
        const partner = msg.from_id === user!.id
          ? (msg.to as { id: string; name: string; role: string; avatar_url?: string | null })
          : (msg.from as { id: string; name: string; role: string; avatar_url?: string | null })
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
