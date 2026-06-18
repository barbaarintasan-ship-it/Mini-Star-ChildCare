import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { CalendarEvent, EventForm } from '@/types'
import toast from 'react-hot-toast'

const K = 'events'

export function useEvents(from?: string, to?: string) {
  const { user } = useAuthStore()
  const p = new URLSearchParams()
  if (from) p.set('from', from)
  if (to)   p.set('to',   to)
  const q = p.toString()
  return useQuery({
    queryKey: [K, from, to, user?.role],
    queryFn: () => api.get<CalendarEvent[]>(`/events${q ? `?${q}` : ''}`),
    enabled: !!user,
  })
}

export function useUpcomingEvents(limit = 5) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, 'upcoming', user?.role],
    queryFn: () => api.get<CalendarEvent[]>(`/events?upcoming=1&limit=${limit}`),
    enabled: !!user,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: EventForm) => api.post<CalendarEvent>('/events', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Event created.') },
    onError: () => toast.error('Failed to create event.'),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: Partial<EventForm> }) =>
      api.patch(`/events/${id}`, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Event updated.') },
    onError: () => toast.error('Failed to update event.'),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Event deleted.') },
  })
}
