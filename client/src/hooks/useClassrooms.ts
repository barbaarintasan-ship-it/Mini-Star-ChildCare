import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Classroom } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'classrooms'

export function useClassrooms() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classrooms')
        .select(`*, teacher:users(id,name)`)
        .order('name')
      if (error) throw error
      return (data ?? []) as Classroom[]
    },
  })
}

export function useCreateClassroom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (form: Omit<Classroom, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('classrooms')
        .insert(form)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Classroom created.')
    },
    onError: () => toast.error('Failed to create classroom.'),
  })
}

export function useUpdateClassroom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: Partial<Classroom> }) => {
      const { error } = await supabase.from('classrooms').update(form).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Classroom updated.')
    },
    onError: () => toast.error('Failed to update classroom.'),
  })
}
