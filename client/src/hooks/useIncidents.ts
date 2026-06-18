import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { Incident, IncidentForm } from '@/types'
import toast from 'react-hot-toast'

const K = 'incidents'

export function useIncidents(childId?: string) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, childId],
    queryFn: () => api.get<Incident[]>(`/incidents${childId ? `?child_id=${childId}` : ''}`),
    enabled: !!user,
  })
}

export function useCreateIncident() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: IncidentForm) => api.post<Incident>('/incidents', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Incident report saved.') },
    onError: () => toast.error('Failed to save incident report.'),
  })
}

export function useUpdateIncidentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, parentNotified }: { id: string; status?: string; parentNotified?: boolean }) =>
      api.patch(`/incidents/${id}`, { status, parent_notified: parentNotified }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Incident updated.') },
    onError: () => toast.error('Failed to update incident.'),
  })
}
