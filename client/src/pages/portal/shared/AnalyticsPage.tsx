/**
 * Analytics & Summary Reports — Admin + Teacher
 * Shows attendance trends, report rates, incident summary, and classroom metrics.
 */
import { useState, useMemo } from 'react'
import { useAttendance } from '@/hooks/useAttendance'
import { useReports } from '@/hooks/useReports'
import { useIncidents } from '@/hooks/useIncidents'
import { useChildren } from '@/hooks/useChildren'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useAuthStore } from '@/store/auth'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { ATTENDANCE_CONFIG, fmtDate } from '@/lib/utils'

// ── Helpers ────────────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
}

// ── Mini sparkline bar chart ───────────────────────────────────
function SparkBars({ data, color = '#4ECDC4' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm min-h-[2px] transition-all"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.7 + (i / data.length) * 0.3 }}
          title={String(v)}
        />
      ))}
    </div>
  )
}

// ── Stat pill ─────────────────────────────────────────────────
function Stat({ label, value, sub, color = 'text-night' }: {
  label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="text-center px-4 py-3 bg-gray-50 rounded-xl">
      <p className={`text-2xl font-heading font-700 ${color}`}>{value}</p>
      <p className="text-xs font-700 text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────
export default function AnalyticsPage() {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const [range, setRange] = useState<7 | 14 | 30>(14)

  const from = daysAgo(range)
  const to = new Date().toISOString().slice(0, 10)

  const { data: attendance = [], isLoading: loadAtt } = useAttendance({ from, to })
  const { data: reports = [], isLoading: loadRep } = useReports({ from, to })
  const { data: incidents = [] } = useIncidents()
  const { data: children = [] } = useChildren()
  const { data: classrooms = [] } = useClassrooms()

  const loading = loadAtt || loadRep

  // Build daily attendance stats for last N days
  const days = useMemo(() => {
    const result: { date: string; present: number; absent: number; total: number }[] = []
    for (let i = range - 1; i >= 0; i--) {
      const date = daysAgo(i)
      const dayAtt = attendance.filter(a => a.date === date)
      result.push({
        date,
        present: dayAtt.filter(a => a.status === 'present').length,
        absent: dayAtt.filter(a => a.status === 'absent').length,
        total: dayAtt.length,
      })
    }
    return result
  }, [attendance, range])

  // Overall attendance stats for range
  const totalPresent = attendance.filter(a => a.status === 'present').length
  const totalAbsent  = attendance.filter(a => a.status === 'absent').length
  const totalLate    = attendance.filter(a => a.status === 'late').length
  const totalRecorded = attendance.length
  const attendancePct = totalRecorded > 0 ? Math.round((totalPresent / totalRecorded) * 100) : 0

  // Reports stats
  const reportsPerDay = useMemo(() => {
    const m: Record<string, number> = {}
    reports.forEach(r => { m[r.date] = (m[r.date] ?? 0) + 1 })
    return days.map(d => m[d.date] ?? 0)
  }, [reports, days])

  const reportsTotal = reports.length
  const reportsAvgPerDay = days.length > 0 ? (reportsTotal / days.length).toFixed(1) : '0'

  // Incidents
  const incidentsInRange = incidents.filter(i => i.date >= from)
  const openIncidents    = incidentsInRange.filter(i => i.status === 'open').length
  const severeIncidents  = incidentsInRange.filter(i => i.severity === 'severe').length

  // Attendance breakdown by status
  const statusCounts: Record<string, number> = {}
  attendance.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] ?? 0) + 1 })

  // Per-classroom stats (admin only)
  const classroomStats = classrooms.map(cls => {
    const classAtt = attendance.filter(a => {
      const child = children.find(c => c.id === a.child_id)
      return child?.classroom_id === cls.id
    })
    const present = classAtt.filter(a => a.status === 'present').length
    const pct = classAtt.length > 0 ? Math.round((present / classAtt.length) * 100) : 0
    const enrolled = children.filter(c => c.classroom_id === cls.id).length
    return { ...cls, present, total: classAtt.length, pct, enrolled }
  }).sort((a, b) => b.pct - a.pct)

  // Mood breakdown from reports
  const moodCounts: Record<string, number> = {}
  reports.forEach(r => { if (r.mood) moodCounts[r.mood] = (moodCounts[r.mood] ?? 0) + 1 })
  const MOOD_LABELS: Record<string, string> = {
    happy: '😊 Happy', good: '🙂 Good', okay: '😐 Okay',
    tired: '😴 Tired', fussy: '😤 Fussy', sick: '🤒 Sick',
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl font-600 text-night">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {formatDay(from)} — {formatDay(to)}
          </p>
        </div>
        {/* Range selector */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {([7, 14, 30] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-700 transition-colors ${
                range === r ? 'bg-white text-night shadow-sm' : 'text-gray-500 hover:text-night'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Attendance summary stats */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <span className="text-xs text-gray-400">Last {range} days</span>
        </CardHeader>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <Stat label="Attendance Rate" value={`${attendancePct}%`}
            color={attendancePct >= 80 ? 'text-teal' : attendancePct >= 60 ? 'text-amber-500' : 'text-red-500'} />
          <Stat label="Present" value={totalPresent} color="text-teal" />
          <Stat label="Absent" value={totalAbsent} color="text-red-500" />
          <Stat label="Late" value={totalLate} color="text-amber-500"
            sub={`${totalRecorded} total records`} />
        </div>

        {/* Attendance daily bar chart */}
        <div>
          <p className="text-[11px] font-800 text-gray-400 uppercase mb-2">Daily Present</p>
          <SparkBars data={days.map(d => d.present)} color="#4ECDC4" />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">{formatDay(days[0]?.date ?? from)}</span>
            <span className="text-[10px] text-gray-400">{formatDay(days[days.length - 1]?.date ?? to)}</span>
          </div>
        </div>

        {/* Status breakdown */}
        {totalRecorded > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-800 text-gray-400 uppercase mb-2">Breakdown</p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(ATTENDANCE_CONFIG).map(([status, cfg]) => {
                const count = statusCounts[status] ?? 0
                if (count === 0) return null
                const pct = Math.round((count / totalRecorded) * 100)
                const barColors: Record<string, string> = {
                  present: 'bg-teal', absent: 'bg-red-400', late: 'bg-amber-400',
                  early_pickup: 'bg-purple-400', excused: 'bg-gray-400',
                }
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-xs font-700 text-gray-600 w-24 shrink-0">{cfg.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColors[status]}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-700 text-gray-500 w-12 text-right">{count} ({pct}%)</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Reports analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Reports</CardTitle>
            <span className="text-xs text-gray-400">Last {range} days</span>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Stat label="Total Reports" value={reportsTotal} />
            <Stat label="Avg Per Day" value={reportsAvgPerDay} />
          </div>
          <div>
            <p className="text-[11px] font-800 text-gray-400 uppercase mb-2">Reports Per Day</p>
            <SparkBars data={reportsPerDay} color="#FFD700" />
          </div>
          {Object.keys(moodCounts).length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-800 text-gray-400 uppercase mb-2">Mood Breakdown</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(moodCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([mood, count]) => (
                    <div key={mood} className="bg-gray-50 rounded-xl px-3 py-1.5 text-xs font-700 text-gray-600">
                      {MOOD_LABELS[mood] ?? mood}: <span className="text-night">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Card>

        {/* Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents</CardTitle>
            <span className="text-xs text-gray-400">Last {range} days</span>
          </CardHeader>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Stat label="Total" value={incidentsInRange.length} />
            <Stat label="Open" value={openIncidents}
              color={openIncidents > 0 ? 'text-amber-500' : 'text-teal'} />
            <Stat label="Severe" value={severeIncidents}
              color={severeIncidents > 0 ? 'text-red-500' : 'text-teal'} />
          </div>
          {incidentsInRange.length === 0 ? (
            <div className="text-center py-4">
              <span className="text-3xl">✅</span>
              <p className="text-sm text-gray-400 mt-2">No incidents in this period.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {incidentsInRange.slice(0, 5).map(inc => (
                <div key={inc.id} className="flex items-start gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-700 shrink-0 ${
                    inc.severity === 'severe'   ? 'bg-red-100 text-red-600' :
                    inc.severity === 'moderate' ? 'bg-amber-100 text-amber-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {inc.severity ?? 'minor'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-700 text-night truncate">{inc.child?.name ?? 'Unknown'}</p>
                    <p className="text-gray-500 truncate">{inc.description}</p>
                  </div>
                  <span className="text-gray-400 shrink-0">{fmtDate(inc.date)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Per-classroom attendance (admin only) */}
      {isAdmin && classroomStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Classroom Attendance Rates</CardTitle>
            <span className="text-xs text-gray-400">Last {range} days</span>
          </CardHeader>
          <div className="space-y-3">
            {classroomStats.map(cls => (
              <div key={cls.id} className="flex items-center gap-4">
                <div className="w-28 shrink-0">
                  <p className="text-sm font-700 text-night truncate">{cls.name}</p>
                  <p className="text-[10px] text-gray-400">{cls.enrolled} enrolled</p>
                </div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${cls.pct}%`,
                      backgroundColor: cls.pct >= 80 ? '#4ECDC4' : cls.pct >= 60 ? '#FFD700' : '#FF7960',
                    }}
                  />
                </div>
                <span className={`text-sm font-700 w-12 text-right shrink-0 ${
                  cls.pct >= 80 ? 'text-teal' : cls.pct >= 60 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {cls.pct}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
