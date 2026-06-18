import { useState, useRef } from 'react'
import { usePortfolio, useCreatePortfolioEntry, useToggleLike, useDeletePortfolioEntry, uploadPortfolioMedia } from '@/hooks/usePortfolio'
import { useChildren } from '@/hooks/useChildren'
import { useAuthStore } from '@/store/auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDate } from '@/lib/utils'
import { Plus, Heart, Trash2, Upload, Image as ImageIcon } from 'lucide-react'

export default function PortfolioPage() {
  const { user } = useAuthStore()
  const isStaff = user?.role !== 'parent'
  const [childFilter, setChildFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    child_id: '',
    title: '',
    description: '',
    media_type: 'photo' as 'photo' | 'video' | 'note',
    activity_tags: '',
    date: new Date().toISOString().slice(0, 10),
  })

  const { data: entries = [], isLoading } = usePortfolio(childFilter || undefined)
  const { data: children = [] } = useChildren()
  const createEntry = useCreatePortfolioEntry()
  const toggleLike = useToggleLike()
  const deleteEntry = useDeletePortfolioEntry()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !form.child_id) return
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await uploadPortfolioMedia(file, form.child_id)
      setUploadedUrl(url)
    } catch {
      // Storage not configured — skip upload in demo
      setUploadedUrl(null)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.child_id || !form.title) return
    await createEntry.mutateAsync({
      child_id: form.child_id,
      title: form.title,
      description: form.description,
      media_url: uploadedUrl ?? undefined,
      media_type: form.media_type,
      activity_tags: form.activity_tags ? form.activity_tags.split(',').map(t => t.trim()) : [],
      date: form.date,
    })
    setShowForm(false)
    setForm({ child_id: '', title: '', description: '', media_type: 'photo', activity_tags: '', date: new Date().toISOString().slice(0, 10) })
    setUploadedUrl(null)
    setPreviewUrl(null)
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-heading text-2xl font-600 text-night">Portfolio</h1>
        {isStaff && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add Entry
          </Button>
        )}
      </div>

      {/* Filter by child */}
      <select
        className="input w-48"
        value={childFilter}
        onChange={(e) => setChildFilter(e.target.value)}
      >
        <option value="">All Children</option>
        {children.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {entries.length === 0 ? (
        <EmptyState icon="🖼️" title="No portfolio entries"
          message="Teachers can add photos, observations, and notes here."
          action={isStaff ? <Button size="sm" onClick={() => setShowForm(true)}><Plus size={14} /> Add Entry</Button> : undefined}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-0 overflow-hidden">
              {/* Media */}
              {entry.media_url && entry.media_type === 'photo' ? (
                <img
                  src={entry.media_url}
                  alt={entry.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-20 bg-gradient-to-br from-night-soft to-teal-soft flex items-center justify-center">
                  <span className="text-3xl opacity-40">
                    {entry.media_type === 'note' ? '📝' : entry.media_type === 'video' ? '🎥' : '🖼️'}
                  </span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-700 text-night text-sm">{entry.title}</p>
                  {isStaff && (
                    <Button variant="ghost" size="sm" className="p-1 -m-1" onClick={() => deleteEntry.mutate(entry.id)}>
                      <Trash2 size={13} />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  {entry.child?.name} · {fmtDate(entry.date)} · {entry.teacher?.name}
                </p>
                {entry.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{entry.description}</p>
                )}
                {entry.activity_tags && entry.activity_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.activity_tags.map((tag) => (
                      <Badge key={tag} color="teal" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                )}

                {/* Like button */}
                <button
                  className="flex items-center gap-1.5 text-xs font-700 mt-2 transition-colors"
                  style={{ color: entry.liked_by?.includes(user!.id) ? '#FF7960' : '#9ca3af' }}
                  onClick={() => toggleLike.mutate({ entry })}
                >
                  <Heart size={14} fill={entry.liked_by?.includes(user!.id) ? 'currentColor' : 'none'} />
                  {entry.liked_by?.length ?? 0}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add entry modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Portfolio Entry" size="md">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Select label="Child *" value={form.child_id} onChange={(e) => setForm({ ...form, child_id: e.target.value })}>
            <option value="">Select child</option>
            {children.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" value={form.media_type} onChange={(e) => setForm({ ...form, media_type: e.target.value as 'photo' | 'video' | 'note' })}>
              <option value="photo">📷 Photo</option>
              <option value="note">📝 Note/Observation</option>
            </Select>
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <Input label="Activity Tags (comma separated)" placeholder="art, reading, outdoor" value={form.activity_tags} onChange={(e) => setForm({ ...form, activity_tags: e.target.value })} />

          {/* File upload */}
          {form.media_type === 'photo' && form.child_id && (
            <div>
              <p className="label mb-1">Photo Upload</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="preview" className="w-full h-32 object-cover rounded-xl" />
                  <button type="button" className="absolute top-2 right-2 btn-ghost btn btn-sm bg-white/80"
                    onClick={() => { setPreviewUrl(null); setUploadedUrl(null) }}>
                    ✕
                  </button>
                </div>
              ) : (
                <button type="button" className="btn-outline btn w-full h-20 gap-2"
                  onClick={() => fileInputRef.current?.click()}>
                  <Upload size={16} /> Upload Photo
                </button>
              )}
              {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={createEntry.isPending}>Add Entry</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
