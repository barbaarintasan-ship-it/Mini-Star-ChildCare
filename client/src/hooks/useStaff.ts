import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { User } from '@/types'
import toast from 'react-hot-toast'

const K = 'staff'
const PK = 'parents'

export function useStaff() {
  return useQuery({
    queryKey: [K],
    queryFn: () => api.get<User[]>('/users/staff'),
  })
}

export function useParents() {
  return useQuery({
    queryKey: [PK],
    queryFn: () => api.get<User[]>('/users/parents'),
  })
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['all_users'],
    queryFn: () => api.get<User[]>('/users'),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: {
      id: string
      updates: Partial<Pick<User, 'name' | 'phone' | 'email' | 'classroom_id' | 'role'>>
    }) => api.patch(`/users/${id}`, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [K] })
      qc.invalidateQueries({ queryKey: [PK] })
      qc.invalidateQueries({ queryKey: ['all_users'] })
      toast.success('User updated.')
    },
    onError: () => toast.error('Failed to update user.'),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: { name: string; role: string; username: string; email?: string; phone?: string; classroom_id?: string; password: string }) =>
      api.post<User>('/users', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [K] })
      qc.invalidateQueries({ queryKey: [PK] })
      toast.success('User created.')
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to create user.'),
  })
}

export function useCreateUserNote() {
  return { note: 'Use the Create User form to add staff/parent accounts.' }
}
