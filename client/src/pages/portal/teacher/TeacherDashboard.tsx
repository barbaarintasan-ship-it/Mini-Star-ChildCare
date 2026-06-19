import { useChildren } from '@/hooks/useChildren'
import { useTodayReports } from '@/hooks/useReports'
import { useTodayAttendance } from '@/hooks/useAttendance'
import { useMedications } from '@/hooks/useMedications'
import { useUpcomingEvents } from '@/hooks/useEvents'
import { useLessonPlan } from '@/hooks/useCurriculum'
import { useAuthStore } from '@/store/auth'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { AttendanceBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDate, MOOD_MAP, today } from '@/lib/utils'
import { CURR_CATS } from '@/data/curriculum'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, ChevronRight, CheckCircle2, AlertCircle, Pill } from 'lucide-react'

// Deterministic daily teacher tip based on day-of-week
const TEACHER_TIPS = [
  {
    title: 'Morning Meeting Magic',
    tip: 'Start with a feelings check-in circle. Ask each child to show their mood with a gesture — this builds emotional vocabulary and sets a calm tone for the day.',
    icon: '🌅',
  },
  {
    title: 'Language-Rich Environment',
    tip: 'Narrate everything you do. "I\'m pouring water into the blue cup" — this dramatically boosts receptive vocabulary in children under 5.',
    icon: '🗣️',
  },
  {
    title: 'Sensory Play Moment',
    tip: 'Take 10 minutes for unstructured sensory play today — sand, playdough, or water. Sensory input is critical for brain development and self-regulation.',
    icon: '✋',
  },
  {
    title: 'Outdoor Learning',
    tip: 'Nature walks build scientific thinking. Ask "What do you notice? What do you wonder?" Resist the urge to answer immediately — let them explore.',
    icon: '🌿',
  },
  {
    title: 'Documentation Tip',
    tip: 'Take a quick photo of a child\'s work or a meaningful moment today and add it to their Portfolio. Parents treasure these glimpses into their child\'s day.',
    icon: '📸',
  },
  {
    title: 'Positive Reinforcement',
    tip: 'Catch children being kind! Name the specific behaviour: "I saw you help Amina pick up her blocks — that was thoughtful." Specificity makes praise powerful.',
    icon: '⭐',
  },
  {
    title: 'Transition Strategy',
    tip: 'Give 5-minute and 2-minute warnings before transitions. Children\'s brains need time to shift focus — this reduces meltdowns by up to 60%.',
    icon: '⏱️',
  },
]

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const classroomId = user?.classroom_id ?? ''

  const { data: children = [], isLoading } = useChildren()
  const { data: todayReports = [] } = useTodayReports(classroomId)
  const { data: todayAttendance = [] } = useTodayAttendance(classroomId)
  const { data: medications = [] } = useMedications()
  const { data: upcomingEvents = [] } = useUpcomingEvents(3)
  const { data: lessonPlan } = useLessonPlan(classroomId || undefined, today())

  if (isLoading) return <PageLoader />

  const myChildren = children.filter(c => c.classroom_id === classroomId)
  const reportsNeeded = myChildren.filter(c => !todayReports.some(r => r.child_id === c.id))
  const presentToday = todayAttendance.filter(a => a.status === 'present').length
  const pendingMeds = medications.filter(m => m.parent_authorized)

  // Daily teacher tip (changes each day)
  const tipIndex = new Date().getDay()
  const tip = TEACHER_TIPS[tipIndex]

  // Today's plan domain progress
  const completedActivities = lessonPlan?.activities?.filter(a => a.status === 'completed').length ?? 0
  const totalActivities = lessonPlan?.activities?.length ?? 0

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-600 text-night">
          {greeting}, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">{fmtDate(new Date().toISOString())}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Class" value={myChildren.length} icon="👶" color="teal"
          sub={`${presentToday} present today`} />
        <StatCard label="Reports Done" value={todayReports.length} icon="📋" color="gold"
          sub={reportsNeeded.length > 0 ? `${reportsNeeded.length} still needed` : 'All done!'} />
        <StatCard label="Activities" value={`${completedActivities}/${totalActivities}`} icon="📚" color="night"
          sub={totalActivities > 0 ? 'Today\'s plan' : 'Generate a plan'} />
        <StatCard label="Medications" value={pendingMeds.length} icon="💊"
          color={pendingMeds.length > 0 ? 'coral' : 'teal'}
          sub={pendingMeds.length > 0 ? 'Need attention' : 'None today'} />
      </div>

      {/* Teacher coaching tip */}
      <div className="bg-gradient-to-r from-teal-soft to-night-soft rounded-2xl p-4 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 text-xl">
          {tip.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb size={13} className="text-gold" />
            <p className="text-[11px] font-800 text-gold uppercase">Coaching Tip for Today</p>
          </div>
          <p className="font-700 text-night text-sm mb-1">{tip.title}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{tip.tip}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Attendance + reports quick view */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Class</CardTitle>
            <div className="flex gap-3">
              <button type="button" className="text-xs text-gold font-700 hover:underline"
                onClick={() => navigate('/portal/attendance')}>Attendance</button>
              <button type="button" className="text-xs text-gold font-700 hover:underline"
                onClick={() => navigate('/portal/reports')}>Reports</button>
            </div>
          </CardHeader>
          {myChildren.length === 0 ? (
            <p className="text-sm text-gray-400">No children in your classroom yet.</p>
          ) : (
            <div className="space-y-2">
              {myChildren.map(child => {
                const att = todayAttendance.find(a => a.child_id === child.id)
                const hasReport = todayReports.some(r => r.child_id === child.id)
                return (
                  <div key={child.id} className="flex items-center gap-2.5">
                    <Avatar name={child.name} size="sm" />
                    <p className="text-sm font-700 text-night flex-1 truncate">{child.name}</p>
                    <div className="flex items-center gap-1.5">
                      {att ? <AttendanceBadge status={att.status} /> : (
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">No att.</span>
                      )}
                      {hasReport
                        ? <span title="Report done"><CheckCircle2 size={13} className="text-teal" /></span>
                        : <span title="Report needed"><AlertCircle size={13} className="text-amber-400" /></span>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Today's lesson plan preview */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Lesson Plan</CardTitle>
            <button type="button" className="text-xs text-gold font-700 hover:underline flex items-center gap-1"
              onClick={() => navigate('/portal/curriculum')}>
              Full Plan <ChevronRight size={11} />
            </button>
          </CardHeader>
          {!lessonPlan ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400 mb-3">No plan generated yet.</p>
              <button type="button"
                className="text-xs font-700 text-teal border border-teal/30 bg-teal-soft/40 px-3 py-1.5 rounded-xl hover:bg-teal-soft transition-colors"
                onClick={() => navigate('/portal/curriculum')}
              >
                Generate Today's Plan
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {lessonPlan.activities.slice(0, 5).map((act, i) => {
                const cat = CURR_CATS.find(c => c.id === act.catId)
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-base shrink-0">{cat?.icon ?? '📌'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-700 text-night truncate">{act.activityId}</p>
                      <p className="text-[10px] text-gray-400">{cat?.label}</p>
                    </div>
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${
                      act.status === 'completed' ? 'bg-teal-soft text-teal' :
                      act.status === 'partial'   ? 'bg-amber-50 text-amber-600' :
                      act.status === 'skipped'   ? 'bg-gray-100 text-gray-400' :
                      'bg-night-soft text-night'
                    }`}>
                      {act.status === 'pending' ? 'Planned' : act.status}
                    </span>
                  </div>
                )
              })}
              {lessonPlan.activities.length > 5 && (
                <p className="text-xs text-gray-400">+{lessonPlan.activities.length - 5} more activities</p>
              )}
            </div>
          )}
        </Card>

        {/* Medications */}
        {pendingMeds.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Medications Due</CardTitle>
              <button type="button" className="text-xs text-gold font-700 hover:underline"
                onClick={() => navigate('/portal/medications')}>Log Dose</button>
            </CardHeader>
            <div className="space-y-2">
              {pendingMeds.slice(0, 4).map(med => (
                <div key={med.id} className="flex items-start gap-2.5">
                  <Pill size={15} className="text-purple-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-700 text-night">{med.child?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{med.name} · {med.dosage}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Upcoming events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <button type="button" className="text-xs text-gold font-700 hover:underline"
              onClick={() => navigate('/portal/calendar')}>Calendar</button>
          </CardHeader>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming events.</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map(ev => (
                <div key={ev.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-night-soft rounded-xl flex flex-col items-center justify-center shrink-0">
                    <p className="text-[9px] font-800 text-night uppercase">
                      {new Date(ev.start_date).toLocaleString('en', { month: 'short' })}
                    </p>
                    <p className="text-sm font-heading font-600 text-night leading-none">
                      {new Date(ev.start_date).getDate()}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-700 text-night truncate">{ev.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{ev.type?.replace('_', ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
