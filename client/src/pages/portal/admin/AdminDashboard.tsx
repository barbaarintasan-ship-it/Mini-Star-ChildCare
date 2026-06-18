import { useChildren } from '@/hooks/useChildren'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useStaff, useParents } from '@/hooks/useStaff'
import { useTodayReports } from '@/hooks/useReports'
import { useTodayAttendance } from '@/hooks/useAttendance'
import { useEnrollments } from '@/hooks/useEnrollments'
import { useUpcomingEvents } from '@/hooks/useEvents'
import { useMessages } from '@/hooks/useMessages'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, AttendanceBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDate, fmtDateTime, MOOD_MAP } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { data: children = [], isLoading: loadingChildren } = useChildren()
  const { data: classrooms = [] } = useClassrooms()
  const { data: staff = [] } = useStaff()
  const { data: parents = [] } = useParents()
  const { data: todayReports = [] } = useTodayReports()
  const { data: todayAttendance = [] } = useTodayAttendance()
  const { data: pendingEnrollments = [] } = useEnrollments('pending')
  const { data: upcomingEvents = [] } = useUpcomingEvents(3)
  const { data: messages = [] } = useMessages()

  if (loadingChildren) return <PageLoader />

  const unreadMessages = messages.filter((m) => !m.read).length
  const presentToday = todayAttendance.filter((a) => a.status === 'present').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-600 text-night">Admin Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">{fmtDate(new Date().toISOString())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Children" value={children.length} icon="👶" color="teal" />
        <StatCard label="Teachers" value={staff.filter(s => s.role === 'teacher').length} icon="🎓" color="night" />
        <StatCard label="Parents" value={parents.length} icon="👨‍👩‍👧" color="gold" />
        <StatCard label="Classrooms" value={classrooms.length} icon="🏫" color="coral" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today Present" value={presentToday} icon="✅" color="teal" />
        <StatCard label="Today Reports" value={todayReports.length} icon="📋" color="gold" />
        <StatCard label="Unread Messages" value={unreadMessages} icon="💬" color="coral" />
        <div
          className="card border-t-4 border-t-night cursor-pointer hover:shadow-card-hover transition-shadow"
          onClick={() => navigate('/portal/enrollments')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-800 text-gray-400 uppercase tracking-wide">Pending Enrollments</p>
              <p className="text-3xl font-heading font-600 text-night mt-1">{pendingEnrollments.length}</p>
            </div>
            <span className="text-3xl opacity-60">📝</span>
          </div>
          {pendingEnrollments.length > 0 && (
            <p className="text-xs text-gold font-700 mt-1">Needs review →</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent reports */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Reports</CardTitle>
            <button
              className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/reports')}
            >
              View all
            </button>
          </CardHeader>
          {todayReports.length === 0 ? (
            <p className="text-sm text-gray-400">No reports submitted today yet.</p>
          ) : (
            <div className="space-y-3">
              {todayReports.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-start gap-3">
                  <Avatar name={r.child?.name ?? '?'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-700 text-night">{r.child?.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {r.mood && MOOD_MAP[r.mood]} {r.note ?? 'No notes'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">{r.teacher?.name}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Attendance overview */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <button
              className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/attendance')}
            >
              View all
            </button>
          </CardHeader>
          {todayAttendance.length === 0 ? (
            <p className="text-sm text-gray-400">No attendance recorded today yet.</p>
          ) : (
            <div className="space-y-2">
              {todayAttendance.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <Avatar name={a.child?.name ?? '?'} size="sm" />
                  <p className="text-sm font-700 text-night flex-1">{a.child?.name}</p>
                  <AttendanceBadge status={a.status} />
                </div>
              ))}
              {todayAttendance.length > 5 && (
                <p className="text-xs text-gray-400 mt-1">+{todayAttendance.length - 5} more</p>
              )}
            </div>
          )}
        </Card>

        {/* Upcoming events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <button
              className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/calendar')}
            >
              Calendar
            </button>
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
                    <p className="text-xs text-gray-400 capitalize">{ev.type?.replace('_', ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick guide */}
        <Card>
          <CardTitle className="mb-3">Quick Guide</CardTitle>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              ['Staff', 'Add teachers and assign each a classroom.'],
              ['Children', 'Add children and link them to parents.'],
              ['Enrollments', 'Review and approve enrollment requests.'],
              ['Reports', 'View all teacher daily reports.'],
              ['Messages', 'Monitor all parent-teacher messages.'],
            ].map(([title, desc]) => (
              <li key={title} className="flex items-start gap-2">
                <span className="text-gold mt-0.5">★</span>
                <span><strong>{title}</strong> — {desc}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
