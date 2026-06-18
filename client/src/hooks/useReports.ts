import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { DailyReport, ReportForm } from '@/types'
import { today } from '@/lib/utils'
import toast from 'react-hot-toast'

const QUERY_KEY = 'daily_reports'

interface FetchOptions {
  date?: string
  classroomId?: string
  childId?: string
  from?: string
  to?: string
}

export function useReports(opts: FetchOptions = {}) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, opts],
    queryFn: async () => {
      let query = supabase
        .from('daily_reports')
        .select(`
          *,
          child:children(id,name,photo_url,dob,classroom_id),
          teacher:users(id,name)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (opts.date) query = query.eq('date', opts.date)
      if (opts.classroomId) query = query.eq('classroom_id', opts.classroomId)
      if (opts.childId) query = query.eq('child_id', opts.childId)
      if (opts.from) query = query.gte('date', opts.from)
      if (opts.to) query = query.lte('date', opts.to)

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
      return (data ?? []) as DailyReport[]
    },
    enabled: !!user,
  })
}

export function useTodayReports(classroomId?: string) {
  return useReports({ date: today(), classroomId })
}

export function useCreateReport() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (form: ReportForm & { classroom_id: string }) => {
      const { data, error } = await supabase
        .from('daily_reports')
        .insert({ ...form, teacher_id: user?.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Daily report saved.')
    },
    onError: () => toast.error('Failed to save report.'),
  })
}

export function useUpdateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: Partial<ReportForm> }) => {
      const { error } = await supabase
        .from('daily_reports')
        .update(form)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Report updated.')
    },
    onError: () => toast.error('Failed to update report.'),
  })
}

export function useDeleteReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('daily_reports').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Report deleted.')
    },
  })
}
