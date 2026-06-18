import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { Medication, MedicationForm, MedicationLog } from '@/types'
import toast from 'react-hot-toast'

const K = 'medications'
const LK = 'medication_logs'

export function useMedications(childId?: string) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, childId],
    queryFn: () => api.get<Medication[]>(`/medications${childId ? `?child_id=${childId}` : ''}`),
    enabled: !!user,
  })
}

export function useMedicationLogs(childId?: string, date?: string) {
  const p = new URLSearchParams()
  if (childId) p.set('child_id', childId)
  if (date)    p.set('date',     date)
  const q = p.toString()
  return useQuery({
    queryKey: [LK, childId, date],
    queryFn: () => api.get<MedicationLog[]>(`/medication-logs${q ? `?${q}` : ''}`),
  })
}

export function useAddMedication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: MedicationForm) => api.post<Medication>('/medications', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Medication added.') },
    onError: () => toast.error('Failed to add medication.'),
  })
}

export function useLogMedication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ medicationId, childId, dosage, notes, missed = false }: {
      medicationId: string; childId: string; dosage?: string; notes?: string; missed?: boolean
    }) => api.post('/medication-logs', { medication_id: medicationId, child_id: childId, dosage, notes, missed }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [LK] }); toast.success('Medication logged.') },
    onError: () => toast.error('Failed to log medication.'),
  })
}

export function useDeactivateMedication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/medications/${id}`, { active: false }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Medication deactivated.') },
  })
}
