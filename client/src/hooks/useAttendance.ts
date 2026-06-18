import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { Attendance, AttendanceForm } from '@/types'
import { today } from '@/lib/utils'
import toast from 'react-hot-toast'

const K = 'attendance'

interface FetchOptions {
  date?: string
  classroomId?: string
  childId?: string
  from?: string
  to?: string
}

function qs(opts: FetchOptions): string {
  const p = new URLSearchParams()
  if (opts.date)        p.set('date',         opts.date)
  if (opts.classroomId) p.set('classroom_id', opts.classroomId)
  if (opts.childId)     p.set('child_id',     opts.childId)
  if (opts.from)        p.set('from',         opts.from)
  if (opts.to)          p.set('to',           opts.to)
  const s = p.toString()
  return s ? `?${s}` : ''
}

export function useAttendance(opts: FetchOptions = {}) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, opts],
    queryFn: () => api.get<Attendance[]>(`/attendance${qs(opts)}`),
    enabled: !!user,
  })
}

export function useTodayAttendance(classroomId?: string) {
  return useAttendance({ date: today(), classroomId })
}

export function useUpsertAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: AttendanceForm & { classroom_id: string; date?: string }) =>
      api.post('/attendance', { ...form, date: form.date ?? today() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Attendance saved.') },
    onError: () => toast.error('Failed to save attendance.'),
  })
}

export function useBulkAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (records: Array<AttendanceForm & { classroom_id: string; date: string }>) =>
      api.post('/attendance', records),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Attendance saved for all children.') },
    onError: () => toast.error('Failed to save attendance.'),
  })
}

export function useChildAttendanceStats(childId: string, year: number, month: number) {
  return useQuery({
    queryKey: [K, 'stats', childId, year, month],
    queryFn: () => api.get(`/attendance/stats/${childId}?year=${year}&month=${month}`),
    enabled: !!childId,
  })
}
