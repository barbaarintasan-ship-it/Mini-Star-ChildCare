import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { PortfolioEntry } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'portfolio'

export function usePortfolio(childId?: string) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, childId],
    queryFn: async () => {
      let query = supabase
        .from('portfolio_entries')
        .select(`
          *,
          child:children(id,name),
          teacher:users(id,name)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (childId) query = query.eq('child_id', childId)

      if (user?.role === 'parent') {
        const { data: links } = await supabase
          .from('child_parents')
          .select('child_id')
          .eq('parent_id', user.id)
        const ids = (links ?? []).map((l) => l.child_id)
        if (ids.length === 0) return []
        query = query.in('child_id', ids)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as PortfolioEntry[]
    },
    enabled: !!user,
  })
}

export function useCreatePortfolioEntry() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (form: {
      child_id: string
      title: string
      description?: string
      media_url?: string
      media_type?: string
      milestone_id?: string
      activity_tags?: string[]
      date?: string
    }) => {
      const { data, error } = await supabase
        .from('portfolio_entries')
        .insert({ ...form, teacher_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Portfolio entry added.')
    },
    onError: () => toast.error('Failed to add portfolio entry.'),
  })
}

export function useToggleLike() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async ({ entry }: { entry: PortfolioEntry }) => {
      const likedBy = entry.liked_by ?? []
      const alreadyLiked = likedBy.includes(user!.id)
      const newLikes = alreadyLiked
        ? likedBy.filter((id) => id !== user!.id)
        : [...likedBy, user!.id]

      const { error } = await supabase
        .from('portfolio_entries')
        .update({ liked_by: newLikes })
        .eq('id', entry.id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useDeletePortfolioEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('portfolio_entries').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Entry deleted.')
    },
  })
}

/** Upload a file to Supabase Storage and return its public URL */
export async function uploadPortfolioMedia(
  file: File,
  childId: string
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `portfolio/${childId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('ministar-media')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('ministar-media').getPublicUrl(path)
  return data.publicUrl
}
