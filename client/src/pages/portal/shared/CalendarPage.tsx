import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEvents, useCreateEvent, useDeleteEvent } from '@/hooks/useEvents'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDate, EVENT_TYPE_CONFIG } from '@/lib/utils'
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns'
import type { EventForm, EventType } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().optional(),
  type: z.enum(['holiday','closure','meeting','birthday','school_event','classroom_event']),
  start_date: z.string().min(1, 'Required'),
  end_date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  all_day: z.boolean(),
  classroom_id: z.string().optional(),
  visible_to: z.array(z.string()),
})

export default function CalendarPage() {
  const { user } = useAuthStore()
  const isStaff = user?.role !== 'parent'
  const canCreate = user?.role === 'admin' || user?.role === 'teacher'

  const [currentDate, setCurrentDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const { data: events = [], isLoading } = useEvents(
    format(monthStart, 'yyyy-MM-dd'),
    format(monthEnd, 'yyyy-MM-dd')
  )
  const { data: classrooms = [] } = useClassrooms()
  const createEvent = useCreateEvent()
  const deleteEvent = useDeleteEvent()

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<EventForm>({
    resolver: zodResolver(schema),
    defaultValues: { all_day: true, visible_to: ['admin','teacher','parent'] },
  })

  // Build calendar grid
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  function eventsOnDay(day: Date) {
    return events.filter((ev) => isSameDay(parseISO(ev.start_date), day))
  }

  async function onSubmit(data: EventForm) {
    await createEvent.mutateAsync(data)
    setShowForm(false)
    reset()
  }

  if (isLoading) return <PageLoader />

  const selectedDayEvents = selectedDay ? eventsOnDay(selectedDay) : []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-heading text-2xl font-600 text-night">Calendar</h1>
        {canCreate && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add Event
          </Button>
        )}
      </div>

      {/* Month navigation */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          <ChevronLeft size={16} />
        </Button>
        <h2 className="font-heading text-lg font-600 text-night">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="card p-0 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
            <div key={d} className="text-center text-[11px] font-800 text-gray-400 uppercase py-2">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayEvents = eventsOnDay(day)
            const isToday = isSameDay(day, new Date())
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isSelected = selectedDay && isSameDay(day, selectedDay)

            return (
              <button
                key={day.toISOString()}
                className={`min-h-16 p-1.5 border-b border-r border-gray-100 text-left transition-colors
                  ${!isCurrentMonth ? 'bg-gray-50 opacity-40' : ''}
                  ${isSelected ? 'bg-night-soft' : 'hover:bg-gray-50'}
                `}
                onClick={() => setSelectedDay(isSameDay(day, selectedDay ?? new Date(0)) ? null : day)}
              >
                <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-700
                  ${isToday ? 'bg-gold text-white' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
                <div className="space-y-0.5 mt-0.5">
                  {dayEvents.slice(0, 2).map((ev) => {
                    const cfg = EVENT_TYPE_CONFIG[ev.type ?? 'school_event']
                    return (
                      <div key={ev.id} className={`text-[9px] font-700 truncate px-1 rounded ${cfg?.color ?? 'bg-gray-100 text-gray-600'}`}>
                        {ev.title}
                      </div>
                    )
                  })}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] text-gray-400">+{dayEvents.length - 2}</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <Card>
          <p className="font-heading font-600 text-night mb-3">{format(selectedDay, 'EEEE, MMMM d, yyyy')}</p>
          {selectedDayEvents.length === 0 ? (
            <p className="text-sm text-gray-400">No events on this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedDayEvents.map((ev) => {
                const cfg = EVENT_TYPE_CONFIG[ev.type ?? 'school_event']
                return (
                  <div key={ev.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{cfg?.icon}</span>
                      <div>
                        <p className="font-700 text-night text-sm">{ev.title}</p>
                        {ev.description && <p className="text-xs text-gray-500">{ev.description}</p>}
                        <p className="text-xs text-gray-400 capitalize">{ev.type?.replace('_',' ')}</p>
                      </div>
                    </div>
                    {canCreate && (
                      <Button variant="ghost" size="sm" onClick={() => deleteEvent.mutate(ev.id)}>
                        <Trash2 size={13} />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}

      {/* All upcoming events list */}
      <Card>
        <p className="font-heading font-600 text-night mb-3">This Month</p>
        {events.length === 0 ? (
          <EmptyState icon="📅" title="No events this month" />
        ) : (
          <div className="space-y-2">
            {events.map((ev) => {
              const cfg = EVENT_TYPE_CONFIG[ev.type ?? 'school_event']
              return (
                <div key={ev.id} className="flex items-center gap-3">
                  <div className="w-8 text-center">
                    <span className="text-lg">{cfg?.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-700 text-night truncate">{ev.title}</p>
                    <p className="text-xs text-gray-400">{fmtDate(ev.start_date)}</p>
                  </div>
                  {canCreate && (
                    <Button variant="ghost" size="sm" onClick={() => deleteEvent.mutate(ev.id)}>
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Add event modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); reset() }} title="Add Event" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Title *" error={errors.title?.message} {...register('title')} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type *" error={errors.type?.message} {...register('type')}>
              {Object.entries(EVENT_TYPE_CONFIG).map(([val, cfg]) => (
                <option key={val} value={val}>{cfg.icon} {cfg.label}</option>
              ))}
            </Select>
            <Input label="Date *" type="date" error={errors.start_date?.message} {...register('start_date')} />
            <Input label="End Date" type="date" {...register('end_date')} />
            <Select label="Classroom (optional)" {...register('classroom_id')}>
              <option value="">All Classrooms</option>
              {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <Textarea label="Description" {...register('description')} />

          <div>
            <p className="label mb-1">Visible to</p>
            <div className="flex gap-3">
              {['admin','teacher','parent'].map((role) => (
                <label key={role} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    value={role}
                    {...register('visible_to')}
                    defaultChecked
                  />
                  <span className="text-sm capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => { setShowForm(false); reset() }}>Cancel</Button>
            <Button type="submit" loading={createEvent.isPending}>Add Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
