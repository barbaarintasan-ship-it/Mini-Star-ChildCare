import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications'
import { useUnreadNotificationCount } from '@/hooks/useNotifications'
import { fmtDateTime } from '@/lib/utils'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { data: notifications = [] } = useNotifications()
  const { data: unread = 0 } = useUnreadNotificationCount()
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
        aria-label={`Notifications (${unread} unread)`}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-white text-[10px] font-800 rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-12 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-heading font-600 text-night text-sm">Notifications</h3>
              {unread > 0 && (
                <button
                  className="text-xs text-gold font-700 hover:underline"
                  onClick={() => markAll.mutate()}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-400">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors
                      ${!n.read ? 'bg-gold-soft/30' : ''}`}
                    onClick={() => {
                      if (!n.read) markRead.mutate(n.id)
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span className="w-2 h-2 bg-gold rounded-full mt-1.5 shrink-0" />
                      )}
                      <div className={!n.read ? '' : 'pl-4'}>
                        <p className="text-xs font-700 text-night">{n.title}</p>
                        {n.message && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">
                          {fmtDateTime(n.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
