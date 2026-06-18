import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Enrollment, EnrollmentStatus, EnrollmentPublicForm } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'enrollments'

export function useEnrollments(status?: EnrollmentStatus) {
  return useQuery({
    queryKey: [QUERY_KEY, status],
    queryFn: async () => {
      let query = supabase
        .from('enrollments')
        .select(`*, preferred_classroom:classrooms!enrollments_class_preference_fkey(id,name)`)
        .order('submitted_at', { ascending: false })

      if (status) query = query.eq('status', status)

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Enrollment[]
    },
  })
}

/** Public enrollment submission — no auth required */
export function useSubmitEnrollment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (form: EnrollmentPublicForm) => {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({ ...form, status: 'pending' })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Enrollment request submitted! We will be in touch.')
    },
    onError: () => toast.error('Failed to submit enrollment.'),
  })
}

export function useUpdateEnrollmentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      assignedClassroomId,
    }: {
      id: string
      status: EnrollmentStatus
      assignedClassroomId?: string
    }) => {
      const { error } = await supabase
        .from('enrollments')
        .update({ status, assigned_classroom_id: assignedClassroomId ?? null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Enrollment updated.')
    },
    onError: () => toast.error('Failed to update enrollment.'),
  })
}
