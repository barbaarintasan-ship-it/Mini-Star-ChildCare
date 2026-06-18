import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { CalendarEvent, EventForm } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'events'

export function useEvents(from?: string, to?: string) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, from, to, user?.role],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select(`*, classroom:classrooms(id,name)`)
        .contains('visible_to', [user!.role])
        .order('start_date')

      if (from) query = query.gte('start_date', from)
      if (to) query = query.lte('start_date', to)

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as CalendarEvent[]
    },
    enabled: !!user,
  })
}

export function useUpcomingEvents(limit = 5) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, 'upcoming', user?.role],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`*, classroom:classrooms(id,name)`)
        .contains('visible_to', [user!.role])
        .gte('start_date', new Date().toISOString().slice(0, 10))
        .order('start_date')
        .limit(limit)
      if (error) throw error
      return (data ?? []) as CalendarEvent[]
    },
    enabled: !!user,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (form: EventForm) => {
      const { data, error } = await supabase
        .from('events')
        .insert({ ...form, created_by: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Event created.')
    },
    onError: () => toast.error('Failed to create event.'),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: Partial<EventForm> }) => {
      const { error } = await supabase.from('events').update(form).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Event updated.')
    },
    onError: () => toast.error('Failed to update event.'),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Event deleted.')
    },
  })
}
