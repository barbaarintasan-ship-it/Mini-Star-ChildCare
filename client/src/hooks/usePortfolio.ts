import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { PortfolioEntry } from '@/types'
import toast from 'react-hot-toast'

const K = 'portfolio'

export function usePortfolio(childId?: string) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, childId],
    queryFn: () => api.get<PortfolioEntry[]>(`/portfolio${childId ? `?child_id=${childId}` : ''}`),
    enabled: !!user,
  })
}

export function useCreatePortfolioEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: {
      child_id: string; title: string; description?: string; media_url?: string
      media_type?: string; milestone_id?: string; activity_tags?: string[]; date?: string
    }) => api.post<PortfolioEntry>('/portfolio', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Portfolio entry added.') },
    onError: () => toast.error('Failed to add portfolio entry.'),
  })
}

export function useToggleLike() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ entry }: { entry: PortfolioEntry }) =>
      api.post(`/portfolio/${entry.id}/like`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [K] }),
  })
}

export function useDeletePortfolioEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/portfolio/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Entry deleted.') },
  })
}

/** Upload not supported without Supabase Storage — returns the URL as-is */
export async function uploadPortfolioMedia(file: File, _childId: string): Promise<string> {
  throw new Error('File upload requires cloud storage configuration. Please provide a media URL directly.')
}
