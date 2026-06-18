import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { PublicNav } from '@/components/layout/PublicNav'
import { PortalLayout } from '@/components/layout/PortalSidebar'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth'
import { useChildren } from '@/hooks/useChildren'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { childAge } from '@/lib/utils'
import type { UserRole } from '@/types'

// ── Lazy-load all pages ────────────────────────────────────────
const Home       = lazy(() => import('@/pages/public/Home'))
const About      = lazy(() => import('@/pages/public/About'))
const Programs   = lazy(() => import('@/pages/public/Programs'))
const Enrollment = lazy(() => import('@/pages/public/Enrollment'))
const Contact    = lazy(() => import('@/pages/public/Contact'))
const Login      = lazy(() => import('@/pages/auth/Login'))

const AttendancePage    = lazy(() => import('@/pages/portal/shared/AttendancePage'))
const ReportsPage       = lazy(() => import('@/pages/portal/shared/ReportsPage'))
const MessagesPage      = lazy(() => import('@/pages/portal/shared/MessagesPage'))
const IncidentsPage     = lazy(() => import('@/pages/portal/shared/IncidentsPage'))
const MedicationsPage   = lazy(() => import('@/pages/portal/shared/MedicationsPage'))
const PortfolioPage     = lazy(() => import('@/pages/portal/shared/PortfolioPage'))
const CalendarPage      = lazy(() => import('@/pages/portal/shared/CalendarPage'))
const NotificationsPage = lazy(() => import('@/pages/portal/shared/NotificationsPage'))

const AdminDashboard = lazy(() => import('@/pages/portal/admin/AdminDashboard'))
const Children       = lazy(() => import('@/pages/portal/admin/Children'))
const Enrollments    = lazy(() => import('@/pages/portal/admin/Enrollments'))
const Staff          = lazy(() => import('@/pages/portal/admin/Staff'))
const Parents        = lazy(() => import('@/pages/portal/admin/Parents'))

const TeacherDashboard = lazy(() => import('@/pages/portal/teacher/TeacherDashboard'))
const ParentDashboard  = lazy(() => import('@/pages/portal/parent/ParentDashboard'))

// ── Query Client ───────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// ── Auth guard ─────────────────────────────────────────────────
function RequireAuth({ roles }: { roles?: UserRole[] }) {
  useAuth()
  const { user, loading } = useAuthStore()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/portal" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/portal/dashboard" replace />
  return (
    <PortalLayout>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </PortalLayout>
  )
}

// ── Public layout ──────────────────────────────────────────────
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

// ── Role-specific dashboard ────────────────────────────────────
function DashboardRouter() {
  const { user } = useAuthStore()
  if (user?.role === 'admin')   return <AdminDashboard />
  if (user?.role === 'teacher') return <TeacherDashboard />
  return <ParentDashboard />
}

// ── Teacher: My Class page ─────────────────────────────────────
function TeacherMyClass() {
  const { user } = useAuthStore()
  const { data: children = [] } = useChildren()
  const myChildren = children.filter((c) => c.classroom_id === user?.classroom_id)

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-600 text-night">My Class</h1>
      {myChildren.length === 0 ? (
        <EmptyState icon="👶" title="No children assigned"
          message="Ask the admin to assign children to your classroom." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myChildren.map((child) => (
            <Card key={child.id}>
              <div className="flex items-center gap-3">
                <Avatar name={child.name} url={child.photo_url} size="lg" />
                <div>
                  <p className="font-700 text-night">{child.name}</p>
                  <p className="text-xs text-gray-400">{childAge(child.dob)}</p>
                  {child.allergies && (
                    <p className="text-xs text-red-600 mt-0.5">⚠️ {child.allergies}</p>
                  )}
                  {child.notes && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{child.notes}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              borderRadius: '12px',
            },
            duration: 3000,
          }}
        />

        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/"           element={<Home />} />
            <Route path="/about"      element={<About />} />
            <Route path="/programs"   element={<Programs />} />
            <Route path="/enrollment" element={<Enrollment />} />
            <Route path="/contact"    element={<Contact />} />
          </Route>

          {/* Login */}
          <Route path="/portal" element={
            <Suspense fallback={<PageLoader />}><Login /></Suspense>
          } />

          {/* Protected — all roles */}
          <Route element={<RequireAuth />}>
            <Route path="/portal/dashboard"     element={<DashboardRouter />} />
            <Route path="/portal/attendance"    element={<AttendancePage />} />
            <Route path="/portal/reports"       element={<ReportsPage />} />
            <Route path="/portal/messages"      element={<MessagesPage />} />
            <Route path="/portal/incidents"     element={<IncidentsPage />} />
            <Route path="/portal/medications"   element={<MedicationsPage />} />
            <Route path="/portal/portfolio"     element={<PortfolioPage />} />
            <Route path="/portal/calendar"      element={<CalendarPage />} />
            <Route path="/portal/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Admin only */}
          <Route element={<RequireAuth roles={['admin']} />}>
            <Route path="/portal/children"    element={<Children />} />
            <Route path="/portal/enrollments" element={<Enrollments />} />
            <Route path="/portal/staff"       element={<Staff />} />
            <Route path="/portal/parents"     element={<Parents />} />
          </Route>

          {/* Teacher only */}
          <Route element={<RequireAuth roles={['teacher']} />}>
            <Route path="/portal/my-class" element={<TeacherMyClass />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
