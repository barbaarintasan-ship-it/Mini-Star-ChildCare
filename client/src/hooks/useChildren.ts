import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import type { Child, ChildForm } from '@/types'
import toast from 'react-hot-toast'

const QUERY_KEY = 'children'

async function fetchChildren(userId: string, role: string): Promise<Child[]> {
  let query = supabase
    .from('children')
    .select(`
      *,
      classroom:classrooms(id,name,age_group),
      parents:child_parents(parent:users(id,name,email,phone))
    `)
    .eq('active', true)
    .order('name')

  if (role === 'parent') {
    // Only return children linked to this parent
    const { data: links } = await supabase
      .from('child_parents')
      .select('child_id')
      .eq('parent_id', userId)
    const ids = (links ?? []).map((l) => l.child_id)
    if (ids.length === 0) return []
    query = query.in('id', ids)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Child[]
}

export function useChildren() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: [QUERY_KEY, user?.id, user?.role],
    queryFn: () => fetchChildren(user!.id, user!.role),
    enabled: !!user,
  })
}

export function useChild(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          classroom:classrooms(*),
          parents:child_parents(parent:users(id,name,email,phone,username))
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Child
    },
    enabled: !!id,
  })
}

export function useCreateChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (form: ChildForm) => {
      const { data, error } = await supabase
        .from('children')
        .insert(form)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Child added.')
    },
    onError: () => toast.error('Failed to add child.'),
  })
}

export function useUpdateChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: Partial<ChildForm> }) => {
      const { error } = await supabase
        .from('children')
        .update(form)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Child updated.')
    },
    onError: () => toast.error('Failed to update child.'),
  })
}

export function useArchiveChild() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('children')
        .update({ active: false })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Child archived.')
    },
  })
}

/** Link a parent to a child */
export function useLinkParent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ childId, parentId }: { childId: string; parentId: string }) => {
      const { error } = await supabase
        .from('child_parents')
        .upsert({ child_id: childId, parent_id: parentId })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Parent linked.')
    },
    onError: () => toast.error('Failed to link parent.'),
  })
}

/** Unlink a parent from a child */
export function useUnlinkParent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ childId, parentId }: { childId: string; parentId: string }) => {
      const { error } = await supabase
        .from('child_parents')
        .delete()
        .eq('child_id', childId)
        .eq('parent_id', parentId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Parent unlinked.')
    },
  })
}
