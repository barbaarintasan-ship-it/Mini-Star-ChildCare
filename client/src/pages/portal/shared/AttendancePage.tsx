/**
 * Shared Attendance page — used by Admin, Teacher, and Parent.
 * The role-based data filtering is handled in useAttendance hook.
 */
import { useState } from 'react'
import { useAttendance, useUpsertAttendance, useBulkAttendance } from '@/hooks/useAttendance'
import { useChildren } from '@/hooks/useChildren'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useAuthStore } from '@/store/auth'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AttendanceBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { today, fmtDate, fmtTime, ATTENDANCE_CONFIG } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AttendanceStatus } from '@/types'

export default function AttendancePage() {
  const { user } = useAuthStore()
  const isStaff = user?.role === 'admin' || user?.role === 'teacher'

  const [date, setDate] = useState(today())
  const [classFilter, setClassFilter] = useState(
    user?.role === 'teacher' ? user.classroom_id ?? '' : ''
  )

  const { data: attendance = [], isLoading } = useAttendance({
    date,
    classroomId: classFilter || undefined,
  })
  const { data: children = [] } = useChildren()
  const { data: classrooms = [] } = useClassrooms()
  const upsert = useUpsertAttendance()
  const bulkSave = useBulkAttendance()

  // Children in the selected classroom (for teachers taking roll)
  const classChildren = children.filter((c) =>
    classFilter ? c.classroom_id === classFilter : true
  )

  function prevDay() {
    const d = new Date(date)
    d.setDate(d.getDate() - 1)
    setDate(d.toISOString().slice(0, 10))
  }
  function nextDay() {
    const d = new Date(date)
    d.setDate(d.getDate() + 1)
    setDate(d.toISOString().slice(0, 10))
  }

  async function markAll(status: AttendanceStatus) {
    if (!classFilter) return
    const records = classChildren.map((c) => ({
      child_id: c.id,
      classroom_id: classFilter,
      date,
      status,
    }))
    await bulkSave.mutateAsync(records)
  }

  if (isLoading) return <PageLoader />

  // Group attendance by child for display
  const attendanceMap = new Map(attendance.map((a) => [a.child_id, a]))

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-600 text-night">Attendance</h1>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date picker */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={prevDay}><ChevronLeft size={16} /></Button>
          <input
            type="date"
            className="input w-36 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Button variant="ghost" size="sm" onClick={nextDay}><ChevronRight size={16} /></Button>
        </div>

        {/* Classroom filter (admin) */}
        {user?.role === 'admin' && (
          <select
            className="input w-40"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">All Classrooms</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}

        {/* Bulk mark (staff only) */}
        {isStaff && classFilter && (
          <div className="flex gap-2">
            <Button variant="teal" size="sm" onClick={() => markAll('present')} loading={bulkSave.isPending}>
              Mark All Present
            </Button>
            <Button variant="outline" size="sm" onClick={() => markAll('absent')}>
              Mark All Absent
            </Button>
          </div>
        )}
      </div>

      {/* Summary stats */}
      {attendance.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {Object.entries(ATTENDANCE_CONFIG).map(([status, cfg]) => {
            const count = attendance.filter((a) => a.status === status).length
            if (count === 0) return null
            return (
              <div key={status} className={`px-3 py-1.5 rounded-xl text-xs font-700 ${cfg.bg} ${cfg.color}`}>
                {cfg.label}: {count}
              </div>
            )
          })}
        </div>
      )}

      {/* Attendance list */}
      {isStaff && classFilter ? (
        // Teacher/admin: show all children in classroom with quick mark
        <div className="space-y-2">
          {classChildren.length === 0 ? (
            <EmptyState icon="👶" title="No children in this classroom" />
          ) : (
            classChildren.map((child) => {
              const record = attendanceMap.get(child.id)
              return (
                <Card key={child.id}>
                  <div className="flex items-center gap-3">
                    <Avatar name={child.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-700 text-night text-sm">{child.name}</p>
                      {record && (
                        <p className="text-xs text-gray-400">
                          In: {fmtTime(record.check_in)} · Out: {fmtTime(record.check_out)}
                        </p>
                      )}
                    </div>
                    {/* Quick status buttons */}
                    <div className="flex flex-wrap gap-1 justify-end max-w-[160px] sm:max-w-none">
                      {(['present','absent','late','early_pickup','excused'] as AttendanceStatus[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`px-2 py-1 rounded-lg text-[10px] font-700 transition-colors border whitespace-nowrap
                            ${record?.status === s
                              ? 'bg-night text-white border-night'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-night hover:text-night'
                            }`}
                          onClick={() =>
                            upsert.mutate({
                              child_id: child.id,
                              classroom_id: classFilter,
                              date,
                              status: s,
                            })
                          }
                        >
                          {ATTENDANCE_CONFIG[s].label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      ) : (
        // Parent or no classroom filter: read-only list
        attendance.length === 0 ? (
          <EmptyState icon="📋" title="No attendance for this date" message="No records found." />
        ) : (
          <div className="space-y-2">
            {attendance.map((a) => (
              <Card key={a.id}>
                <div className="flex items-center gap-3">
                  <Avatar name={a.child?.name ?? '?'} size="md" />
                  <div className="flex-1">
                    <p className="font-700 text-night text-sm">{a.child?.name}</p>
                    <p className="text-xs text-gray-400">
                      In: {fmtTime(a.check_in)} · Out: {fmtTime(a.check_out)}
                    </p>
                  </div>
                  <AttendanceBadge status={a.status} />
                </div>
                {a.notes && <p className="text-xs text-gray-500 mt-2 pl-12">{a.notes}</p>}
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
