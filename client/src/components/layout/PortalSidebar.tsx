import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Baby, ClipboardList, MessageSquare,
  Calendar, BookOpen, AlertTriangle, Pill, Image, GraduationCap,
  Bell, Menu, X, LogOut, ChevronDown, ChevronRight, BookMarked,
  UserCheck, BarChart2,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import { NotificationBell } from './NotificationBell'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  badge?: number
}

function useNavItems(role: string): NavItem[] {
  const base = '/portal'

  if (role === 'admin') return [
    { label: 'Dashboard',   path: `${base}/dashboard`,   icon: <LayoutDashboard size={18} /> },
    { label: 'Enrollments', path: `${base}/enrollments`, icon: <ClipboardList size={18} /> },
    { label: 'Children',    path: `${base}/children`,    icon: <Baby size={18} /> },
    { label: 'Staff',       path: `${base}/staff`,       icon: <GraduationCap size={18} /> },
    { label: 'Parents',     path: `${base}/parents`,     icon: <Users size={18} /> },
    { label: 'Attendance',  path: `${base}/attendance`,  icon: <UserCheck size={18} /> },
    { label: 'Reports',     path: `${base}/reports`,     icon: <BookMarked size={18} /> },
    { label: 'Messages',    path: `${base}/messages`,    icon: <MessageSquare size={18} /> },
    { label: 'Incidents',   path: `${base}/incidents`,   icon: <AlertTriangle size={18} /> },
    { label: 'Medications', path: `${base}/medications`, icon: <Pill size={18} /> },
    { label: 'Portfolio',   path: `${base}/portfolio`,   icon: <Image size={18} /> },
    { label: 'Curriculum',  path: `${base}/curriculum`,  icon: <BookOpen size={18} /> },
    { label: 'Calendar',    path: `${base}/calendar`,    icon: <Calendar size={18} /> },
    { label: 'Analytics',    path: `${base}/analytics`,   icon: <BarChart2 size={18} /> },
    { label: 'Notifications',path:`${base}/notifications`,icon:<Bell size={18} /> },
  ]

  if (role === 'teacher') return [
    { label: 'Dashboard',   path: `${base}/dashboard`,   icon: <LayoutDashboard size={18} /> },
    { label: 'My Class',    path: `${base}/my-class`,    icon: <Baby size={18} /> },
    { label: 'Attendance',  path: `${base}/attendance`,  icon: <UserCheck size={18} /> },
    { label: 'Daily Reports',path:`${base}/reports`,     icon: <BookMarked size={18} /> },
    { label: 'Messages',    path: `${base}/messages`,    icon: <MessageSquare size={18} /> },
    { label: 'Incidents',   path: `${base}/incidents`,   icon: <AlertTriangle size={18} /> },
    { label: 'Medications', path: `${base}/medications`, icon: <Pill size={18} /> },
    { label: 'Portfolio',   path: `${base}/portfolio`,   icon: <Image size={18} /> },
    { label: 'Curriculum',  path: `${base}/curriculum`,  icon: <BookOpen size={18} /> },
    { label: 'Analytics',  path: `${base}/analytics`,   icon: <BarChart2 size={18} /> },
    { label: 'Calendar',   path: `${base}/calendar`,    icon: <Calendar size={18} /> },
  ]

  // parent
  return [
    { label: 'Dashboard',  path: `${base}/dashboard`,  icon: <LayoutDashboard size={18} /> },
    { label: 'My Children',path: `${base}/my-children`, icon: <Baby size={18} /> },
    { label: 'Attendance', path: `${base}/attendance`, icon: <UserCheck size={18} /> },
    { label: 'Reports',    path: `${base}/reports`,    icon: <BookMarked size={18} /> },
    { label: 'Messages',   path: `${base}/messages`,   icon: <MessageSquare size={18} /> },
    { label: 'Incidents',  path: `${base}/incidents`,  icon: <AlertTriangle size={18} /> },
    { label: 'Portfolio',  path: `${base}/portfolio`,  icon: <Image size={18} /> },
    { label: 'Calendar',   path: `${base}/calendar`,   icon: <Calendar size={18} /> },
  ]
}

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navItems = useNavItems(user?.role ?? 'parent')

  const handleLogout = async () => {
    await logout()
    navigate('/portal')
  }

  const Sidebar = (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      {/* Logo + user info combined */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <img src="/images/logo.png" alt="Mini Star" className="h-8 w-8 object-contain shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-heading font-700 text-night text-sm leading-tight truncate">{user?.name ?? 'Mini Star'}</p>
          <p className="text-[10px] text-gray-400 capitalize">{user?.role} · Mini Star</p>
        </div>
        {/* Close button on mobile */}
        <button
          type="button"
          className="lg:hidden p-1 rounded-lg text-gray-400 hover:bg-gray-100"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              type="button"
              className={cn('nav-item w-full', active && 'nav-item-active')}
              onClick={() => { navigate(item.path); setSidebarOpen(false) }}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100">
        <button
          type="button"
          className="nav-item w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">{Sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 z-10">{Sidebar}</div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-3 h-12 lg:h-14 flex items-center justify-between shrink-0 gap-2">
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 lg:hidden min-w-0">
            <p className="text-sm font-heading font-700 text-night truncate">
              {navItems.find(n => n.path === location.pathname)?.label ?? 'Portal'}
            </p>
          </div>

          {/* Desktop: show app name */}
          <div className="hidden lg:block flex-1">
            <p className="text-sm font-heading font-600 text-gray-400">
              {navItems.find(n => n.path === location.pathname)?.label ?? ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
