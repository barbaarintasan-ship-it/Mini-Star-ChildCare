import { useState } from 'react'
import { useEnrollments, useUpdateEnrollmentStatus } from '@/hooks/useEnrollments'
import { useClassrooms } from '@/hooks/useClassrooms'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EnrollmentBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDate } from '@/lib/utils'
import type { Enrollment, EnrollmentStatus } from '@/types'

export default function Enrollments() {
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | undefined>('pending')
  const { data: enrollments = [], isLoading } = useEnrollments(statusFilter)
  const { data: classrooms = [] } = useClassrooms()
  const updateStatus = useUpdateEnrollmentStatus()
  const [selected, setSelected] = useState<Enrollment | null>(null)
  const [assignClass, setAssignClass] = useState('')

  if (isLoading) return <PageLoader />

  async function approve() {
    if (!selected) return
    await updateStatus.mutateAsync({
      id: selected.id,
      status: 'approved',
      assignedClassroomId: assignClass || undefined,
    })
    setSelected(null)
  }

  async function reject() {
    if (!selected) return
    await updateStatus.mutateAsync({ id: selected.id, status: 'rejected' })
    setSelected(null)
  }

  async function waitlist() {
    if (!selected) return
    await updateStatus.mutateAsync({ id: selected.id, status: 'waitlist' })
    setSelected(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-heading text-2xl font-600 text-night">Enrollments</h1>
        <select
          className="input w-36"
          value={statusFilter ?? ''}
          onChange={(e) => setStatusFilter((e.target.value as EnrollmentStatus) || undefined)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="waitlist">Waitlist</option>
        </select>
      </div>

      {enrollments.length === 0 ? (
        <EmptyState icon="📝" title="No enrollments" message="No enrollment requests match this filter." />
      ) : (
        <div className="space-y-3">
          {enrollments.map((enr) => (
            <Card key={enr.id} hover onClick={() => setSelected(enr)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-700 text-night">{enr.child_name}</p>
                    <EnrollmentBadge status={enr.status} />
                  </div>
                  <p className="text-sm text-gray-500">Parent: {enr.parent_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Submitted {fmtDate(enr.submitted_at)} ·{' '}
                    {enr.preferred_classroom?.name ?? 'No preference'}
                  </p>
                  {enr.allergies && (
                    <p className="text-xs text-red-600 mt-1">⚠️ Allergies: {enr.allergies}</p>
                  )}
                </div>
                <div className="text-xs text-gray-400 shrink-0">
                  {enr.start_date ? fmtDate(enr.start_date) : 'No start date'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Enrollment Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="label">Child</p>
                <p className="font-700 text-night">{selected.child_name}</p>
                <p className="text-gray-500">{fmtDate(selected.child_dob ?? '')}</p>
              </div>
              <div>
                <p className="label">Parent</p>
                <p className="font-700 text-night">{selected.parent_name}</p>
                <p className="text-gray-500">{selected.parent_email}</p>
                <p className="text-gray-500">{selected.parent_phone}</p>
              </div>
              <div>
                <p className="label">Emergency Contact</p>
                <p className="text-gray-700">{selected.emergency_name}</p>
                <p className="text-gray-500">{selected.emergency_phone}</p>
              </div>
              <div>
                <p className="label">Preferred Start</p>
                <p className="text-gray-700">{fmtDate(selected.start_date ?? '')}</p>
              </div>
            </div>

            {selected.allergies && (
              <div className="bg-red-50 rounded-xl p-3 text-sm">
                <p className="font-700 text-red-700">Allergies:</p>
                <p className="text-red-600">{selected.allergies}</p>
              </div>
            )}
            {selected.food_notes && (
              <div className="bg-amber-50 rounded-xl p-3 text-sm">
                <p className="font-700 text-amber-700">Food Notes:</p>
                <p className="text-amber-600">{selected.food_notes}</p>
              </div>
            )}
            {selected.medical_notes && (
              <div className="bg-blue-50 rounded-xl p-3 text-sm">
                <p className="font-700 text-blue-700">Medical Notes:</p>
                <p className="text-blue-600">{selected.medical_notes}</p>
              </div>
            )}
            {selected.notes && (
              <div className="text-sm">
                <p className="label">Notes</p>
                <p className="text-gray-600">{selected.notes}</p>
              </div>
            )}

            {/* Actions (only for pending) */}
            {selected.status === 'pending' && (
              <div className="border-t pt-4">
                <p className="label mb-2">Assign to Classroom</p>
                <Select
                  value={assignClass}
                  onChange={(e) => setAssignClass(e.target.value)}
                >
                  <option value="">— Select classroom —</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.age_group})</option>
                  ))}
                </Select>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="teal"
                    onClick={approve}
                    loading={updateStatus.isPending}
                    className="flex-1"
                  >
                    ✓ Approve
                  </Button>
                  <Button variant="outline" onClick={waitlist} loading={updateStatus.isPending}>
                    Waitlist
                  </Button>
                  <Button variant="danger" onClick={reject} loading={updateStatus.isPending}>
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
