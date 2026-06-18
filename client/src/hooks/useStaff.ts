import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'staff'
const PARENTS_KEY = 'parents'

export function useStaff() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`*, classroom:classrooms(id,name)`)
        .in('role', ['admin', 'teacher'])
        .order('name')
      if (error) throw error
      return (data ?? []) as User[]
    },
  })
}

export function useParents() {
  return useQuery({
    queryKey: [PARENTS_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`*`)
        .eq('role', 'parent')
        .order('name')
      if (error) throw error
      return (data ?? []) as User[]
    },
  })
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['all_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id,name,role,username,email,classroom_id,avatar_url')
        .order('name')
      if (error) throw error
      return (data ?? []) as User[]
    },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Pick<User, 'name' | 'phone' | 'email' | 'classroom_id' | 'role'>>
    }) => {
      const { error } = await supabase.from('users').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [PARENTS_KEY] })
      qc.invalidateQueries({ queryKey: ['all_users'] })
      toast.success('User updated.')
    },
    onError: () => toast.error('Failed to update user.'),
  })
}

/**
 * Creates a new staff/parent account via Supabase Admin API.
 * NOTE: This requires a server-side function or Supabase Edge Function
 * to use the service_role key. For now we show the invite flow.
 */
export function useCreateUserNote() {
  return { note: 'Use Supabase Dashboard → Auth → Invite user to create accounts.' }
}
