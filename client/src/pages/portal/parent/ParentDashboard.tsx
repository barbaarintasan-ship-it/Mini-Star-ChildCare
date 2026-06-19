import { useChildren } from '@/hooks/useChildren'
import { useReports } from '@/hooks/useReports'
import { useAttendance } from '@/hooks/useAttendance'
import { useUpcomingEvents } from '@/hooks/useEvents'
import { useIncidents } from '@/hooks/useIncidents'
import { useAuthStore } from '@/store/auth'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { AttendanceBadge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { fmtDate, MOOD_MAP, today, childAge } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Image, ChevronRight, BookOpen, Baby } from 'lucide-react'

// Home learning suggestions that rotate daily
const HOME_TIPS = [
  { icon: '📚', title: 'Reading Together', tip: 'Read one picture book today and ask "What do you think will happen next?" — this builds prediction and comprehension skills.' },
  { icon: '🎨', title: 'Creative Time', tip: 'Give your child paper and crayons and let them draw freely for 15 minutes. Ask them to tell you a story about their picture.' },
  { icon: '🧩', title: 'Problem Solving', tip: 'Try a simple puzzle together. Let your child struggle a little before helping — productive struggle builds persistence and confidence.' },
  { icon: '🌿', title: 'Nature Exploration', tip: 'Collect leaves, rocks, or flowers on a walk. Sort them by colour, size, or shape — that\'s early science and maths!' },
  { icon: '🎵', title: 'Music & Movement', tip: 'Dance and sing together for 10 minutes. Rhythm helps with language development, coordination, and mood regulation.' },
  { icon: '🍳', title: 'Kitchen Learning', tip: 'Let your child help with simple cooking — measuring, pouring, stirring. These build fine motor skills and early maths concepts.' },
  { icon: '💬', title: 'Conversation Practice', tip: 'At dinner, take turns sharing "one good thing and one hard thing" from your day. This builds emotional literacy and family connection.' },
]

