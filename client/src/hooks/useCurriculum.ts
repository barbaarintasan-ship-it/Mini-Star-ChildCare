import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

// ── Curriculum Units / Activities (existing) ──────────────────

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
      unit_id: string; title: string; description: string
      age_group: string; area: string; duration: string
    }) => api.post<CurriculumActivity>('/curriculum/activities', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Activity added.') },
    onError: () => toast.error('Failed to add activity.'),
  })
}

export function useDeleteActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/curriculum/activities/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Activity removed.') },
    onError: () => toast.error('Failed to remove activity.'),
  })
}

// ── Lesson Plans ──────────────────────────────────────────────

export interface LessonPlanActivity {
  catId: string
  activityId: string
  status: 'pending' | 'completed' | 'partial' | 'skipped'
  notes: string
}

export interface ScheduleSlotDB {
  time: string; name: string; type: string; cat: string | null; slotIndex: number
}

export interface LessonPlan {
  id: string
  classroom_id: string
  date: string
  age_key: string
  theme: string
  activities: LessonPlanActivity[]
  schedule: ScheduleSlotDB[]
  generated_at: string
  created_at: string
}

const LP = 'lesson-plans'

export function useLessonPlan(classroom_id: string | undefined, date: string) {
  return useQuery({
    queryKey: [LP, classroom_id, date],
    queryFn: () => api.get<LessonPlan>(`/lesson-plans?classroom_id=${classroom_id}&date=${date}`),
    enabled: !!classroom_id && !!date,
  })
}

export function useGeneratePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { classroom_id: string; date: string; theme?: string }) =>
      api.post<LessonPlan>('/lesson-plans/generate', body),
    onSuccess: (data) => {
      qc.setQueryData([LP, data.classroom_id, data.date], data)
      toast.success('Plan regenerated!')
    },
    onError: () => toast.error('Failed to generate plan.'),
  })
}

export function useUpdatePlanActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ planId, index, status, notes }: {
      planId: string; index: number; status?: string; notes?: string
    }) => api.patch<LessonPlan>(`/lesson-plans/${planId}/activity`, { index, status, notes }),
    onSuccess: (data) => {
      qc.setQueryData([LP, data.classroom_id, data.date], data)
    },
    onError: () => toast.error('Failed to update activity.'),
  })
}

// ── Milestones ────────────────────────────────────────────────

export interface ChildMilestone {
  id: string
  child_id: string
  skill_id: string
  level: string
  updated_at: string
}

const ML = 'milestones'

export function useMilestones(child_id: string | undefined) {
  return useQuery({
    queryKey: [ML, child_id],
    queryFn: () => api.get<ChildMilestone[]>(`/milestones?child_id=${child_id}`),
    enabled: !!child_id,
  })
}

export function useUpsertMilestone() {
  const qc = useQueryClient()
  return useMutation<ChildMilestone, Error, { child_id: string; skill_id: string; level: string }>({
    mutationFn: (body) => api.put<ChildMilestone>('/milestones', body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: [ML, data.child_id] })
    },
    onError: () => toast.error('Failed to save milestone.'),
  })
}

// ── Week Themes ───────────────────────────────────────────────

export interface WeekTheme {
  id: string
  classroom_id: string
  week_start: string
  theme: string
  updated_at: string
}

const WT = 'week-themes'

export function useWeekThemes(classroom_id: string | undefined) {
  return useQuery({
    queryKey: [WT, classroom_id],
    queryFn: () => api.get<WeekTheme[]>(`/week-themes?classroom_id=${classroom_id}`),
    enabled: !!classroom_id,
  })
}

export function useSetWeekTheme() {
  const qc = useQueryClient()
  return useMutation<WeekTheme, Error, { classroom_id: string; week_start: string; theme: string }>({
    mutationFn: (body) => api.put<WeekTheme>('/week-themes', body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: [WT, data.classroom_id] })
      toast.success('Theme updated!')
    },
    onError: () => toast.error('Failed to update theme.'),
  })
}
