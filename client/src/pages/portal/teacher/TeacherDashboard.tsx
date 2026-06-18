import { useChildren } from '@/hooks/useChildren'
import { useTodayReports } from '@/hooks/useReports'
import { useTodayAttendance } from '@/hooks/useAttendance'
import { useMedications } from '@/hooks/useMedications'
import { useUpcomingEvents } from '@/hooks/useEvents'
import { useAuthStore } from '@/store/auth'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { AttendanceBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDate, fmtTime, MOOD_MAP, today } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const classroomId = user?.classroom_id ?? ''

  const { data: children = [], isLoading } = useChildren()
  const { data: todayReports = [] } = useTodayReports(classroomId)
  const { data: todayAttendance = [] } = useTodayAttendance(classroomId)
  const { data: medications = [] } = useMedications()
  const { data: upcomingEvents = [] } = useUpcomingEvents(3)

  if (isLoading) return <PageLoader />

  const myChildren = children.filter((c) => c.classroom_id === classroomId)
  const reportsNeeded = myChildren.filter(
    (c) => !todayReports.some((r) => r.child_id === c.id)
  )
  const presentToday = todayAttendance.filter((a) => a.status === 'present').length
  const pendingMeds = medications.filter((m) => m.parent_authorized)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-600 text-night">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">{fmtDate(new Date().toISOString())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Children" value={myChildren.length} icon="👶" color="teal" />
        <StatCard label="Present Today" value={presentToday} icon="✅" color="gold" />
        <StatCard label="Reports Done" value={todayReports.length} icon="📋" color="night" />
        <StatCard label="Reports Needed" value={reportsNeeded.length} icon="⏳"
          color={reportsNeeded.length > 0 ? 'coral' : 'teal'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <button className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/attendance')}>Take Roll</button>
          </CardHeader>
          {myChildren.length === 0 ? (
            <p className="text-sm text-gray-400">No children in your classroom yet.</p>
          ) : (
            <div className="space-y-2">
              {myChildren.map((child) => {
                const att = todayAttendance.find((a) => a.child_id === child.id)
                return (
                  <div key={child.id} className="flex items-center gap-2">
                    <Avatar name={child.name} size="sm" />
                    <p className="text-sm font-700 text-night flex-1">{child.name}</p>
                    {att ? <AttendanceBadge status={att.status} /> : (
                      <span className="text-xs text-amber-600 font-700">Not marked</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Reports needed */}
        <Card>
          <CardHeader>
            <CardTitle>Reports Needed Today</CardTitle>
            <button className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/reports')}>Write Reports</button>
          </CardHeader>
          {reportsNeeded.length === 0 ? (
            <p className="text-sm text-teal font-700">✓ All reports submitted!</p>
          ) : (
            <div className="space-y-2">
              {reportsNeeded.map((child) => (
                <div key={child.id} className="flex items-center gap-2">
                  <Avatar name={child.name} size="sm" />
                  <p className="text-sm font-700 text-night flex-1">{child.name}</p>
                  <span className="text-xs text-amber-600 font-700">Pending</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Medications due */}
        <Card>
          <CardHeader>
            <CardTitle>Medications</CardTitle>
            <button className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/medications')}>View All</button>
          </CardHeader>
          {pendingMeds.length === 0 ? (
            <p className="text-sm text-gray-400">No medications to administer.</p>
          ) : (
            <div className="space-y-2">
              {pendingMeds.slice(0, 4).map((med) => (
                <div key={med.id} className="flex items-start gap-2">
                  <span className="text-xl">💊</span>
                  <div>
                    <p className="text-sm font-700 text-night">{med.child?.name}</p>
                    <p className="text-xs text-gray-500">{med.name} — {med.dosage} · {med.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <button className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/calendar')}>Calendar</button>
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
                  <p className="text-sm font-700 text-night">{ev.title}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
