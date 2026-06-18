import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a date string for display */
export function fmtDate(dateStr: string | null | undefined, fmt = 'MMM d, yyyy'): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), fmt)
  } catch {
    return dateStr
  }
}

/** Format a time string (HH:MM) for display */
export function fmtTime(timeStr: string | null | undefined): string {
  if (!timeStr) return '—'
  try {
    const [h, m] = timeStr.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')} ${period}`
  } catch {
    return timeStr
  }
}

/** Format datetime (ISO string) */
export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return format(new Date(iso), 'MMM d, yyyy h:mm a')
  } catch {
    return iso
  }
}

/** Human-readable child age from DOB */
export function childAge(dob: string | null | undefined): string {
  if (!dob) return ''
  try {
    const birthDate = parseISO(dob)
    const years = differenceInYears(new Date(), birthDate)
    if (years < 1) {
      const months = differenceInMonths(new Date(), birthDate)
      return `${months} mo`
    }
    return `${years} yr`
  } catch {
    return ''
  }
}

/** Today as YYYY-MM-DD */
export function today(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

/** Current time as HH:MM */
export function nowTime(): string {
  return format(new Date(), 'HH:mm')
}

/** Capitalize first letter */
export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

/** Get initials from a name */
export function initials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Attendance status display config */
export const ATTENDANCE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  present:      { label: 'Present',       color: 'text-teal-700',  bg: 'bg-teal-soft' },
  absent:       { label: 'Absent',        color: 'text-red-700',   bg: 'bg-red-50' },
  late:         { label: 'Late Arrival',  color: 'text-amber-700', bg: 'bg-amber-50' },
  early_pickup: { label: 'Early Pickup',  color: 'text-blue-700',  bg: 'bg-blue-50' },
  excused:      { label: 'Excused',       color: 'text-gray-700',  bg: 'bg-gray-100' },
}

/** Incident severity config */
export const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
  minor:    { label: 'Minor',    color: 'text-amber-700' },
  moderate: { label: 'Moderate', color: 'text-orange-700' },
  severe:   { label: 'Severe',   color: 'text-red-700' },
}

/** Event type config */
export const EVENT_TYPE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  holiday:         { label: 'Holiday',         icon: '🎉', color: 'bg-gold-soft text-gold' },
  closure:         { label: 'Closure',          icon: '🔒', color: 'bg-red-50 text-red-700' },
  meeting:         { label: 'Meeting',          icon: '📋', color: 'bg-blue-50 text-blue-700' },
  birthday:        { label: 'Birthday',         icon: '🎂', color: 'bg-pink-50 text-pink-700' },
  school_event:    { label: 'School Event',     icon: '🌟', color: 'bg-teal-soft text-teal' },
  classroom_event: { label: 'Classroom Event',  icon: '🏫', color: 'bg-night-soft text-night' },
}

/** Mood emoji map */
export const MOOD_MAP: Record<string, string> = {
  happy:    '😊',
  good:     '🙂',
  okay:     '😐',
  tired:    '😴',
  fussy:    '😤',
  sick:     '🤒',
}

/** Milestone status config */
export const MILESTONE_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Not Started', color: 'text-gray-500',   bg: 'bg-gray-100' },
  emerging:    { label: 'Emerging',    color: 'text-red-600',    bg: 'bg-red-50' },
  developing:  { label: 'Developing',  color: 'text-amber-700',  bg: 'bg-amber-50' },
  proficient:  { label: 'Proficient',  color: 'text-teal-700',   bg: 'bg-teal-soft' },
  advanced:    { label: 'Advanced',    color: 'text-night',      bg: 'bg-night-soft' },
}

/** Notification helper — creates a notification object */
export function makeNotification(
  userId: string,
  type: string,
  title: string,
  message?: string,
  data?: Record<string, unknown>
) {
  return { user_id: userId, type, title, message: message ?? null, data: data ?? null }
}
