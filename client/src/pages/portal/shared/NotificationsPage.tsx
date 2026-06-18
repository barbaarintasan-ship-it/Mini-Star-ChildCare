import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDateTime, cn } from '@/lib/utils'

const TYPE_ICON: Record<string, string> = {
  message:           '💬',
  report:            '📋',
  attendance:        '✅',
  incident:          '⚠️',
  medication:        '💊',
  enrollment:        '📝',
  event:             '📅',
  system:            '🔔',
}

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()

  const unread = notifications.filter((n) => !n.read).length

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-600 text-night">Notifications</h1>
          {unread > 0 && (
            <p className="text-sm text-gray-400">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAll.mutate()}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" message="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn('cursor-pointer transition-colors', !n.read && 'border-l-4 border-l-gold')}
              onClick={() => { if (!n.read) markRead.mutate(n.id) }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5">
                  {TYPE_ICON[n.type] ?? '🔔'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-700', !n.read ? 'text-night' : 'text-gray-600')}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 bg-gold rounded-full mt-1.5 shrink-0" />
                    )}
                  </div>
                  {n.message && (
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">{fmtDateTime(n.created_at)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
