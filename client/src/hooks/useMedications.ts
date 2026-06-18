import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { Medication, MedicationForm, MedicationLog } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'medications'
const LOG_KEY = 'medication_logs'

export function useMedications(childId?: string) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, childId],
    queryFn: async () => {
      let query = supabase
        .from('medications')
        .select(`*, child:children(id,name,classroom_id)`)
        .eq('active', true)
        .order('name')

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
      return (data ?? []) as Medication[]
    },
    enabled: !!user,
  })
}

export function useMedicationLogs(childId?: string, date?: string) {
  return useQuery({
    queryKey: [LOG_KEY, childId, date],
    queryFn: async () => {
      let query = supabase
        .from('medication_logs')
        .select(`
          *,
          teacher:users(id,name),
          medication:medications(id,name,dosage)
        `)
        .order('given_at', { ascending: false })

      if (childId) query = query.eq('child_id', childId)
      if (date) {
        query = query
          .gte('given_at', `${date}T00:00:00`)
          .lte('given_at', `${date}T23:59:59`)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as MedicationLog[]
    },
  })
}

export function useAddMedication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (form: MedicationForm) => {
      const { data, error } = await supabase
        .from('medications')
        .insert(form)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Medication added.')
    },
    onError: () => toast.error('Failed to add medication.'),
  })
}

export function useLogMedication() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async ({
      medicationId,
      childId,
      dosage,
      notes,
      missed = false,
    }: {
      medicationId: string
      childId: string
      dosage?: string
      notes?: string
      missed?: boolean
    }) => {
      const { error } = await supabase.from('medication_logs').insert({
        medication_id: medicationId,
        child_id: childId,
        teacher_id: user!.id,
        given_at: new Date().toISOString(),
        dosage,
        notes,
        missed,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LOG_KEY] })
      toast.success('Medication logged.')
    },
    onError: () => toast.error('Failed to log medication.'),
  })
}

export function useDeactivateMedication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('medications')
        .update({ active: false })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Medication deactivated.')
    },
  })
}
