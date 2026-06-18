import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { DailyReport, ReportForm } from '@/types'
import { today } from '@/lib/utils'
import toast from 'react-hot-toast'

const K = 'daily_reports'

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

export function useReports(opts: FetchOptions = {}) {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, opts],
    queryFn: () => api.get<DailyReport[]>(`/reports${qs(opts)}`),
    enabled: !!user,
  })
}

export function useTodayReports(classroomId?: string) {
  return useReports({ date: today(), classroomId })
}

export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: ReportForm & { classroom_id: string }) =>
      api.post<DailyReport>('/reports', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Daily report saved.') },
    onError: () => toast.error('Failed to save report.'),
  })
}

export function useUpdateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: Partial<ReportForm> }) =>
      api.patch(`/reports/${id}`, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Report updated.') },
    onError: () => toast.error('Failed to update report.'),
  })
}

export function useDeleteReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/reports/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Report deleted.') },
  })
}