export default function ParentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: allChildren = [], isLoading } = useChildren()
  const { data: recentReports = [] } = useReports({ from: (() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().slice(0, 10)
  })() })
  const { data: todayAttendance = [] } = useAttendance({ date: today() })
  const { data: upcomingEvents = [] } = useUpcomingEvents(5)
  const { data: incidents = [] } = useIncidents()

  if (isLoading) return <PageLoader />

  // Filter to only parent's linked children
  const children = allChildren.filter(c =>
    (c as { parents?: { id: string }[] }).parents?.some(p => p.id === user?.id)
  )

  const openIncidents = incidents.filter(i => i.status === 'open')
  const homeTip = HOME_TIPS[new Date().getDay()]

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-600 text-night">
            {greeting}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{fmtDate(new Date().toISOString())}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-3 py-1.5">
          <Heart size={12} className="text-rose-400" fill="currentColor" />
          {children.length} {children.length === 1 ? 'child' : 'children'}
        </div>
      </div>

      {/* Open incidents alert */}
      {openIncidents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="font-700 text-red-700 text-sm">Incident Report</p>
            <p className="text-xs text-red-600">
              {openIncidents.length} open incident {openIncidents.length === 1 ? 'report' : 'reports'} — please review.
            </p>
          </div>
          <button type="button" className="text-xs text-red-600 font-700 flex items-center gap-1 underline"
            onClick={() => navigate('/portal/incidents')}>
            View <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Children cards */}
      {children.length === 0 ? (
        <EmptyState icon="👶" title="No children linked"
          message="Ask the admin to link your children to your account." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {children.map(child => {
            const att = todayAttendance.find(a => a.child_id === child.id)
            const latestReport = recentReports.find(r => r.child_id === child.id)
            const classroomName = (child as { classroom?: { name: string } }).classroom?.name

            return (
              <Card key={child.id} className="group">
                {/* Child header */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={child.name} url={(child as { photo_url?: string }).photo_url} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-700 text-night">{child.name}</p>
                    <p className="text-xs text-gray-400">{childAge(child.dob)}</p>
                    {classroomName && (
                      <p className="text-xs text-teal font-700">{classroomName}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-700 text-gray-400">Today</span>
                    {att
                      ? <AttendanceBadge status={att.status} />
                      : <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Not recorded</span>
                    }
                  </div>
                </div>

                {/* Allergy warning */}
                {(child as { allergies?: string }).allergies && (
                  <div className="bg-red-50 rounded-xl px-3 py-1.5 mb-3 text-xs text-red-600">
                    ⚠️ <span className="font-700">Allergy: </span>
                    {(child as { allergies?: string }).allergies}
                  </div>
                )}

                {/* Latest report */}
                {latestReport ? (
                  <div className="bg-amber-50/70 rounded-xl p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{MOOD_MAP[latestReport.mood ?? ''] ?? '📋'}</span>
                      <div>
                        <p className="text-[11px] font-800 text-amber-700 uppercase">Latest Report</p>
                        <p className="text-[10px] text-gray-400">{fmtDate(latestReport.date)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {latestReport.note ?? latestReport.activities ?? 'Report submitted — no notes added.'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl px-3 py-2 mb-3 text-xs text-gray-400">
                    No report this week yet.
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-700 border border-gray-200 rounded-xl py-1.5 hover:border-gold hover:text-gold transition-colors"
                    onClick={() => navigate('/portal/my-children')}
                  >
                    <Baby size={12} /> Profile
                  </button>
                  <button type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-700 border border-gray-200 rounded-xl py-1.5 hover:border-gold hover:text-gold transition-colors"
                    onClick={() => navigate('/portal/reports')}
                  >
                    <BookOpen size={12} /> Reports
                  </button>
                  <button type="button"
                    title="Portfolio"
                    className="flex items-center justify-center gap-1.5 text-xs font-700 border border-gray-200 rounded-xl py-1.5 px-2.5 hover:border-gold hover:text-gold transition-colors"
                    onClick={() => navigate('/portal/portfolio')}
                  >
                    <Image size={12} />
                    <span className="sr-only">Portfolio</span>
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Home learning tip */}
      <div className="bg-gradient-to-br from-teal-soft to-gold-soft/30 rounded-2xl p-4 flex items-start gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 text-2xl shadow-sm">
          {homeTip.icon}
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-800 text-teal uppercase mb-0.5">Home Learning Tip</p>
          <p className="font-700 text-night text-sm mb-1">{homeTip.title}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{homeTip.tip}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upcoming events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <button type="button" className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/calendar')}>View Calendar</button>
          </CardHeader>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming events.</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingEvents.map(ev => {
                const d = new Date(ev.start_date)
                const isToday = fmtDate(ev.start_date) === fmtDate(new Date().toISOString())
                return (
                  <div key={ev.id} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${isToday ? 'bg-gold text-white' : 'bg-night-soft'}`}>
                      <p className={`text-[9px] font-800 uppercase ${isToday ? 'text-white/80' : 'text-night'}`}>
                        {d.toLocaleString('en', { month: 'short' })}
                      </p>
                      <p className={`text-sm font-heading font-700 leading-none ${isToday ? 'text-white' : 'text-night'}`}>
                        {d.getDate()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-700 text-night truncate">{ev.title}</p>
                      <p className="text-xs text-gray-400 capitalize">
                        {isToday ? '📌 Today · ' : ''}{ev.type?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Quick access */}
        <Card>
          <CardTitle className="mb-3">Quick Access</CardTitle>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '📋', label: 'Daily Reports',  path: '/portal/reports' },
              { icon: '✅', label: 'Attendance',      path: '/portal/attendance' },
              { icon: '💬', label: 'Messages',        path: '/portal/messages' },
              { icon: '🖼️', label: 'Portfolio',       path: '/portal/portfolio' },
              { icon: '⚠️', label: 'Incidents',       path: '/portal/incidents' },
              { icon: '📅', label: 'Calendar',        path: '/portal/calendar' },
            ].map(({ icon, label, path }) => (
              <button
                key={path}
                type="button"
                className="flex items-center gap-2 border border-gray-100 rounded-xl p-3 text-sm font-700 text-night hover:border-gold hover:bg-gold-soft/20 transition-all text-left"
                onClick={() => navigate(path)}
              >
                <span className="text-xl">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
