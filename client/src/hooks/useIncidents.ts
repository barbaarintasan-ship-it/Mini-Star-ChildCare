import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { Incident, IncidentForm } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'incidents'

export function useIncidents(childId?: string) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, childId],
    queryFn: async () => {
      let query = supabase
        .from('incidents')
        .select(`
          *,
          child:children(id,name,photo_url),
          teacher:users(id,name),
          classroom:classrooms(id,name)
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
      return (data ?? []) as Incident[]
    },
    enabled: !!user,
  })
}

export function useCreateIncident() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (form: IncidentForm) => {
      const { data, error } = await supabase
        .from('incidents')
        .insert({ ...form, teacher_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Incident report saved.')
    },
    onError: () => toast.error('Failed to save incident report.'),
  })
}

export function useUpdateIncidentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      parentNotified,
    }: {
      id: string
      status?: string
      parentNotified?: boolean
    }) => {
      const update: Record<string, unknown> = {}
      if (status) update.status = status
      if (parentNotified !== undefined) {
        update.parent_notified = parentNotified
        if (parentNotified) update.parent_notified_at = new Date().toISOString()
      }
      const { error } = await supabase.from('incidents').update(update).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Incident updated.')
    },
    onError: () => toast.error('Failed to update incident.'),
  })
}
