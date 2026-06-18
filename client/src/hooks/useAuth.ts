import { useEffect } from 'react'
import { useAuthStore, fetchCurrentUser } from '@/store/auth'
import { api, setToken } from '@/lib/api'
import toast from 'react-hot-toast'
import type { User } from '@/types'

export function useAuth() {
  const { user, loading, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    fetchCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [setUser, setLoading])

  async function loginByUsername(username: string, password: string): Promise<boolean> {
    try {
      const { token, user: u } = await api.post<{ token: string; user: User }>(
        '/auth/login',
        { username, password }
      )
      setToken(token)
      setUser(u)
      return true
    } catch {
      toast.error('Wrong username or password.')
      return false
    }
  }

  return { user, loading, loginByUsername, logout }
}
