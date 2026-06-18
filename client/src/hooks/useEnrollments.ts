import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Enrollment, EnrollmentStatus, EnrollmentPublicForm } from '@/types'
import toast from 'react-hot-toast'

const K = 'enrollments'

export function useEnrollments(status?: EnrollmentStatus) {
  return useQuery({
    queryKey: [K, status],
    queryFn: () => api.get<Enrollment[]>(`/enrollments${status ? `?status=${status}` : ''}`),
  })
}

export function useSubmitEnrollment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: EnrollmentPublicForm) =>
      api.post<Enrollment>('/enrollments', { ...form, status: 'pending' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [K] })
      toast.success('Enrollment request submitted! We will be in touch.')
    },
    onError: () => toast.error('Failed to submit enrollment.'),
  })
}

export function useUpdateEnrollmentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, assignedClassroomId }: {
      id: string; status: EnrollmentStatus; assignedClassroomId?: string
    }) => api.patch(`/enrollments/${id}`, { status, assigned_classroom_id: assignedClassroomId ?? null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Enrollment updated.') },
    onError: () => toast.error('Failed to update enrollment.'),
  })
}
