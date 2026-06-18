import { useState, useMemo } from 'react'
import { RefreshCw, ChevronDown, ChevronRight, BookOpen, CheckCircle2, Circle, AlertCircle, MinusCircle, Plus, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useChildren } from '@/hooks/useChildren'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useLessonPlan, useGeneratePlan, useUpdatePlanActivity, useMilestones, useUpsertMilestone, useWeekThemes, useSetWeekTheme, useCurriculum, useAddActivity, useDeleteActivity } from '@/hooks/useCurriculum'
import type { CurriculumUnit } from '@/hooks/useCurriculum'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { CURR_CATS, ML_LEVELS, CURR_THEMES, ACTIVITY_LIBRARY, MILESTONES_DB, DAILY_SCHEDULE, findActivity, computeProgress } from '@/data/curriculum'
import type { AgeKey, MilestoneLevel } from '@/data/curriculum'

// ── Helpers ───────────────────────────────────────────────────

function todayStr() { return new Date().toISOString().slice(0, 10) }
function getWeekStart(date = new Date()) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay() + 1)
  return d.toISOString().slice(0, 10)
}
function fmtDate(s: string) {
  return new Date(s + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const STATUS_CONFIG = {
  pending:   { icon: <Circle size={15} className="text-gray-300" />,        label: 'Not Started', cls: 'text-gray-400' },
  completed: { icon: <CheckCircle2 size={15} className="text-teal" />,      label: 'Completed',   cls: 'text-teal' },
  partial:   { icon: <AlertCircle size={15} className="text-amber-500" />,  label: 'Partial',     cls: 'text-amber-500' },
  skipped:   { icon: <MinusCircle size={15} className="text-gray-400" />,   label: 'Skipped',     cls: 'text-gray-400' },
}

const CLS_TO_AGE: Record<string, AgeKey> = { Infants: 'infants', Toddlers: 'toddlers', Preschool: 'preschool', 'School-Age': 'school_age' }
function classroomAgeKey(name?: string, ageGroup?: string): AgeKey {
  if (name && CLS_TO_AGE[name]) return CLS_TO_AGE[name]
  const ag = (ageGroup || '').toLowerCase()
  if (ag.includes('infant') || ag.includes('0')) return 'infants'
  if (ag.includes('toddler') || ag.includes('1-3') || ag.includes('1–3')) return 'toddlers'
  if (ag.includes('school') || ag.includes('5-12') || ag.includes('5–12')) return 'school_age'
  return 'preschool'
}

const LEVEL_COLORS: Record<string, string> = {
  Beginning:  'bg-gray-100 text-gray-500 border-gray-200',
  Emerging:   'bg-red-50   text-red-600   border-red-200',
  Developing: 'bg-amber-50 text-amber-600 border-amber-200',
  Proficient: 'bg-green-50 text-green-600 border-green-200',
  Advanced:   'bg-teal/10  text-teal      border-teal/30',
}

const AREA_COLORS: Record<string, string> = {
  'Math':'bg-blue-100 text-blue-700','Literacy':'bg-purple-100 text-purple-700',
  'Science':'bg-green-100 text-green-700','STEM':'bg-emerald-100 text-emerald-700',
  'Art':'bg-pink-100 text-pink-700','Music':'bg-yellow-100 text-yellow-700',
  'Sensory':'bg-orange-100 text-orange-700','Language':'bg-indigo-100 text-indigo-700',
  'Social-Emotional':'bg-rose-100 text-rose-700','Other':'bg-gray-100 text-gray-600',
}

// ── Sub-components ────────────────────────────────────────────

function TabBar({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 flex-wrap border-b border-gray-100 mb-6">
      {tabs.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 text-sm font-700 rounded-t-xl border-b-2 transition-colors ${
            active === t.id
              ? 'border-night text-night bg-white'
              : 'border-transparent text-gray-500 hover:text-night'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ── Today's Plan (Teacher/Admin) ──────────────────────────────

function TodayPlan({ classroomId, ageKey }: { classroomId: string; ageKey: AgeKey }) {
  const [date, setDate] = useState(todayStr())
  const { data: plan, isLoading } = useLessonPlan(classroomId, date)
  const generate = useGeneratePlan()
  const updateAct = useUpdatePlanActivity()

  const schedule = plan?.schedule ?? DAILY_SCHEDULE[ageKey]

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      {/* Date bar */}
      <div className="card flex flex-wrap items-center gap-3">
        <span className="font-700 text-night">{plan ? fmtDate(plan.date) : fmtDate(date)}</span>
        <input
          type="date"
          aria-label="Select date"
          title="Select date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-night focus:outline-none focus:ring-2 focus:ring-teal"
        />
        {plan && (
          <span className="bg-gold/10 text-gold text-xs font-700 px-2.5 py-1 rounded-full">
            🌿 Theme: {plan.theme}
          </span>
        )}
        <button
          type="button"
          className="ml-auto btn btn-sm btn-outline flex items-center gap-1.5"
          disabled={generate.isPending}
          onClick={() => generate.mutate({ classroom_id: classroomId, date })}
        >
          <RefreshCw size={13} className={generate.isPending ? 'animate-spin' : ''} />
          {plan ? 'Regenerate Plan' : 'Generate Plan'}
        </button>
      </div>

      {!plan ? (
        <EmptyState icon="📅" title="No plan for this date" message="Click Generate Plan to create today's lesson plan." />
      ) : (
        <>
          {/* Daily Schedule */}
          <div>
            <p className="text-xs font-800 text-gray-500 uppercase mb-3">Daily Schedule</p>
            <div className="space-y-1.5">
              {schedule.map((slot, i) => {
                const cat = CURR_CATS.find(c => c.id === slot.cat)
                return (
                  <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm ${slot.type === 'care' ? 'bg-gray-50 border-gray-100' : slot.type === 'learning' ? 'bg-white border-gray-100' : 'bg-white border-gray-50'}`}>
                    <span className="text-xs text-gray-400 font-700 min-w-[90px] shrink-0">{slot.time}</span>
                    {cat && (
                      <span className="text-xs font-700 px-2 py-0.5 rounded-full text-white shrink-0" style={{ background: cat.color }}>
                        {cat.icon} {cat.label}
                      </span>
                    )}
                    <span className="font-600 text-night flex-1">{slot.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-700 ${slot.type === 'learning' ? 'bg-teal/10 text-teal' : slot.type === 'care' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'}`}>
                      {slot.type}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Activity Cards */}
          <div>
            <p className="text-xs font-800 text-gray-500 uppercase mb-3">Today's Learning Activities</p>
            <div className="space-y-3">
              {plan.activities.map((entry, idx) => {
                const cat = CURR_CATS.find(c => c.id === entry.catId)
                const activity = findActivity(entry.activityId)
                if (!activity) return null
                const sc = STATUS_CONFIG[entry.status] || STATUS_CONFIG.pending
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderLeft: `4px solid ${cat?.color || '#ccc'}` }}>
                    <div className="px-5 py-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-700 px-2 py-0.5 rounded-full text-white" style={{ background: cat?.color || '#ccc' }}>
                              {cat?.icon} {cat?.label}
                            </span>
                            <span className="text-xs text-gray-400">⏱ {activity.dur} min</span>
                          </div>
                          <h4 className="font-700 text-night">{activity.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.obj}</p>
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-700 shrink-0 ${sc.cls}`}>
                          {sc.icon} {sc.label}
                        </div>
                      </div>

                      {/* Status buttons */}
                      <div className="flex gap-2 flex-wrap mb-3">
                        {(Object.keys(STATUS_CONFIG) as (keyof typeof STATUS_CONFIG)[]).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => updateAct.mutate({ planId: plan.id, index: idx, status: s })}
                            className={`text-xs px-2.5 py-1 rounded-full border font-700 transition-colors ${entry.status === s ? 'bg-night text-white border-night' : 'bg-white text-gray-500 border-gray-200 hover:border-night hover:text-night'}`}
                          >
                            {STATUS_CONFIG[s].label}
                          </button>
                        ))}
                      </div>

                      {/* Details expandable */}
                      <details className="text-xs text-gray-500 mb-3">
                        <summary className="cursor-pointer font-700 text-teal hover:text-teal/80">View Full Instructions</summary>
                        <div className="pt-2 space-y-1.5">
                          <p><b>Materials:</b> {activity.mats.join(', ')}</p>
                          <div>
                            <b>Steps:</b>
                            <ol className="list-decimal ml-4 mt-1 space-y-0.5">
                              {activity.steps.map((s, i) => <li key={i}>{s}</li>)}
                            </ol>
                          </div>
                          {activity.qs.length > 0 && (
                            <p><b>Ask Children:</b> {activity.qs.join(' | ')}</p>
                          )}
                          <p><b>Benefits:</b> {activity.benefits}</p>
                        </div>
                      </details>

                      {/* Teacher notes */}
                      <input
                        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal"
                        placeholder="Teacher notes for this activity..."
                        defaultValue={entry.notes}
                        onBlur={e => {
                          if (e.target.value !== entry.notes)
                            updateAct.mutate({ planId: plan.id, index: idx, notes: e.target.value })
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Milestones Tracker (Teacher/Admin) ────────────────────────

function MilestonesTracker({ ageKey, childId }: { ageKey: AgeKey; childId: string }) {
  const { data: milestones = [], isLoading } = useMilestones(childId)
  const upsert = useUpsertMilestone()

  const trackedMap = useMemo(() => {
    const m: Record<string, MilestoneLevel> = {}
    for (const row of milestones) m[row.skill_id] = row.level as MilestoneLevel
    return m
  }, [milestones])

  const progress = useMemo(() => computeProgress(ageKey, trackedMap), [ageKey, trackedMap])

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CURR_CATS.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{cat.icon}</span>
              <span className="text-xs font-700 text-night">{cat.label}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${progress[cat.id] ?? 0}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1 font-700">{progress[cat.id] ?? 0}%</p>
          </div>
        ))}
      </div>

      {/* Domain-by-domain milestones */}
      {CURR_CATS.map(cat => {
        const domain = (MILESTONES_DB[ageKey] || {})[cat.id] || []
        if (!domain.length) return null
        return (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2" style={{ background: cat.color + '20' }}>
              <span className="text-base">{cat.icon}</span>
              <span className="font-700 text-night text-sm">{cat.label}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {domain.map(m => {
                const current = trackedMap[m.id] || 'Beginning'
                return (
                  <div key={m.id} className="px-5 py-3 flex flex-wrap items-center gap-3">
                    <span className="flex-1 text-sm text-gray-700 min-w-[160px]">{m.skill}</span>
                    <div className="flex gap-1 flex-wrap">
                      {ML_LEVELS.map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => upsert.mutate({ child_id: childId, skill_id: m.id, level })}
                          className={`text-[11px] px-2 py-0.5 rounded-full border font-700 transition-colors ${
                            current === level
                              ? LEVEL_COLORS[level]
                              : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Activity Library ──────────────────────────────────────────

function ActivityLibrary({ ageKey }: { ageKey: AgeKey }) {
  const [filterCat, setFilterCat] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const cats = CURR_CATS.filter(c => (ACTIVITY_LIBRARY[ageKey] || {})[c.id]?.length)

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterCat('')}
          className={`px-3 py-1 rounded-full text-xs font-700 border transition-colors ${!filterCat ? 'bg-night text-white border-night' : 'bg-white text-gray-600 border-gray-200 hover:border-night'}`}
        >
          All
        </button>
        {cats.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilterCat(filterCat === c.id ? '' : c.id)}
            className={`px-3 py-1 rounded-full text-xs font-700 border transition-colors ${filterCat === c.id ? 'bg-night text-white border-night' : 'bg-white text-gray-600 border-gray-200 hover:border-night'}`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Activity list */}
      {cats.filter(c => !filterCat || c.id === filterCat).map(cat => {
        const activities = (ACTIVITY_LIBRARY[ageKey] || {})[cat.id] || []
        return (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2" style={{ background: cat.color + '20' }}>
              <span className="text-lg">{cat.icon}</span>
              <span className="font-700 text-night text-sm">{cat.label}</span>
              <span className="ml-auto text-xs text-gray-400">{activities.length} activities</span>
            </div>
            <div className="divide-y divide-gray-50">
              {activities.map(act => (
                <div key={act.id} className="overflow-hidden">
                  <button
                    type="button"
                    className="w-full px-5 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(expanded === act.id ? null : act.id)}
                  >
                    <div className="flex-1">
                      <p className="font-700 text-night text-sm">{act.title}</p>
                      <p className="text-xs text-gray-500">{act.obj}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">⏱ {act.dur} min</span>
                    {expanded === act.id ? <ChevronDown size={14} className="text-gray-400 shrink-0" /> : <ChevronRight size={14} className="text-gray-400 shrink-0" />}
                  </button>
                  {expanded === act.id && (
                    <div className="px-5 pb-4 text-xs text-gray-600 space-y-2 border-t border-gray-50 bg-gray-50">
                      <p className="pt-3"><b>Materials:</b> {act.mats.join(', ')}</p>
                      <div>
                        <b>Steps:</b>
                        <ol className="list-decimal ml-4 mt-1 space-y-0.5">
                          {act.steps.map((s, i) => <li key={i}>{s}</li>)}
                        </ol>
                      </div>
                      {act.qs.length > 0 && <p><b>Ask Children:</b> {act.qs.join(' | ')}</p>}
                      <p><b>Benefits:</b> {act.benefits}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Week Theme Setter (Admin/Teacher) ─────────────────────────

function WeekThemeSetter({ classroomId }: { classroomId: string }) {
  const [weekStart, setWeekStart] = useState(getWeekStart())
  const [selected, setSelected] = useState(CURR_THEMES[0])
  const { data: themes = [] } = useWeekThemes(classroomId)
  const setTheme = useSetWeekTheme()

  const existing = themes.find(t => t.week_start.slice(0, 10) === weekStart)

  return (
    <div className="space-y-4">
      <div className="card space-y-4">
        <h3 className="font-700 text-night">Set Weekly Theme</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            label="Week Starting"
            type="date"
            value={weekStart}
            onChange={e => setWeekStart(e.target.value)}
          />
          <Select label="Theme" value={existing?.theme || selected} onChange={e => setSelected(e.target.value)}>
            {CURR_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        {existing && (
          <p className="text-xs text-gray-500">Current theme for this week: <b>{existing.theme}</b></p>
        )}
        <Button
          onClick={() => setTheme.mutate({ classroom_id: classroomId, week_start: weekStart, theme: existing?.theme !== selected ? selected : selected })}
          loading={setTheme.isPending}
          size="sm"
        >
          Save Theme
        </Button>
      </div>

      {/* Saved themes list */}
      {themes.length > 0 && (
        <div>
          <p className="text-xs font-800 text-gray-500 uppercase mb-2">Saved Themes</p>
          <div className="space-y-2">
            {themes.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
                <span className="text-xs text-gray-400 min-w-[100px]">{fmtDate(t.week_start)}</span>
                <span className="text-sm font-700 text-night flex-1">🌿 {t.theme}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Curriculum Units Library (Admin/Teacher add activities) ───

const DEFAULT_FORM = { unit_id: '', title: '', description: '', age_group: '3-5 years', area: 'Other', duration: '20 min' }
const AGE_GROUPS = ['0-12 months', '1-3 years', '3-5 years', '5-12 years']
const AREAS = Object.keys(AREA_COLORS)

function CurriculumUnitsTab({ canEdit }: { canEdit: boolean }) {
  const { data: units = [], isLoading } = useCurriculum()
  const addActivity = useAddActivity()
  const deleteActivity = useDeleteActivity()
  const [filterArea, setFilterArea] = useState('')
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)

  const allAreas = Array.from(new Set(units.flatMap(u => u.activities.map(a => a.area)))).sort()
  const filtered = units.map(u => ({
    ...u,
    activities: u.activities.filter(a => !filterArea || a.area === filterArea),
  })).filter(u => u.activities.length > 0 || !filterArea)

  function openAdd(unitId?: string) {
    setForm({ ...DEFAULT_FORM, unit_id: unitId ?? (units[0]?.id ?? '') })
    setShowModal(true)
  }

  async function handleSubmit() {
    if (!form.unit_id || !form.title.trim()) return
    await addActivity.mutateAsync(form)
    setShowModal(false)
    setForm(DEFAULT_FORM)
    setExpandedUnit(form.unit_id)
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-gray-500">12-week rotating activity plan</p>
        {canEdit && (
          <button type="button" className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={() => openAdd()}>
            <Plus size={14} /> Add Activity
          </button>
        )}
      </div>

      {allAreas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setFilterArea('')}
            className={`px-3 py-1 rounded-full text-xs font-700 border transition-colors ${!filterArea ? 'bg-night text-white border-night' : 'bg-white text-gray-600 border-gray-200 hover:border-night'}`}>
            All Areas
          </button>
          {allAreas.map(area => (
            <button key={area} type="button" onClick={() => setFilterArea(area === filterArea ? '' : area)}
              className={`px-3 py-1 rounded-full text-xs font-700 border transition-colors ${filterArea === area ? 'bg-night text-white border-night' : 'bg-white text-gray-600 border-gray-200 hover:border-night'}`}>
              {area}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon="📚" title="No activities" message={filterArea ? 'Try a different filter.' : 'Add the first activity.'} />
      ) : (
        <div className="space-y-3">
          {filtered.map((unit: CurriculumUnit) => (
            <div key={unit.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button type="button" className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-700 ${unit.color}`}>
                  <BookOpen size={13} /> {unit.week}
                </span>
                <span className="flex-1 font-700 text-night">{unit.theme}</span>
                <span className="text-xs text-gray-400">{unit.activities.length} activities</span>
                {canEdit && (
                  <button type="button" className="text-xs text-teal font-700 hover:underline mr-1"
                    onClick={e => { e.stopPropagation(); openAdd(unit.id) }}>
                    + Add
                  </button>
                )}
                {expandedUnit === unit.id ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
              </button>
              {expandedUnit === unit.id && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {unit.activities.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-gray-400 italic">No activities in this unit yet.</p>
                  ) : unit.activities.map(act => (
                    <div key={act.id} className="px-5 py-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-700 text-night text-sm">{act.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{act.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-700 ${AREA_COLORS[act.area] ?? 'bg-gray-100 text-gray-600'}`}>{act.area}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-700 bg-gray-100 text-gray-500">{act.age_group}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-700 bg-gray-100 text-gray-500">{act.duration}</span>
                        </div>
                      </div>
                      {canEdit && (
                        <button type="button" aria-label="Remove activity"
                          className="text-gray-300 hover:text-red-500 transition-colors mt-0.5"
                          onClick={() => confirm('Remove this activity?') && deleteActivity.mutate(act.id)}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Activity" size="md">
        <div className="space-y-4">
          <Select label="Unit / Week" value={form.unit_id} onChange={e => setForm(f => ({ ...f, unit_id: e.target.value }))}>
            <option value="">Select a unit...</option>
            {units.map(u => <option key={u.id} value={u.id}>{u.week} — {u.theme}</option>)}
          </Select>
          <Input label="Activity Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Shape Sorting" />
          <Textarea label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will children do?" rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Learning Area" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </Select>
            <Select label="Age Group" value={form.age_group} onChange={e => setForm(f => ({ ...f, age_group: e.target.value }))}>
              {AGE_GROUPS.map(ag => <option key={ag} value={ag}>{ag}</option>)}
            </Select>
          </div>
          <Input label="Duration" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 20 min" />
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSubmit} loading={addActivity.isPending} disabled={!form.unit_id || !form.title.trim()}>Add Activity</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── Parent View — Today's Learning ────────────────────────────

function ParentTodayLearning({ classroomId, ageKey }: { classroomId?: string; ageKey: AgeKey }) {
  const date = todayStr()
  const { data: plan } = useLessonPlan(classroomId, date)

  if (!classroomId) return <EmptyState icon="📅" title="No classroom assigned" message="Your child's classroom will appear here once assigned." />

  const completed = plan?.activities.filter(a => a.status === 'completed' || a.status === 'partial') ?? []

  return (
    <div className="space-y-4">
      <div className="card border-t-4 border-t-gold">
        <h3 className="font-700 text-night mb-1">Today's Learning</h3>
        <p className="text-sm text-gray-500">{fmtDate(date)} {plan && <span className="font-700 text-gold">· 🌿 {plan.theme}</span>}</p>
      </div>

      {!plan || completed.length === 0 ? (
        <EmptyState icon="📚" title="Activities in progress" message="Today's completed activities will appear here as teachers mark them done." />
      ) : (
        completed.map((entry, i) => {
          const cat = CURR_CATS.find(c => c.id === entry.catId)
          const activity = findActivity(entry.activityId)
          if (!activity) return null
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" style={{ borderLeft: `4px solid ${cat?.color || '#ccc'}` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-700 px-2 py-0.5 rounded-full text-white" style={{ background: cat?.color || '#ccc' }}>
                  {cat?.icon} {cat?.label}
                </span>
                <span className={`text-xs font-700 ${entry.status === 'completed' ? 'text-teal' : 'text-amber-500'}`}>
                  {entry.status === 'completed' ? '✅ Completed' : '⚠️ Partial'}
                </span>
              </div>
              <h4 className="font-700 text-night mb-0.5">{activity.title}</h4>
              <p className="text-xs text-gray-500 mb-1">{activity.obj}</p>
              <p className="text-xs text-gray-400">{activity.benefits}</p>
              {entry.notes && (
                <div className="mt-3 bg-amber-50 rounded-xl p-3 text-xs text-gray-700">
                  <b>Teacher Note:</b> {entry.notes}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

// ── Parent View — Progress ────────────────────────────────────

function ParentProgress({ childId, ageKey }: { childId: string; ageKey: AgeKey }) {
  const { data: milestones = [], isLoading } = useMilestones(childId)

  const trackedMap = useMemo(() => {
    const m: Record<string, MilestoneLevel> = {}
    for (const row of milestones) m[row.skill_id] = row.level as MilestoneLevel
    return m
  }, [milestones])

  const progress = useMemo(() => computeProgress(ageKey, trackedMap), [ageKey, trackedMap])

  if (isLoading) return <PageLoader />

  const overall = Math.round(Object.values(progress).reduce((a, b) => a + b, 0) / CURR_CATS.length)

  return (
    <div className="space-y-4">
      <div className="card border-t-4 border-t-teal">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-700 text-night">Overall Progress</h3>
          <span className="text-2xl font-800 text-teal">{overall}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${overall}%` }} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {CURR_CATS.map(cat => {
          const pct = progress[cat.id] ?? 0
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-700 text-night">{cat.label}</span>
                <span className="ml-auto text-sm font-800 text-teal">{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Parent View — Milestones read-only ────────────────────────

function ParentMilestones({ childId, ageKey }: { childId: string; ageKey: AgeKey }) {
  const { data: milestones = [], isLoading } = useMilestones(childId)

  const trackedMap = useMemo(() => {
    const m: Record<string, MilestoneLevel> = {}
    for (const row of milestones) m[row.skill_id] = row.level as MilestoneLevel
    return m
  }, [milestones])

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-4">
      {CURR_CATS.map(cat => {
        const domain = (MILESTONES_DB[ageKey] || {})[cat.id] || []
        if (!domain.length) return null
        const achieved = domain.filter(m => trackedMap[m.id] && trackedMap[m.id] !== 'Beginning')
        return (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2" style={{ background: cat.color + '20' }}>
              <span>{cat.icon}</span>
              <span className="font-700 text-night text-sm">{cat.label}</span>
              <span className="ml-auto text-xs text-gray-400">{achieved.length}/{domain.length} achieved</span>
            </div>
            <div className="divide-y divide-gray-50">
              {domain.map(m => {
                const level = trackedMap[m.id]
                return (
                  <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                    <span className="flex-1 text-sm text-gray-700">{m.skill}</span>
                    {level ? (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border font-700 ${LEVEL_COLORS[level]}`}>{level}</span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-full border font-700 bg-gray-50 text-gray-400 border-gray-200">Not tracked</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────

export default function CurriculumPage() {
  const { user } = useAuthStore()
  const { data: children = [] } = useChildren()
  const { data: classrooms = [] } = useClassrooms()

  const role = user?.role || 'parent'
  const canEdit = role === 'admin' || role === 'teacher'

  // Determine classroom and age key
  const teacherClassroom = classrooms.find(c => c.teacher?.id === user?.id) || classrooms[0]
  const classroomId = user?.classroom_id || teacherClassroom?.id
  const classroom = classrooms.find(c => c.id === classroomId)
  const ageKey = classroomAgeKey(classroom?.name, classroom?.age_group)

  // For parent: get first child
  const myChildren = role === 'parent'
    ? children
    : children.filter(c => c.classroom_id === classroomId)
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>()
  const activeChild = myChildren.find(c => c.id === selectedChildId) || myChildren[0]
  const childClassroom = classrooms.find(c => c.id === activeChild?.classroom_id)
  const childAgeKey = classroomAgeKey(childClassroom?.name, childClassroom?.age_group)

  // Tab state
  const teacherTabs = [
    { id: 'today',    label: "📅 Today's Plan" },
    { id: 'milestones', label: '🎯 Milestones' },
    { id: 'library',  label: '📚 Activity Library' },
    { id: 'theme',    label: '🌿 Week Theme' },
    { id: 'units',    label: '🗂 Curriculum Units' },
  ]
  const parentTabs = [
    { id: 'today',      label: "📅 Today's Learning" },
    { id: 'progress',   label: '📊 Progress' },
    { id: 'milestones', label: '🎯 Milestones' },
  ]

  const tabs = canEdit ? teacherTabs : parentTabs
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-600 text-night">Curriculum</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {canEdit
              ? `${classroom?.name ?? 'Classroom'} · ${classroom?.age_group ?? ''}`
              : 'Your child\'s daily learning and development tracking'}
          </p>
        </div>

        {/* Child selector (for milestones) */}
        {myChildren.length > 1 && (
          <select
            aria-label="Select child"
            title="Select child"
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-night focus:outline-none focus:ring-2 focus:ring-teal"
            value={activeChild?.id || ''}
            onChange={e => setSelectedChildId(e.target.value)}
          >
            {myChildren.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Teacher / Admin tabs */}
      {canEdit && activeTab === 'today' && classroomId && (
        <TodayPlan classroomId={classroomId} ageKey={ageKey} />
      )}
      {canEdit && activeTab === 'milestones' && (
        myChildren.length === 0
          ? <EmptyState icon="👶" title="No children in this classroom" message="Children will appear here once enrolled." />
          : (
            <div className="space-y-4">
              {myChildren.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {myChildren.map(c => (
                    <button key={c.id} type="button"
                      onClick={() => setSelectedChildId(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-700 border transition-colors ${activeChild?.id === c.id ? 'bg-night text-white border-night' : 'bg-white text-gray-600 border-gray-200 hover:border-night'}`}>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
              {activeChild && <MilestonesTracker ageKey={childAgeKey} childId={activeChild.id} />}
            </div>
          )
      )}
      {canEdit && activeTab === 'library' && (
        <ActivityLibrary ageKey={ageKey} />
      )}
      {canEdit && activeTab === 'theme' && classroomId && (
        <WeekThemeSetter classroomId={classroomId} />
      )}
      {canEdit && activeTab === 'units' && (
        <CurriculumUnitsTab canEdit={canEdit} />
      )}

      {/* Parent tabs */}
      {!canEdit && activeTab === 'today' && (
        <ParentTodayLearning classroomId={activeChild?.classroom_id ?? undefined} ageKey={childAgeKey} />
      )}
      {!canEdit && activeTab === 'progress' && activeChild && (
        <ParentProgress childId={activeChild.id} ageKey={childAgeKey} />
      )}
      {!canEdit && activeTab === 'milestones' && activeChild && (
        <ParentMilestones childId={activeChild.id} ageKey={childAgeKey} />
      )}
    </div>
  )
}
