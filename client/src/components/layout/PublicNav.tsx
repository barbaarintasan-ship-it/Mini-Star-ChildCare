import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/about',      label: 'About Us' },
  { to: '/programs',   label: 'Programs' },
  { to: '/enrollment', label: 'Enrollment' },
  { to: '/contact',    label: 'Contact' },
]

export function PublicNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/images/logo.png" alt="Mini Star" className="h-9 w-9 object-contain" />
          <span className="font-heading font-600 text-night text-lg leading-tight hidden sm:block">
            Mini Star<br />
            <span className="text-xs font-body font-700 text-gray-400">Child Care</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded-lg text-sm font-700 transition-colors
                ${location.pathname === to
                  ? 'bg-night text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-night'
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Login button */}
        <button
          className="btn-secondary btn btn-sm hidden md:flex"
          onClick={() => navigate('/portal')}
        >
          Portal Login
        </button>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block px-3 py-2.5 rounded-xl text-sm font-700 text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <button
            className="w-full mt-2 btn-secondary btn btn-sm"
            onClick={() => { setOpen(false); navigate('/portal') }}
          >
            Portal Login
          </button>
        </div>
      )}
    </header>
  )
}
