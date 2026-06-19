/**
 * Parent "My Children" page — read-only rich view of their linked children
 * Shows: profile, today's attendance, latest daily report, portfolio, milestones
 */
import { useState } from 'react'
import { useChildren } from '@/hooks/useChildren'
import { useAttendance } from '@/hooks/useAttendance'
import { useReports } from '@/hooks/useReports'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useMilestones } from '@/hooks/useCurriculum'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, AttendanceBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { childAge, fmtDate, today, MOOD_MAP, ATTENDANCE_CONFIG } from '@/lib/utils'
import { CURR_CATS, computeProgress } from '@/data/curriculum'
import { ChevronDown, ChevronUp, Heart, BookOpen, TrendingUp } from 'lucide-react'
import type { Child } from '@/types'

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} fill="none" stroke="#f0f0f0" strokeWidth="4" />
      <circle
        cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="26" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1a1a2e">
        {pct}%
      </text>
    </svg>
  )
}

function ChildCard({ child }: { child: Child }) {
  const [expanded, setExpanded] = useState(false)

  const { data: todayAttendance = [] } = useAttendance({ date: today(), childId: child.id })
  const { data: recentReports = [] } = useReports({ childId: child.id, from: (() => {
    const d = new Date(); d.setDate(d.getDate() - 14); return d.toISOString().slice(0, 10)
  })() })
  const { data: portfolio = [] } = usePortfolio(child.id)
  const { data: milestones = [] } = useMilestones(child.id)

  const todayRecord = todayAttendance[0]
  const latestReport = recentReports[0]
  const recentPhotos = portfolio.filter(e => e.media_type === 'photo' && e.media_url).slice(0, 3)

  // Determine age key for milestones
  const ageMonths = (() => {
    if (!child.dob) return 36
    const diff = Date.now() - new Date(child.dob).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 30.4))
  })()
  const ageKey = ageMonths < 12 ? 'infants' : ageMonths < 30 ? 'toddlers' : ageMonths < 60 ? 'preschool' : 'school_age'
  // Convert milestones array to Record<skill_id, level> for computeProgress
  const milestoneRecord = Object.fromEntries(
    (milestones as { skill_id: string; level: string }[]).map(m => [m.skill_id, m.level])
  ) as Record<string, import('@/data/curriculum').MilestoneLevel>
  const progress = computeProgress(ageKey as 'infants' | 'toddlers' | 'preschool' | 'school_age', milestoneRecord)

  const classroomName = (child as { classroom?: { name: string } }).classroom?.name ?? 'No classroom'

  // Home learning tip based on milestone gaps
  const weakDomains = Object.entries(progress)
    .filter(([, pct]) => pct < 40)
    .map(([domain]) => domain)
  const tip = weakDomains.length > 0
    ? `Focus on ${CURR_CATS.find(c => c.id === weakDomains[0])?.label ?? weakDomains[0]} at home.`
    : 'Great progress! Try creative arts or outdoor exploration today.'

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar name={child.name} url={(child as { photo_url?: string }).photo_url} size="xl" />
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-700 text-night text-lg leading-tight">{child.name}</h2>
          <p className="text-sm text-gray-500">{childAge(child.dob)} · {fmtDate(child.dob)}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <Badge color="teal">{classroomName}</Badge>
            {todayRecord
              ? <AttendanceBadge status={todayRecord.status} />
              : <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Not recorded today</span>
            }
          </div>
        </div>
      </div>

      {/* Allergy alert */}
      {(child as { allergies?: string }).allergies && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3 text-xs text-red-700">
          <span className="font-800">Allergies: </span>{(child as { allergies?: string }).allergies}
        </div>
      )}

      {/* Today's report snippet */}
      {latestReport && (
        <div className="bg-amber-50/60 rounded-xl p-3 mb-3">
          <p className="text-[11px] font-800 text-amber-700 uppercase mb-1.5">Latest Report · {fmtDate(latestReport.date)}</p>
          <div className="flex items-center gap-2">
            {latestReport.mood && (
              <span className="text-xl">{MOOD_MAP[latestReport.mood] ?? ''}</span>
            )}
            <div className="text-xs text-gray-700 flex-1">
              {latestReport.note
                ? <p className="line-clamp-2">"{latestReport.note}"</p>
                : latestReport.activities
                  ? <p className="line-clamp-2">{latestReport.activities}</p>
                  : <p className="text-gray-400">No notes from teacher today.</p>
              }
            </div>
          </div>
        </div>
      )}

      {/* Recent photos strip */}
      {recentPhotos.length > 0 && (
        <div className="flex gap-2 mb-3">
          {recentPhotos.map(p => (
            <img key={p.id} src={p.media_url!} alt={p.title}
              className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
          ))}
          {portfolio.filter(e => e.media_type === 'photo').length > 3 && (
            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-700">
              +{portfolio.filter(e => e.media_type === 'photo').length - 3}
            </div>
          )}
        </div>
      )}

      {/* Expand toggle */}
      <button
        className="w-full flex items-center justify-between text-xs font-700 text-gray-500 hover:text-night py-1 border-t border-gray-100 mt-2 pt-3 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center gap-1.5"><TrendingUp size={13} /> Development Progress</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Development progress */}
      {expanded && (
        <div className="mt-3 space-y-3">
          {/* Progress rings grid */}
          <div className="grid grid-cols-4 gap-2">
            {CURR_CATS.map(cat => {
              const pct = progress[cat.id] ?? 0
              return (
                <div key={cat.id} className="flex flex-col items-center gap-1">
                  <ProgressRing pct={pct} color={cat.color} />
                  <p className="text-[9px] font-700 text-gray-500 text-center leading-tight">{cat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Home learning tip */}
          <div className="bg-teal-soft rounded-xl p-3">
            <p className="text-[11px] font-800 text-teal uppercase mb-1">Home Learning Tip</p>
            <p className="text-xs text-gray-700">{tip}</p>
          </div>

          {/* This week's activities */}
          {recentReports.length > 0 && (
            <div>
              <p className="text-[11px] font-800 text-gray-400 uppercase mb-2">Recent Activities</p>
              <div className="space-y-1.5">
                {recentReports.slice(0, 5).map(r => r.activities ? (
                  <div key={r.id} className="flex items-start gap-2 text-xs">
                    <span className="text-gray-400 shrink-0 mt-0.5">{fmtDate(r.date)}</span>
                    <p className="text-gray-700 line-clamp-1">{r.activities}</p>
                  </div>
                ) : null)}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default function MyChildrenPage() {
  const { user } = useAuthStore()
  const { data: allChildren = [], isLoading } = useChildren()

  // Parents see only their linked children
  const myChildren = allChildren.filter(c =>
    (c as { parents?: { id: string }[] }).parents?.some(p => p.id === user?.id)
  )

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl font-600 text-night">My Children</h1>
          <p className="text-sm text-gray-500">Track development, daily reports, and home learning</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-3 py-1.5">
          <Heart size={12} className="text-rose-400" />
          {myChildren.length} {myChildren.length === 1 ? 'child' : 'children'}
        </div>
      </div>

      {myChildren.length === 0 ? (
        <EmptyState
          icon="👶"
          title="No children linked to your account"
          message="Please contact your centre administrator to link your children to your account."
        />
      ) : (
        <div className="space-y-4">
          {myChildren.map(child => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}

      {/* Parenting corner */}
      <Card className="bg-gradient-to-br from-teal-soft to-gold-soft/20 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
            <BookOpen size={18} className="text-teal" />
          </div>
          <div>
            <p className="font-heading font-700 text-night text-sm mb-1">Family Learning Tip of the Day</p>
            <p className="text-xs text-gray-600">
              Children learn best through play! Set aside 20 minutes daily for unstructured play —
              building blocks, drawing, or outdoor exploration. Narrate what you observe to
              build their vocabulary naturally.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
