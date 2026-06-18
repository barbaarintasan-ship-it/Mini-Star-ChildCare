import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useIncidents, useCreateIncident, useUpdateIncidentStatus } from '@/hooks/useIncidents'
import { useChildren } from '@/hooks/useChildren'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { SeverityBadge, Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDate, fmtTime, today } from '@/lib/utils'
import { Plus, CheckCircle, AlertTriangle } from 'lucide-react'
import type { IncidentForm } from '@/types'

const schema = z.object({
  child_id: z.string().min(1, 'Required'),
  classroom_id: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
  time: z.string().optional(),
  location: z.string().optional(),
  description: z.string().min(5, 'Please describe what happened'),
  injury_type: z.string().optional(),
  first_aid: z.string().optional(),
  parent_notified: z.boolean(),
  severity: z.enum(['minor','moderate','severe']).optional(),
})

export default function IncidentsPage() {
  const { user } = useAuthStore()
  const isStaff = user?.role !== 'parent'
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const { data: incidents = [], isLoading } = useIncidents()
  const { data: children = [] } = useChildren()
  const { data: classrooms = [] } = useClassrooms()
  const createIncident = useCreateIncident()
  const updateStatus = useUpdateIncidentStatus()

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IncidentForm>({
    resolver: zodResolver(schema),
    defaultValues: { date: today(), parent_notified: false },
  })

  const watchedChildId = watch('child_id')
  const selectedChild = children.find((c) => c.id === watchedChildId)

  async function onSubmit(data: IncidentForm) {
    const classroomId = data.classroom_id || selectedChild?.classroom_id || ''
    await createIncident.mutateAsync({ ...data, classroom_id: classroomId })
    setShowForm(false)
    reset()
  }

  if (isLoading) return <PageLoader />

  const selectedIncident = incidents.find((i) => i.id === selected)

  const statusColor: Record<string, string> = {
    open: 'text-amber-700 bg-amber-50',
    reviewed: 'text-blue-700 bg-blue-50',
    closed: 'text-gray-500 bg-gray-100',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-heading text-2xl font-600 text-night">Incident Reports</h1>
        {isStaff && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={16} /> New Report
          </Button>
        )}
      </div>

      {incidents.length === 0 ? (
        <EmptyState icon="📋" title="No incident reports"
          message={isStaff ? 'No incidents have been reported.' : 'No incidents to show.'}
          action={isStaff ? <Button size="sm" onClick={() => setShowForm(true)}><Plus size={14} /> New Report</Button> : undefined}
        />
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <Card key={inc.id} hover onClick={() => setSelected(inc.id)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-700 text-night">{inc.child?.name}</p>
                    <SeverityBadge severity={inc.severity} />
                    <span className={`text-xs font-700 px-2 py-0.5 rounded-full ${statusColor[inc.status]}`}>
                      {inc.status}
                    </span>
                    {inc.parent_notified && (
                      <span className="text-xs text-teal font-700">✓ Parent notified</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{inc.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {fmtDate(inc.date)} {fmtTime(inc.time)} · {inc.teacher?.name} · {inc.location}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Incident Report" size="lg">
        {selectedIncident && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="label">Child</p><p className="font-700 text-night">{selectedIncident.child?.name}</p></div>
              <div><p className="label">Date & Time</p><p>{fmtDate(selectedIncident.date)} {fmtTime(selectedIncident.time)}</p></div>
              <div><p className="label">Location</p><p>{selectedIncident.location ?? '—'}</p></div>
              <div><p className="label">Injury Type</p><p>{selectedIncident.injury_type ?? '—'}</p></div>
              <div><p className="label">Severity</p><SeverityBadge severity={selectedIncident.severity} /></div>
              <div><p className="label">Reported by</p><p>{selectedIncident.teacher?.name}</p></div>
            </div>
            <div>
              <p className="label">Description</p>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-3">{selectedIncident.description}</p>
            </div>
            <div>
              <p className="label">First Aid Provided</p>
              <p className="text-gray-700">{selectedIncident.first_aid ?? 'None'}</p>
            </div>

            {isStaff && (
              <div className="flex gap-2 pt-2 border-t">
                {!selectedIncident.parent_notified && (
                  <Button variant="teal" size="sm"
                    onClick={() => updateStatus.mutate({ id: selectedIncident.id, parentNotified: true })}>
                    <CheckCircle size={14} /> Mark Parent Notified
                  </Button>
                )}
                {selectedIncident.status === 'open' && (
                  <Button variant="outline" size="sm"
                    onClick={() => updateStatus.mutate({ id: selectedIncident.id, status: 'reviewed' })}>
                    Mark Reviewed
                  </Button>
                )}
                {selectedIncident.status === 'reviewed' && (
                  <Button variant="ghost" size="sm"
                    onClick={() => updateStatus.mutate({ id: selectedIncident.id, status: 'closed' })}>
                    Close Report
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* New incident modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); reset() }} title="New Incident Report" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Child *" error={errors.child_id?.message} {...register('child_id')}>
              <option value="">Select child</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Select label="Classroom *" error={errors.classroom_id?.message} {...register('classroom_id')}>
              <option value="">Select classroom</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Input label="Date *" type="date" error={errors.date?.message} {...register('date')} />
            <Input label="Time" type="time" {...register('time')} />
            <Input label="Location" {...register('location')} />
            <Select label="Severity" {...register('severity')}>
              <option value="">Select severity</option>
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </Select>
          </div>
          <Input label="Injury Type" placeholder="e.g. Scrape, bump, bite" {...register('injury_type')} />
          <Textarea label="Description *" error={errors.description?.message} {...register('description')} />
          <Textarea label="First Aid Provided" {...register('first_aid')} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" {...register('parent_notified')} />
            <span className="text-sm font-700">Parent has been notified</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => { setShowForm(false); reset() }}>Cancel</Button>
            <Button type="submit" loading={createIncident.isPending}>Submit Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
