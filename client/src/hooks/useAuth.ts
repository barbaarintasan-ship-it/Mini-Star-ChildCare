import { useEffect } from 'react'
import { useAuthStore, fetchCurrentUser } from '@/store/auth'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function useAuth() {
  const { user, loading, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    // Initial session check
    fetchCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const u = await fetchCurrentUser()
        setUser(u)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  /**
   * Sign in by username — looks up email from users table,
   * then authenticates with Supabase Auth.
   */
  async function loginByUsername(username: string, password: string): Promise<boolean> {
    // Find email from username
    const { data: profile, error: profileErr } = await supabase
      .from('users')
      .select('email')
      .ilike('username', username)
      .single()

    if (profileErr || !profile?.email) {
      toast.error('Wrong username or password.')
      return false
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password,
    })

    if (error) {
      toast.error('Wrong username or password.')
      return false
    }

    return true
  }

  return { user, loading, loginByUsername, logout }
}
