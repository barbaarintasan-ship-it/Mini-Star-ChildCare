import { cn } from '@/lib/utils'

type Color = 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'gold' | 'teal' | 'coral' | 'night'

interface BadgeProps {
  children: React.ReactNode
  color?: Color
  className?: string
}

const colorClass: Record<Color, string> = {
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
  amber:  'bg-amber-100 text-amber-700',
  blue:   'bg-blue-100 text-blue-700',
  gray:   'bg-gray-100 text-gray-600',
  gold:   'bg-gold-soft text-gold',
  teal:   'bg-teal-soft text-teal',
  coral:  'bg-coral-soft text-coral',
  night:  'bg-night-soft text-night',
}

export function Badge({ children, color = 'gray', className }: BadgeProps) {
  return (
    <span className={cn('badge', colorClass[color], className)}>
      {children}
    </span>
  )
}

/** Role-colored badge */
export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { label: string; color: Color }> = {
    admin:   { label: 'Admin',   color: 'night' },
    teacher: { label: 'Teacher', color: 'teal' },
    parent:  { label: 'Parent',  color: 'gold' },
  }
  const cfg = map[role] ?? { label: role, color: 'gray' as Color }
  return <Badge color={cfg.color}>{cfg.label}</Badge>
}

/** Attendance status badge */
export function AttendanceBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: Color }> = {
    present:      { label: 'Present',      color: 'green' },
    absent:       { label: 'Absent',       color: 'red' },
    late:         { label: 'Late',         color: 'amber' },
    early_pickup: { label: 'Early Pickup', color: 'blue' },
    excused:      { label: 'Excused',      color: 'gray' },
  }
  const cfg = map[status] ?? { label: status, color: 'gray' as Color }
  return <Badge color={cfg.color}>{cfg.label}</Badge>
}

/** Incident severity badge */
export function SeverityBadge({ severity }: { severity?: string | null }) {
  if (!severity) return null
  const map: Record<string, Color> = {
    minor:    'amber',
    moderate: 'coral',
    severe:   'red',
  }
  return (
    <Badge color={map[severity] ?? 'gray'}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  )
}

/** Enrollment status badge */
export function EnrollmentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: Color }> = {
    pending:   { label: 'Pending',   color: 'amber' },
    approved:  { label: 'Approved',  color: 'green' },
    rejected:  { label: 'Rejected',  color: 'red' },
    waitlist:  { label: 'Waitlist',  color: 'blue' },
  }
  const cfg = map[status] ?? { label: status, color: 'gray' as Color }
  return <Badge color={cfg.color}>{cfg.label}</Badge>
}
