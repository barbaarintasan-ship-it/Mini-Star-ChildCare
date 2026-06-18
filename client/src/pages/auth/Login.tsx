import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'

export default function Login() {
  const { loginByUsername } = useAuth()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Already logged in → redirect
  if (user) {
    navigate('/portal/dashboard', { replace: true })
    return null
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) return
    setLoading(true)
    const ok = await loginByUsername(username, password)
    setLoading(false)
    if (ok) navigate('/portal/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night to-night-2 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <img src="/images/logo.png" alt="Mini Star" className="h-16 w-16 object-contain mb-3" />
            <h1 className="font-heading text-2xl font-600 text-night">Mini Star Portal</h1>
            <p className="text-sm text-gray-400 mt-1">Family & Staff Login</p>
          </div>

          {/* Demo banner */}
          <div className="bg-gold-soft rounded-xl p-3 mb-5 text-xs">
            <p className="font-700 text-night mb-1">Demo Accounts:</p>
            <p className="text-gray-600">Admin: <code>admin</code> / <code>admin123</code></p>
            <p className="text-gray-600">Teacher: <code>teacher1</code> / <code>demo123</code></p>
            <p className="text-gray-600">Parent: <code>parent1</code> / <code>demo123</code></p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Username"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              className="w-full mt-2"
              loading={loading}
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-4">
          <button
            className="text-sm text-white/70 hover:text-white transition-colors"
            onClick={() => navigate('/')}
          >
            ← Back to website
          </button>
        </p>
      </div>
    </div>
  )
}
