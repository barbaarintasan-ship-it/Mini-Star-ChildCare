import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export interface CurriculumActivity {
  id: string
  unit_id: string
  title: string
  description: string
  age_group: string
  area: string
  duration: string
  created_at: string
}

export interface CurriculumUnit {
  id: string
  week: string
  theme: string
  color: string
  sort_order: number
  created_at: string
  activities: CurriculumActivity[]
}

const K = 'curriculum'

export function useCurriculum() {
  return useQuery({
    queryKey: [K],
    queryFn: () => api.get<CurriculumUnit[]>('/curriculum/units'),
  })
}

export function useAddActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: {
      unit_id: string
      title: string
      description: string
      age_group: string
      area: string
      duration: string
    }) => api.post<CurriculumActivity>('/curriculum/activities', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [K] })
      toast.success('Activity added.')
    },
    onError: () => toast.error('Failed to add activity.'),
  })
}

export function useDeleteActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/curriculum/activities/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [K] })
      toast.success('Activity removed.')
    },
    onError: () => toast.error('Failed to remove activity.'),
  })
}
