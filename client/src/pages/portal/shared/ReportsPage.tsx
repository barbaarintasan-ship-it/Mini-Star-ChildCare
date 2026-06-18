/**
 * Shared Reports page — Admin (all), Teacher (own class), Parent (own children)
 */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useReports, useCreateReport, useDeleteReport } from '@/hooks/useReports'
import { useChildren } from '@/hooks/useChildren'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { today, fmtDate, fmtTime, MOOD_MAP, childAge } from '@/lib/utils'
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReportForm } from '@/types'

const schema = z.object({
  child_id: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
  mood: z.string().optional(),
  meals: z.string().optional(),
  nap_start: z.string().optional(),
  nap_end: z.string().optional(),
  activities: z.string().optional(),
  note: z.string().optional(),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
})

const MOODS = ['happy','good','okay','tired','fussy','sick']

export default function ReportsPage() {
  const { user } = useAuthStore()
  const isStaff = user?.role !== 'parent'

  const [date, setDate] = useState(today())
  const [classFilter, setClassFilter] = useState(
    user?.role === 'teacher' ? user.classroom_id ?? '' : ''
  )
  const [showForm, setShowForm] = useState(false)

  const { data: reports = [], isLoading } = useReports({
    date,
    classroomId: classFilter || undefined,
  })
  const { data: children = [] } = useChildren()
  const { data: classrooms = [] } = useClassrooms()
  const createReport = useCreateReport()
  const deleteReport = useDeleteReport()

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ReportForm & { classroom_id: string }>({
    resolver: zodResolver(schema.extend({ classroom_id: z.string() })),
    defaultValues: {
      date: today(),
      classroom_id: user?.classroom_id ?? '',
    },
  })

  const watchedChildId = watch('child_id')
  const selectedChild = children.find((c) => c.id === watchedChildId)

  async function onSubmit(data: ReportForm & { classroom_id: string }) {
    const classroomId = data.classroom_id || selectedChild?.classroom_id || ''
    if (!classroomId) return
    await createReport.mutateAsync({ ...data, classroom_id: classroomId })
    setShowForm(false)
    reset()
  }

  function prevDay() {
    const d = new Date(date); d.setDate(d.getDate() - 1)
    setDate(d.toISOString().slice(0, 10))
  }
  function nextDay() {
    const d = new Date(date); d.setDate(d.getDate() + 1)
    setDate(d.toISOString().slice(0, 10))
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-heading text-2xl font-600 text-night">Daily Reports</h1>
        {isStaff && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={16} /> New Report
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={prevDay}><ChevronLeft size={16} /></Button>
          <input type="date" className="input w-36 text-sm" value={date}
            onChange={(e) => setDate(e.target.value)} />
          <Button variant="ghost" size="sm" onClick={nextDay}><ChevronRight size={16} /></Button>
        </div>
        {user?.role === 'admin' && (
          <select className="input w-40" value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">All Classrooms</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {reports.length === 0 ? (
        <EmptyState icon="📋" title="No reports for this date"
          action={isStaff ? <Button size="sm" onClick={() => setShowForm(true)}><Plus size={14} /> New Report</Button> : undefined}
        />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start gap-3">
                <Avatar name={r.child?.name ?? '?'} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-700 text-night">{r.child?.name}</p>
                    {r.mood && (
                      <span className="text-lg">{MOOD_MAP[r.mood] ?? r.mood}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    By {r.teacher?.name} · In: {fmtTime(r.check_in)} · Out: {fmtTime(r.check_out)}
                  </p>

                  <div className="grid sm:grid-cols-3 gap-2 text-xs">
                    {r.meals && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="font-700 text-gray-500 block">Meals</span>
                        {r.meals}
                      </div>
                    )}
                    {(r.nap_start || r.nap_end) && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="font-700 text-gray-500 block">Nap</span>
                        {fmtTime(r.nap_start)} – {fmtTime(r.nap_end)}
                      </div>
                    )}
                    {r.activities && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="font-700 text-gray-500 block">Activities</span>
                        {r.activities}
                      </div>
                    )}
                  </div>
                  {r.note && (
                    <p className="text-sm text-gray-600 mt-2 bg-gold-soft/30 rounded-lg px-3 py-2">
                      💬 {r.note}
                    </p>
                  )}
                </div>
                {isStaff && (
                  <Button variant="ghost" size="sm" onClick={() => deleteReport.mutate(r.id)}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New report modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); reset() }} title="New Daily Report" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Child *" error={errors.child_id?.message} {...register('child_id')}>
              <option value="">Select child</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Input label="Date *" type="date" error={errors.date?.message} {...register('date')} />
            <Input label="Check In" type="time" {...register('check_in')} />
            <Input label="Check Out" type="time" {...register('check_out')} />
            <Input label="Nap Start" type="time" {...register('nap_start')} />
            <Input label="Nap End" type="time" {...register('nap_end')} />
          </div>

          {/* Mood */}
          <div>
            <p className="label mb-2">Mood</p>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map((m) => (
                <label key={m} className="cursor-pointer">
                  <input type="radio" value={m} {...register('mood')} className="sr-only" />
                  <span className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 border-transparent hover:border-gold text-center text-xs font-700">
                    <span className="text-xl">{MOOD_MAP[m]}</span>
                    {m}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Textarea label="Meals" placeholder="What did they eat?" {...register('meals')} />
          <Textarea label="Activities" placeholder="What did they do?" {...register('activities')} />
          <Textarea label="Notes for Parent" placeholder="A message home..." {...register('note')} />

          {/* Hidden classroom_id */}
          {selectedChild && (
            <input type="hidden" value={selectedChild.classroom_id ?? ''} {...register('classroom_id')} />
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => { setShowForm(false); reset() }}>Cancel</Button>
            <Button type="submit" loading={createReport.isPending}>Save Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
