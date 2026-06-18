import { useState } from 'react'
import { BookOpen, Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { useCurriculum, useAddActivity, useDeleteActivity } from '@/hooks/useCurriculum'
import type { CurriculumUnit } from '@/hooks/useCurriculum'

const AREA_COLORS: Record<string, string> = {
  'Math':             'bg-blue-100 text-blue-700',
  'Literacy':         'bg-purple-100 text-purple-700',
  'Science':          'bg-green-100 text-green-700',
  'STEM':             'bg-emerald-100 text-emerald-700',
  'Art':              'bg-pink-100 text-pink-700',
  'Music':            'bg-yellow-100 text-yellow-700',
  'Sensory':          'bg-orange-100 text-orange-700',
  'Language':         'bg-indigo-100 text-indigo-700',
  'Social-Emotional': 'bg-rose-100 text-rose-700',
  'Other':            'bg-gray-100 text-gray-600',
}

const AGE_GROUPS = ['0-12 months', '1-3 years', '3-5 years', '5-12 years']
const AREAS = Object.keys(AREA_COLORS)

const DEFAULT_FORM = {
  unit_id: '',
  title: '',
  description: '',
  age_group: '3-5 years',
  area: 'Other',
  duration: '20 min',
}

export default function CurriculumPage() {
  const { user } = useAuthStore()
  const { data: units = [], isLoading } = useCurriculum()
  const addActivity = useAddActivity()
  const deleteActivity = useDeleteActivity()

  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterArea, setFilterArea] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)

  const canEdit = user?.role === 'admin' || user?.role === 'teacher'

  const allAreas = Array.from(
    new Set(units.flatMap((u) => u.activities.map((a) => a.area)))
  ).sort()

  const filtered = units
    .map((u) => ({
      ...u,
      activities: u.activities.filter((a) => !filterArea || a.area === filterArea),
    }))
    .filter((u) => u.activities.length > 0 || !filterArea)

  function openAddModal(unitId?: string) {
    setForm({ ...DEFAULT_FORM, unit_id: unitId ?? (units[0]?.id ?? '') })
    setShowModal(true)
  }

  async function handleSubmit() {
    if (!form.unit_id || !form.title.trim()) return
    await addActivity.mutateAsync(form)
    setShowModal(false)
    setForm(DEFAULT_FORM)
    setExpanded(form.unit_id)
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Remove this activity?')) return
    deleteActivity.mutate(id)
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-600 text-night">Curriculum</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            12-week rotating activity plan — aligned with early childhood development standards
          </p>
        </div>
        {canEdit && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openAddModal()}>
            <Plus size={15} /> Add Activity
          </button>
        )}
      </div>

      {/* Area filter */}
      {allAreas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-700 border transition-colors ${!filterArea ? 'bg-night text-white border-night' : 'bg-white text-gray-600 border-gray-200 hover:border-night'}`}
            onClick={() => setFilterArea('')}
          >
            All Areas
          </button>
          {allAreas.map((area) => (
            <button
              key={area}
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-700 border transition-colors ${filterArea === area ? 'bg-night text-white border-night' : 'bg-white text-gray-600 border-gray-200 hover:border-night'}`}
              onClick={() => setFilterArea(area === filterArea ? '' : area)}
            >
              {area}
            </button>
          ))}
        </div>
      )}

      {/* Units */}
      {filtered.length === 0 ? (
        <EmptyState icon="📚" title="No activities yet" message={filterArea ? 'Try a different filter.' : 'Add the first activity to get started.'} />
      ) : (
        <div className="space-y-3">
          {filtered.map((unit: CurriculumUnit) => (
            <div key={unit.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Unit header */}
              <button
                type="button"
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === unit.id ? null : unit.id)}
              >
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-700 ${unit.color}`}>
                  <BookOpen size={13} />
                  {unit.week}
                </span>
                <span className="flex-1 font-700 text-night">{unit.theme}</span>
                <span className="text-xs text-gray-400">{unit.activities.length} activities</span>
                {canEdit && (
                  <button
                    type="button"
                    className="text-xs text-teal font-700 hover:underline mr-1"
                    onClick={(e) => { e.stopPropagation(); openAddModal(unit.id) }}
                  >
                    + Add
                  </button>
                )}
                {expanded === unit.id
                  ? <ChevronDown size={16} className="text-gray-400" />
                  : <ChevronRight size={16} className="text-gray-400" />
                }
              </button>

              {/* Activities */}
              {expanded === unit.id && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {unit.activities.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-gray-400 italic">No activities in this unit yet.</p>
                  ) : (
                    unit.activities.map((act) => (
                      <div key={act.id} className="px-5 py-4 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-700 text-night text-sm">{act.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{act.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-700 ${AREA_COLORS[act.area] ?? 'bg-gray-100 text-gray-600'}`}>
                              {act.area}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-700 bg-gray-100 text-gray-500">
                              {act.age_group}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-700 bg-gray-100 text-gray-500">
                              {act.duration}
                            </span>
                          </div>
                        </div>
                        {canEdit && (
                          <button
                            type="button"
                            aria-label="Remove activity"
                            className="text-gray-300 hover:text-red-500 transition-colors mt-0.5"
                            onClick={(e) => handleDelete(act.id, e)}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Activity Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Activity" size="md">
        <div className="space-y-4">
          <Select
            label="Unit / Week"
            value={form.unit_id}
            onChange={(e) => setForm((f) => ({ ...f, unit_id: e.target.value }))}
          >
            <option value="">Select a unit...</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.week} — {u.theme}</option>
            ))}
          </Select>

          <Input
            label="Activity Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Shape Sorting"
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What will children do?"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Learning Area"
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
            >
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </Select>

            <Select
              label="Age Group"
              value={form.age_group}
              onChange={(e) => setForm((f) => ({ ...f, age_group: e.target.value }))}
            >
              {AGE_GROUPS.map((ag) => <option key={ag} value={ag}>{ag}</option>)}
            </Select>
          </div>

          <Input
            label="Duration"
            value={form.duration}
            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            placeholder="e.g. 20 min"
          />

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              loading={addActivity.isPending}
              disabled={!form.unit_id || !form.title.trim()}
            >
              Add Activity
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
