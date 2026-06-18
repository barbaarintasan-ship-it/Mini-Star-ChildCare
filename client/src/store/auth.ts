import { create } from 'zustand'
import { api, setToken } from '@/lib/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (v: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => {
    setToken(null)
    set({ user: null })
  },
}))

export async function fetchCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('ms_token')
  if (!token) return null
  try {
    return await api.get<User>('/auth/me')
  } catch {
    setToken(null)
    return null
  }
}
