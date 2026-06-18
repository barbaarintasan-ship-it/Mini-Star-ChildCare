import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Classroom } from '@/types'
import toast from 'react-hot-toast'

const K = 'classrooms'

export function useClassrooms() {
  return useQuery({
    queryKey: [K],
    queryFn: () => api.get<Classroom[]>('/classrooms'),
  })
}

export function useCreateClassroom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: Omit<Classroom, 'id' | 'created_at'>) =>
      api.post<Classroom>('/classrooms', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Classroom created.') },
    onError: () => toast.error('Failed to create classroom.'),
  })
}

export function useUpdateClassroom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: Partial<Classroom> }) =>
      api.patch(`/classrooms/${id}`, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Classroom updated.') },
    onError: () => toast.error('Failed to update classroom.'),
  })
}
