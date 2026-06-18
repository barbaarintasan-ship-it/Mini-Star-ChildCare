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

export default function ParentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: children = [], isLoading } = useChildren()
  const { data: recentReports = [] } = useReports({ from: (() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().slice(0, 10)
  })() })
  const { data: todayAttendance = [] } = useAttendance({ date: today() })
  const { data: upcomingEvents = [] } = useUpcomingEvents(5)
  const { data: incidents = [] } = useIncidents()

  if (isLoading) return <PageLoader />

  const openIncidents = incidents.filter((i) => i.status === 'open')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-600 text-night">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">{fmtDate(new Date().toISOString())}</p>
      </div>

      {/* Open incidents alert */}
      {openIncidents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-700 text-red-700 text-sm">Incident Report</p>
            <p className="text-xs text-red-600">
              There is {openIncidents.length} open incident report. Tap to view.
            </p>
          </div>
          <button className="ml-auto text-xs text-red-600 font-700 underline"
            onClick={() => navigate('/portal/incidents')}>View</button>
        </div>
      )}

      {/* My children */}
      {children.length === 0 ? (
        <EmptyState icon="👶" title="No children linked"
          message="Ask the admin to link your children to your account." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {children.map((child) => {
            const att = todayAttendance.find((a) => a.child_id === child.id)
            const latestReport = recentReports.find((r) => r.child_id === child.id)
            return (
              <Card key={child.id}>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={child.name} url={child.photo_url} size="lg" />
                  <div>
                    <p className="font-700 text-night">{child.name}</p>
                    <p className="text-xs text-gray-400">{childAge(child.dob)} · {child.classroom?.name}</p>
                  </div>
                </div>

                {/* Today's status */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-700 text-gray-500">Today:</span>
                  {att ? <AttendanceBadge status={att.status} /> : (
                    <span className="text-xs text-gray-400">No attendance yet</span>
                  )}
                </div>

                {/* Latest report snippet */}
                {latestReport && (
                  <div className="bg-gold-soft/30 rounded-xl p-3 text-xs">
                    <p className="font-700 text-night mb-1">
                      Latest Report {MOOD_MAP[latestReport.mood ?? ''] ?? ''} — {fmtDate(latestReport.date)}
                    </p>
                    <p className="text-gray-600 line-clamp-2">{latestReport.note ?? latestReport.activities ?? 'No notes'}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button className="btn-outline btn btn-sm flex-1"
                    onClick={() => navigate('/portal/reports')}>
                    Reports
                  </button>
                  <button className="btn-ghost btn btn-sm"
                    onClick={() => navigate('/portal/portfolio')}>
                    Portfolio
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <button className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/calendar')}>View Calendar</button>
          </CardHeader>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming events.</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-night-soft rounded-xl flex flex-col items-center justify-center shrink-0">
                    <p className="text-[10px] font-800 text-night uppercase">
                      {new Date(ev.start_date).toLocaleString('en', { month: 'short' })}
                    </p>
                    <p className="text-sm font-heading font-600 text-night leading-none">
                      {new Date(ev.start_date).getDate()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-700 text-night">{ev.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{ev.type?.replace('_',' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick links */}
        <Card>
          <CardTitle className="mb-4">Quick Access</CardTitle>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '📋', label: 'Daily Reports', path: '/portal/reports' },
              { icon: '✅', label: 'Attendance',    path: '/portal/attendance' },
              { icon: '💬', label: 'Messages',      path: '/portal/messages' },
              { icon: '🖼️', label: 'Portfolio',     path: '/portal/portfolio' },
              { icon: '⚠️', label: 'Incidents',     path: '/portal/incidents' },
              { icon: '📅', label: 'Calendar',      path: '/portal/calendar' },
            ].map(({ icon, label, path }) => (
              <button
                key={path}
                className="card hover:shadow-card-hover transition-shadow flex items-center gap-2 text-sm font-700 text-night p-3 text-left"
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
