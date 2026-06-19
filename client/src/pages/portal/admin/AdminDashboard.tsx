import { useChildren } from '@/hooks/useChildren'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useStaff, useParents } from '@/hooks/useStaff'
import { useTodayReports } from '@/hooks/useReports'
import { useTodayAttendance } from '@/hooks/useAttendance'
import { useEnrollments } from '@/hooks/useEnrollments'
import { useUpcomingEvents } from '@/hooks/useEvents'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, AttendanceBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDate, MOOD_MAP, ATTENDANCE_CONFIG } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, ChevronRight } from 'lucide-react'

// Mini horizontal bar chart for attendance breakdown
function AttendanceBar({ attendance }: { attendance: { status: string }[] }) {
  const total = attendance.length
  if (total === 0) return <p className="text-sm text-gray-400">No attendance today.</p>

  const counts: Record<string, number> = {}
  attendance.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })

  const COLORS: Record<string, string> = {
    present:       '#4ECDC4',
    absent:        '#FF7960',
    late:          '#FFD700',
    early_pickup:  '#A78BFA',
    excused:       '#6B7280',
  }

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="h-3 rounded-full overflow-hidden flex">
        {Object.entries(ATTENDANCE_CONFIG).map(([status, cfg]) => {
          const count = counts[status] ?? 0
          if (count === 0) return null
          const pct = (count / total) * 100
          return (
            <div
              key={status}
              style={{ width: `${pct}%`, backgroundColor: COLORS[status] ?? '#ccc' }}
              title={`${cfg.label}: ${count}`}
            />
          )
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(ATTENDANCE_CONFIG).map(([status, cfg]) => {
          const count = counts[status] ?? 0
          if (count === 0) return null
          return (
            <span key={status} className="flex items-center gap-1 text-[11px] font-700 text-gray-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[status] ?? '#ccc' }} />
              {cfg.label}: {count}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// Classroom capacity ring
function ClassroomRing({ name, enrolled, capacity }: { name: string; enrolled: number; capacity: number }) {
  const pct = Math.min(100, Math.round((enrolled / Math.max(1, capacity)) * 100))
  const r = 14
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const color = pct > 90 ? '#FF7960' : pct > 70 ? '#FFD700' : '#4ECDC4'

  return (
    <div className="flex items-center gap-3">
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#f0f0f0" strokeWidth="3.5" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 18 18)" />
        <text x="18" y="22" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#1a1a2e">{pct}%</text>
      </svg>
      <div className="min-w-0">
        <p className="text-sm font-700 text-night truncate">{name}</p>
        <p className="text-xs text-gray-400">{enrolled} / {capacity} children</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { data: children = [], isLoading } = useChildren()
  const { data: classrooms = [] } = useClassrooms()
  const { data: staff = [] } = useStaff()
  const { data: parents = [] } = useParents()
  const { data: todayReports = [] } = useTodayReports()
  const { data: todayAttendance = [] } = useTodayAttendance()
  const { data: pendingEnrollments = [] } = useEnrollments('pending')
  const { data: upcomingEvents = [] } = useUpcomingEvents(4)

  if (isLoading) return <PageLoader />

  const teachers = staff.filter(s => s.role === 'teacher')
  const presentToday = todayAttendance.filter(a => a.status === 'present').length
  const abscentToday = todayAttendance.filter(a => a.status === 'absent').length
  const attendancePct = todayAttendance.length
    ? Math.round((presentToday / todayAttendance.length) * 100) : 0

  // Classrooms with child counts
  const classroomStats = classrooms.map(cls => ({
    ...cls,
    enrolled: children.filter(c => c.classroom_id === cls.id).length,
  }))

  // Reports needed: children with no report today
  const reportedChildIds = new Set(todayReports.map(r => r.child_id))
  const needsReport = children.filter(c => !reportedChildIds.has(c.id)).length

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
          <h1 className="font-heading text-2xl font-600 text-night">{greeting}!</h1>
          <p className="text-sm text-gray-400 mt-0.5">{fmtDate(new Date().toISOString())} · Centre Overview</p>
        </div>
        {pendingEnrollments.length > 0 && (
          <button
            type="button"
            onClick={() => navigate('/portal/enrollments')}
            className="flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-xl px-3 py-2 text-xs font-700 text-amber-700 hover:bg-gold/20 transition-colors"
          >
            <AlertTriangle size={13} />
            {pendingEnrollments.length} pending enrollment{pendingEnrollments.length > 1 ? 's' : ''}
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enrolled Children" value={children.length} icon="👶" color="teal"
          sub={`${classrooms.length} classroom${classrooms.length !== 1 ? 's' : ''}`} />
        <StatCard label="Present Today" value={presentToday} icon="✅" color="teal"
          sub={todayAttendance.length > 0 ? `${attendancePct}% attendance rate` : 'Not recorded yet'} />
        <StatCard label="Reports Today" value={todayReports.length} icon="📋" color="gold"
          sub={needsReport > 0 ? `${needsReport} still needed` : 'All done!'} />
        <StatCard label="Staff" value={teachers.length} icon="🎓" color="night"
          sub={`${parents.length} parent account${parents.length !== 1 ? 's' : ''}`} />
      </div>

      {/* Attendance bar + classroom capacity */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance Breakdown</CardTitle>
            <button className="text-xs text-gold font-700 hover:underline" onClick={() => navigate('/portal/attendance')}>
              Mark attendance
            </button>
          </CardHeader>
          <AttendanceBar attendance={todayAttendance} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classroom Capacity</CardTitle>
            <button className="text-xs text-gold font-700 hover:underline" onClick={() => navigate('/portal/children')}>
              Manage
            </button>
          </CardHeader>
          <div className="space-y-3">
            {classroomStats.length === 0 ? (
              <p className="text-sm text-gray-400">No classrooms set up yet.</p>
            ) : (
              classroomStats.map(cls => (
                <ClassroomRing key={cls.id} name={cls.name} enrolled={cls.enrolled} capacity={cls.capacity ?? 15} />
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Today's reports */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Reports</CardTitle>
            <button className="text-xs text-gold font-700 hover:underline" onClick={() => navigate('/portal/reports')}>
              View all
            </button>
          </CardHeader>
          {todayReports.length === 0 ? (
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Clock size={14} />
              No reports submitted today yet.
            </div>
          ) : (
            <div className="space-y-3">
              {todayReports.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center gap-3">
                  <Avatar name={r.child?.name ?? '?'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-700 text-night">{r.child?.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {r.mood ? (MOOD_MAP[r.mood] + ' ') : ''}{r.note ?? r.activities ?? 'Report submitted'}
                    </p>
                  </div>
                  <CheckCircle2 size={14} className="text-teal shrink-0" />
                </div>
              ))}
              {todayReports.length > 5 && (
                <p className="text-xs text-gray-400">+{todayReports.length - 5} more reports</p>
              )}
            </div>
          )}
        </Card>

        {/* Upcoming events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <button className="text-xs text-gold font-700 hover:underline" onClick={() => navigate('/portal/calendar')}>
              Calendar
            </button>
          </CardHeader>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming events.</p>
          ) : (
            <div className="space-y-3">
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
      </div>

      {/* Quick actions */}
      <Card>
        <CardTitle className="mb-3">Quick Actions</CardTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { label: 'New Enrollment', path: '/portal/enrollments', icon: '📝', desc: 'Review requests' },
            { label: 'Add Child', path: '/portal/children', icon: '👶', desc: 'Register new child' },
            { label: 'Add Staff', path: '/portal/staff', icon: '🎓', desc: 'Create staff account' },
            { label: 'Daily Reports', path: '/portal/reports', icon: '📋', desc: "Today's summaries" },
            { label: 'Calendar', path: '/portal/calendar', icon: '📅', desc: 'Add an event' },
          ].map(item => (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center text-center p-3 rounded-xl border border-gray-100 hover:border-gold hover:bg-gold-soft/20 transition-all gap-1.5"
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs font-700 text-night">{item.label}</p>
              <p className="text-[10px] text-gray-400">{item.desc}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
