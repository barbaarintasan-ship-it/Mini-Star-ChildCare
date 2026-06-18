import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import type { Child, ChildForm } from '@/types'
import toast from 'react-hot-toast'

const K = 'children'

export function useChildren() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: [K, user?.id, user?.role],
    queryFn: () => api.get<Child[]>('/children'),
    enabled: !!user,
  })
}

export function useChild(id: string) {
  return useQuery({
    queryKey: [K, id],
    queryFn: () => api.get<Child>(`/children/${id}`),
    enabled: !!id,
  })
}

export function useCreateChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: ChildForm) => api.post<Child>('/children', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Child added.') },
    onError: () => toast.error('Failed to add child.'),
  })
}

export function useUpdateChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: Partial<ChildForm> }) =>
      api.patch(`/children/${id}`, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Child updated.') },
    onError: () => toast.error('Failed to update child.'),
  })
}

export function useArchiveChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/children/${id}`, { active: false }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Child archived.') },
  })
}

export function useLinkParent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ childId, parentId }: { childId: string; parentId: string }) =>
      api.post(`/children/${childId}/link-parent`, { parent_id: parentId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Parent linked.') },
    onError: () => toast.error('Failed to link parent.'),
  })
}

export function useUnlinkParent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ childId, parentId }: { childId: string; parentId: string }) =>
      api.delete(`/children/${childId}/unlink-parent/${parentId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [K] }); toast.success('Parent unlinked.') },
  })
}
