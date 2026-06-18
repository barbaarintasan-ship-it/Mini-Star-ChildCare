// ============================================================
//  Mini Star Child Care — Shared TypeScript Types
// ============================================================

export type UserRole = 'admin' | 'teacher' | 'parent'

export interface User {
  id: string
  name: string
  role: UserRole
  username: string
  phone?: string | null
  email?: string | null
  classroom_id?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Classroom {
  id: string
  name: string
  age_group: string
  capacity: number
  teacher_id?: string | null
  created_at: string
  // joined
  teacher?: User | null
  child_count?: number
}

export interface Child {
  id: string
  name: string
  dob: string
  classroom_id?: string | null
  allergies?: string | null
  food_notes?: string | null
  medical_notes?: string | null
  emergency_contact?: string | null
  emergency_phone?: string | null
  notes?: string | null
  photo_url?: string | null
  active: boolean
  created_at: string
  // joined
  classroom?: Classroom | null
  parents?: User[]
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'early_pickup' | 'excused'

export interface Attendance {
  id: string
  child_id: string
  classroom_id: string
  date: string
  status: AttendanceStatus
  check_in?: string | null
  check_out?: string | null
  teacher_id?: string | null
  notes?: string | null
  created_at: string
  // joined
  child?: Child | null
  teacher?: User | null
}

export type MoodType = 'happy' | 'good' | 'okay' | 'tired' | 'fussy' | 'sick'

export interface DailyReport {
  id: string
  child_id: string
  teacher_id: string
  classroom_id: string
  date: string
  mood?: string | null
  meals?: string | null
  nap_start?: string | null
  nap_end?: string | null
  activities?: string | null
  note?: string | null
  check_in?: string | null
  check_out?: string | null
  created_at: string
  // joined
  child?: Child | null
  teacher?: User | null
}

export interface Message {
  id: string
  from_id: string
  to_id: string
  child_id?: string | null
  text: string
  read: boolean
  created_at: string
  // joined
  from?: User | null
  to?: User | null
  child?: Child | null
}

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'waitlist'

export interface Enrollment {
  id: string
  parent_name: string
  parent_phone?: string | null
  parent_email?: string | null
  parent_username?: string | null
  child_name: string
  child_dob?: string | null
  class_preference?: string | null
  allergies?: string | null
  food_notes?: string | null
  medical_notes?: string | null
  emergency_name?: string | null
  emergency_phone?: string | null
  start_date?: string | null
  notes?: string | null
  status: EnrollmentStatus
  assigned_classroom_id?: string | null
  child_id?: string | null
  parent_id?: string | null
  submitted_at: string
  // joined
  preferred_classroom?: Classroom | null
}

export type IncidentSeverity = 'minor' | 'moderate' | 'severe'
export type IncidentStatus = 'open' | 'reviewed' | 'closed'

export interface Incident {
  id: string
  child_id: string
  classroom_id: string
  teacher_id: string
  date: string
  time?: string | null
  location?: string | null
  description: string
  injury_type?: string | null
  first_aid?: string | null
  parent_notified: boolean
  parent_notified_at?: string | null
  severity?: IncidentSeverity | null
  status: IncidentStatus
  created_at: string
  // joined
  child?: Child | null
  teacher?: User | null
  classroom?: Classroom | null
}

export interface Medication {
  id: string
  child_id: string
  name: string
  dosage: string
  frequency?: string | null
  instructions?: string | null
  prescribed_by?: string | null
  parent_authorized: boolean
  active: boolean
  created_at: string
  // joined
  child?: Child | null
  logs?: MedicationLog[]
}

export interface MedicationLog {
  id: string
  medication_id: string
  child_id: string
  teacher_id: string
  given_at: string
  dosage?: string | null
  notes?: string | null
  missed: boolean
  created_at: string
  // joined
  teacher?: User | null
  medication?: Medication | null
}

export type MilestoneStatus = 'not_started' | 'emerging' | 'developing' | 'proficient' | 'advanced'

export interface Milestone {
  id: string
  child_id: string
  category: string
  title: string
  description?: string | null
  status: MilestoneStatus
  age_group?: string | null
  achieved_at?: string | null
  noted_by?: string | null
  created_at: string
}

export type MediaType = 'photo' | 'video' | 'document' | 'note'

export interface PortfolioEntry {
  id: string
  child_id: string
  teacher_id: string
  title: string
  description?: string | null
  media_url?: string | null
  media_type?: MediaType | null
  milestone_id?: string | null
  activity_tags?: string[] | null
  liked_by?: string[]
  date: string
  created_at: string
  // joined
  child?: Child | null
  teacher?: User | null
  milestone?: Milestone | null
}

export type EventType = 'holiday' | 'closure' | 'meeting' | 'birthday' | 'school_event' | 'classroom_event'

export interface CalendarEvent {
  id: string
  title: string
  description?: string | null
  type?: EventType | null
  start_date: string
  end_date?: string | null
  start_time?: string | null
  end_time?: string | null
  all_day: boolean
  classroom_id?: string | null
  created_by?: string | null
  visible_to: string[]
  created_at: string
  // joined
  classroom?: Classroom | null
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message?: string | null
  data?: Record<string, unknown> | null
  read: boolean
  created_at: string
}

// ── Form types ──────────────────────────────────────────────

export interface LoginForm {
  username: string
  password: string
}

export interface ChildForm {
  name: string
  dob: string
  classroom_id: string
  allergies?: string
  food_notes?: string
  medical_notes?: string
  emergency_contact?: string
  emergency_phone?: string
  notes?: string
}

export interface AttendanceForm {
  child_id: string
  status: AttendanceStatus
  check_in?: string
  check_out?: string
  notes?: string
}

export interface ReportForm {
  child_id: string
  date: string
  mood?: string
  meals?: string
  nap_start?: string
  nap_end?: string
  activities?: string
  note?: string
  check_in?: string
  check_out?: string
}

export interface IncidentForm {
  child_id: string
  classroom_id: string
  date: string
  time?: string
  location?: string
  description: string
  injury_type?: string
  first_aid?: string
  parent_notified: boolean
  severity?: IncidentSeverity
}

export interface MedicationForm {
  child_id: string
  name: string
  dosage: string
  frequency?: string
  instructions?: string
  prescribed_by?: string
  parent_authorized: boolean
}

export interface MessageForm {
  to_id: string
  child_id?: string
  text: string
}

export interface EventForm {
  title: string
  description?: string
  type: EventType
  start_date: string
  end_date?: string
  start_time?: string
  end_time?: string
  all_day: boolean
  classroom_id?: string
  visible_to: string[]
}

export interface EnrollmentPublicForm {
  parent_name: string
  parent_phone?: string
  parent_email: string
  parent_username: string
  child_name: string
  child_dob?: string
  class_preference?: string
  allergies?: string
  food_notes?: string
  medical_notes?: string
  emergency_name?: string
  emergency_phone?: string
  start_date?: string
  notes?: string
}
