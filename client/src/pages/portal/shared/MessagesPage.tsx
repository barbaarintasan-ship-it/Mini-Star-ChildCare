import { useState, useEffect, useRef } from 'react'
import { useMessages, useSendMessage, useMarkRead, useConversations } from '@/hooks/useMessages'
import { useAllUsers } from '@/hooks/useStaff'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { RoleBadge } from '@/components/ui/Badge'
import { fmtDateTime, cn } from '@/lib/utils'
import { Send } from 'lucide-react'

export default function MessagesPage() {
  const { user } = useAuthStore()
  const { data: conversations = [] } = useConversations()
  const { data: allUsers = [] } = useAllUsers()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [text, setText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: messages = [] } = useMessages(selectedUserId ?? undefined)
  const sendMessage = useSendMessage()
  const markRead = useMarkRead()

  const selectedUser = allUsers.find((u) => u.id === selectedUserId)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages read when opening a conversation
  useEffect(() => {
    if (selectedUserId) markRead.mutate(selectedUserId)
  }, [selectedUserId])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !selectedUserId) return
    await sendMessage.mutateAsync({ to_id: selectedUserId, text: text.trim() })
    setText('')
  }

  // Users I can message (everyone except myself)
  const messageable = allUsers.filter((u) => u.id !== user?.id)

  return (
    <div className="flex h-[calc(100vh-7rem)] rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-card">
      {/* Conversation list */}
      <div className="w-64 flex flex-col border-r border-gray-100 shrink-0">
        <div className="p-3 border-b border-gray-100">
          <p className="font-heading font-600 text-night text-sm">Messages</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messageable.length === 0 ? (
            <EmptyState icon="💬" title="No users" />
          ) : (
            messageable.map((u) => (
              <button
                key={u.id}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50',
                  selectedUserId === u.id && 'bg-night-soft'
                )}
                onClick={() => setSelectedUserId(u.id)}
              >
                <Avatar name={u.name} url={u.avatar_url} size="sm" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-700 text-night truncate">{u.name}</p>
                  <p className="text-[10px] text-gray-400 capitalize">{u.role}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      {selectedUserId && selectedUser ? (
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Avatar name={selectedUser.name} url={selectedUser.avatar_url} size="sm" />
            <div>
              <p className="font-700 text-night text-sm">{selectedUser.name}</p>
              <RoleBadge role={selectedUser.role} />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <EmptyState icon="💬" title="Start a conversation" message={`Send a message to ${selectedUser.name}`} />
            )}
            {messages.map((msg) => {
              const isMe = msg.from_id === user?.id
              return (
                <div key={msg.id} className={cn('flex gap-2', isMe ? 'justify-end' : 'justify-start')}>
                  {!isMe && <Avatar name={selectedUser.name} size="sm" className="mt-1 shrink-0" />}
                  <div className={cn('max-w-xs rounded-2xl px-4 py-2', isMe ? 'bg-night text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm')}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={cn('text-[10px] mt-1', isMe ? 'text-white/50' : 'text-gray-400')}>
                      {fmtDateTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-end gap-2 px-4 py-3 border-t border-gray-100">
            <textarea
              className="input flex-1 resize-none"
              placeholder={`Message ${selectedUser.name}...`}
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(e)
                }
              }}
            />
            <Button type="submit" disabled={!text.trim()} loading={sendMessage.isPending}>
              <Send size={16} />
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm font-700">Select a conversation</p>
          </div>
        </div>
      )}
    </div>
  )
}
