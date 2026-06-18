import { useState } from 'react'
import { BookOpen, Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

interface Activity {
  id: string
  title: string
  description: string
  ageGroup: string
  area: string
  duration: string
}

interface CurriculumUnit {
  id: string
  week: string
  theme: string
  color: string
  activities: Activity[]
}

const CURRICULUM: CurriculumUnit[] = [
  {
    id: '1', week: 'Week 1–2', theme: 'All About Me', color: 'bg-coral/10 text-coral',
    activities: [
      { id: 'a1', title: 'My Family Portrait', description: 'Children draw their family and share with classmates.', ageGroup: '3-5 years', area: 'Social-Emotional', duration: '30 min' },
      { id: 'a2', title: 'Name Recognition', description: 'Practice writing first name with large letter cards.', ageGroup: '3-5 years', area: 'Literacy', duration: '20 min' },
      { id: 'a3', title: 'Body Tracing', description: 'Trace body outlines on large paper, label body parts.', ageGroup: '1-3 years', area: 'Science', duration: '25 min' },
    ],
  },
  {
    id: '2', week: 'Week 3–4', theme: 'Colors & Shapes', color: 'bg-teal/10 text-teal',
    activities: [
      { id: 'b1', title: 'Shape Sorting', description: 'Sort everyday objects by shape — circle, square, triangle.', ageGroup: '1-3 years', area: 'Math', duration: '20 min' },
      { id: 'b2', title: 'Rainbow Mixing', description: 'Explore color mixing with finger paints.', ageGroup: '0-12 months', area: 'Sensory', duration: '15 min' },
      { id: 'b3', title: 'Shape Hunt', description: 'Find shapes hidden around the classroom.', ageGroup: '3-5 years', area: 'Math', duration: '25 min' },
    ],
  },
  {
    id: '3', week: 'Week 5–6', theme: 'Animals & Nature', color: 'bg-gold/10 text-gold',
    activities: [
      { id: 'c1', title: 'Animal Sounds', description: 'Listen to animal sounds, match to picture cards.', ageGroup: '0-12 months', area: 'Language', duration: '15 min' },
      { id: 'c2', title: 'Bug Safari', description: 'Outdoor exploration with magnifying glasses.', ageGroup: '3-5 years', area: 'Science', duration: '30 min' },
      { id: 'c3', title: 'Pet Story Time', description: 'Read "The Very Hungry Caterpillar," act out the story.', ageGroup: '1-3 years', area: 'Literacy', duration: '25 min' },
    ],
  },
  {
    id: '4', week: 'Week 7–8', theme: 'Numbers & Counting', color: 'bg-night/10 text-night',
    activities: [
      { id: 'd1', title: 'Counting Bears', description: 'Count and group colorful bears by number and color.', ageGroup: '1-3 years', area: 'Math', duration: '20 min' },
      { id: 'd2', title: 'Number Songs', description: 'Sing counting songs (5 Little Monkeys, 10 in the Bed).', ageGroup: '0-12 months', area: 'Music', duration: '15 min' },
      { id: 'd3', title: 'Number Writing', description: 'Trace numbers 1–10, count matching dot patterns.', ageGroup: '3-5 years', area: 'Math', duration: '25 min' },
    ],
  },
  {
    id: '5', week: 'Week 9–10', theme: 'Community Helpers', color: 'bg-coral/10 text-coral',
    activities: [
      { id: 'e1', title: 'Dress-Up Roles', description: 'Dramatic play with costumes: doctor, firefighter, chef.', ageGroup: '3-5 years', area: 'Social-Emotional', duration: '30 min' },
      { id: 'e2', title: 'Thank You Cards', description: 'Create cards for community helpers in the neighborhood.', ageGroup: '5-12 years', area: 'Literacy', duration: '25 min' },
      { id: 'e3', title: 'Build a Town', description: 'Use blocks to build roads, fire stations, and schools.', ageGroup: '3-5 years', area: 'STEM', duration: '35 min' },
    ],
  },
  {
    id: '6', week: 'Week 11–12', theme: 'Weather & Seasons', color: 'bg-teal/10 text-teal',
    activities: [
      { id: 'f1', title: 'Weather Chart', description: 'Daily weather journal — draw sun, clouds, rain, or snow.', ageGroup: '3-5 years', area: 'Science', duration: '10 min' },
      { id: 'f2', title: 'Season Collages', description: 'Create seasonal artwork with nature materials.', ageGroup: '1-3 years', area: 'Art', duration: '30 min' },
      { id: 'f3', title: 'Rain Experiment', description: 'Water cycle in a bag: tape a zip-lock to a sunny window.', ageGroup: '5-12 years', area: 'Science', duration: '20 min' },
    ],
  },
]

const AREA_COLORS: Record<string, string> = {
  'Math':           'bg-blue-100 text-blue-700',
  'Literacy':       'bg-purple-100 text-purple-700',
  'Science':        'bg-green-100 text-green-700',
  'STEM':           'bg-emerald-100 text-emerald-700',
  'Art':            'bg-pink-100 text-pink-700',
  'Music':          'bg-yellow-100 text-yellow-700',
  'Sensory':        'bg-orange-100 text-orange-700',
  'Language':       'bg-indigo-100 text-indigo-700',
  'Social-Emotional': 'bg-rose-100 text-rose-700',
}

export default function CurriculumPage() {
  const { user } = useAuthStore()
  const [expanded, setExpanded] = useState<string | null>('1')
  const [filterArea, setFilterArea] = useState('')

  const allAreas = Array.from(new Set(CURRICULUM.flatMap(u => u.activities.map(a => a.area)))).sort()

  const filtered = CURRICULUM.map(unit => ({
    ...unit,
    activities: unit.activities.filter(a => !filterArea || a.area === filterArea),
  })).filter(unit => unit.activities.length > 0)

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
        {user?.role !== 'parent' && (
          <button className="btn btn-primary btn-sm">
            <Plus size={15} /> Add Activity
          </button>
        )}
      </div>

      {/* Area filter */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded-full text-xs font-700 border transition-colors ${!filterArea ? 'bg-night text-white border-night' : 'bg-white text-gray-600 border-gray-200 hover:border-night'}`}
          onClick={() => setFilterArea('')}
        >
          All Areas
        </button>
        {allAreas.map(area => (
          <button
            key={area}
            className={`px-3 py-1 rounded-full text-xs font-700 border transition-colors ${filterArea === area ? 'bg-night text-white border-night' : 'bg-white text-gray-600 border-gray-200 hover:border-night'}`}
            onClick={() => setFilterArea(area === filterArea ? '' : area)}
          >
            {area}
          </button>
        ))}
      </div>

      {/* Units */}
      {filtered.length === 0 ? (
        <EmptyState icon="📚" title="No activities match" message="Try a different filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map(unit => (
            <div key={unit.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Unit header */}
              <button
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === unit.id ? null : unit.id)}
              >
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-700 ${unit.color}`}>
                  <BookOpen size={13} />
                  {unit.week}
                </span>
                <span className="flex-1 font-700 text-night">{unit.theme}</span>
                <span className="text-xs text-gray-400">{unit.activities.length} activities</span>
                {expanded === unit.id
                  ? <ChevronDown size={16} className="text-gray-400" />
                  : <ChevronRight size={16} className="text-gray-400" />
                }
              </button>

              {/* Activities */}
              {expanded === unit.id && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {unit.activities.map(act => (
                    <div key={act.id} className="px-5 py-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-700 text-night text-sm">{act.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{act.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-700 ${AREA_COLORS[act.area] ?? 'bg-gray-100 text-gray-600'}`}>
                            {act.area}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-700 bg-gray-100 text-gray-500">
                            {act.ageGroup}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-700 bg-gray-100 text-gray-500">
                            ⏱ {act.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
