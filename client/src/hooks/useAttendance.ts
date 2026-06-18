import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { Attendance, AttendanceForm } from '@/types'
import { today } from '@/lib/utils'
import toast from 'react-hot-toast'

const QUERY_KEY = 'attendance'

interface FetchOptions {
  date?: string
  classroomId?: string
  childId?: string
  from?: string
  to?: string
}

export function useAttendance(opts: FetchOptions = {}) {
  const { user } = useAuthStore()
  const dateFilter = opts.date ?? today()

  return useQuery({
    queryKey: [QUERY_KEY, opts],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          child:children(id,name,photo_url,dob),
          teacher:users(id,name)
        `)
        .order('created_at', { ascending: false })

      if (opts.date) query = query.eq('date', opts.date)
      if (opts.classroomId) query = query.eq('classroom_id', opts.classroomId)
      if (opts.childId) query = query.eq('child_id', opts.childId)
      if (opts.from) query = query.gte('date', opts.from)
      if (opts.to) query = query.lte('date', opts.to)

      // Parent: filter to own children
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
      return (data ?? []) as Attendance[]
    },
    enabled: !!user,
  })
}

export function useTodayAttendance(classroomId?: string) {
  return useAttendance({ date: today(), classroomId })
}

export function useUpsertAttendance() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (form: AttendanceForm & { classroom_id: string; date?: string }) => {
      const record = {
        ...form,
        date: form.date ?? today(),
        teacher_id: user?.id,
      }
      const { error } = await supabase
        .from('attendance')
        .upsert(record, { onConflict: 'child_id,date' })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Attendance saved.')
    },
    onError: () => toast.error('Failed to save attendance.'),
  })
}

export function useBulkAttendance() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (
      records: Array<AttendanceForm & { classroom_id: string; date: string }>
    ) => {
      const rows = records.map((r) => ({ ...r, teacher_id: user?.id }))
      const { error } = await supabase
        .from('attendance')
        .upsert(rows, { onConflict: 'child_id,date' })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Attendance saved for all children.')
    },
    onError: () => toast.error('Failed to save attendance.'),
  })
}

/** Monthly attendance stats for a child */
export function useChildAttendanceStats(childId: string, year: number, month: number) {
  return useQuery({
    queryKey: [QUERY_KEY, 'stats', childId, year, month],
    queryFn: async () => {
      const from = `${year}-${String(month).padStart(2, '0')}-01`
      const to = `${year}-${String(month).padStart(2, '0')}-31`
      const { data, error } = await supabase
        .from('attendance')
        .select('date,status')
        .eq('child_id', childId)
        .gte('date', from)
        .lte('date', to)
      if (error) throw error

      const records = data ?? []
      return {
        present: records.filter((r) => r.status === 'present').length,
        absent: records.filter((r) => r.status === 'absent').length,
        late: records.filter((r) => r.status === 'late').length,
        early_pickup: records.filter((r) => r.status === 'early_pickup').length,
        excused: records.filter((r) => r.status === 'excused').length,
        total: records.length,
        records,
      }
    },
    enabled: !!childId,
  })
}
