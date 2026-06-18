import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useChildren, useCreateChild, useUpdateChild, useLinkParent, useUnlinkParent } from '@/hooks/useChildren'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useParents } from '@/hooks/useStaff'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { childAge, fmtDate } from '@/lib/utils'
import { Plus, Search, Edit2, Link2, X } from 'lucide-react'
import type { ChildForm, Child } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Required'),
  dob: z.string().min(1, 'Required'),
  classroom_id: z.string().min(1, 'Required'),
  allergies: z.string().optional(),
  food_notes: z.string().optional(),
  medical_notes: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  notes: z.string().optional(),
})

export default function Children() {
  const { data: children = [], isLoading } = useChildren()
  const { data: classrooms = [] } = useClassrooms()
  const { data: parents = [] } = useParents()
  const createChild = useCreateChild()
  const updateChild = useUpdateChild()
  const linkParent = useLinkParent()
  const unlinkParent = useUnlinkParent()

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Child | null>(null)
  const [linkingChild, setLinkingChild] = useState<Child | null>(null)

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ChildForm>({
    resolver: zodResolver(schema),
  })

  const filtered = children.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    reset()
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(child: Child) {
    setEditing(child)
    setValue('name', child.name)
    setValue('dob', child.dob)
    setValue('classroom_id', child.classroom_id ?? '')
    setValue('allergies', child.allergies ?? '')
    setValue('food_notes', child.food_notes ?? '')
    setValue('medical_notes', child.medical_notes ?? '')
    setValue('emergency_contact', child.emergency_contact ?? '')
    setValue('emergency_phone', child.emergency_phone ?? '')
    setValue('notes', child.notes ?? '')
    setShowForm(true)
  }

  async function onSubmit(data: ChildForm) {
    if (editing) {
      await updateChild.mutateAsync({ id: editing.id, form: data })
    } else {
      await createChild.mutateAsync(data)
    }
    setShowForm(false)
    reset()
    setEditing(null)
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-heading text-2xl font-600 text-night">Children</h1>
        <Button onClick={openAdd} size="sm">
          <Plus size={16} /> Add Child
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-9"
          placeholder="Search children..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon="👶" title="No children yet" message="Add a child to get started." action={<Button onClick={openAdd} size="sm"><Plus size={14} />Add Child</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((child) => (
            <Card key={child.id}>
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={child.name} url={child.photo_url} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-700 text-night truncate">{child.name}</p>
                  <p className="text-xs text-gray-400">{childAge(child.dob)} · {fmtDate(child.dob)}</p>
                  <Badge color="teal" className="mt-1">{child.classroom?.name ?? 'No class'}</Badge>
                </div>
              </div>

              {child.allergies && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-2 py-1 mb-2">
                  ⚠️ {child.allergies}
                </p>
              )}

              {/* Parents */}
              <div className="text-xs text-gray-500 mb-3">
                <span className="font-700">Parents: </span>
                {child.parents && child.parents.length > 0
                  ? child.parents.map((p) => (p as { name: string }).name).join(', ')
                  : 'None linked'}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(child)}>
                  <Edit2 size={13} /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setLinkingChild(child)}>
                  <Link2 size={13} /> Parents
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); reset() }}
        title={editing ? 'Edit Child' : 'Add Child'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name *" error={errors.name?.message} {...register('name')} />
            <Input label="Date of Birth *" type="date" error={errors.dob?.message} {...register('dob')} />
            <Select label="Classroom *" error={errors.classroom_id?.message} {...register('classroom_id')}>
              <option value="">Select classroom</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Input label="Emergency Contact" {...register('emergency_contact')} />
            <Input label="Emergency Phone" {...register('emergency_phone')} />
          </div>
          <Textarea label="Allergies" {...register('allergies')} />
          <Textarea label="Food Notes" {...register('food_notes')} />
          <Textarea label="Medical Notes" {...register('medical_notes')} />
          <Textarea label="Additional Notes" {...register('notes')} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => { setShowForm(false); reset() }}>Cancel</Button>
            <Button type="submit" loading={createChild.isPending || updateChild.isPending}>
              {editing ? 'Save Changes' : 'Add Child'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Link parents modal */}
      <Modal
        open={!!linkingChild}
        onClose={() => setLinkingChild(null)}
        title={`Link Parents — ${linkingChild?.name}`}
        size="sm"
      >
        {linkingChild && (
          <div className="space-y-3">
            {/* Currently linked */}
            {linkingChild.parents && linkingChild.parents.length > 0 && (
              <div>
                <p className="text-xs font-700 text-gray-500 mb-2 uppercase">Currently Linked</p>
                {linkingChild.parents.map((p) => {
                  const parent = p as { id: string; name: string }
                  return (
                    <div key={parent.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <p className="text-sm font-700 text-night">{parent.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => unlinkParent.mutate({ childId: linkingChild.id, parentId: parent.id })}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add parent */}
            <div>
              <p className="text-xs font-700 text-gray-500 mb-2 uppercase">Link a Parent</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {parents
                  .filter((p) => {
                    const currentIds = ((linkingChild.parents ?? []) as { id: string }[]).map(p => p.id)
                    return !currentIds.includes(p.id)
                  })
                  .map((p) => (
                    <button
                      key={p.id}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => linkParent.mutate({ childId: linkingChild.id, parentId: p.id })}
                    >
                      <Avatar name={p.name} size="sm" />
                      <div>
                        <p className="text-sm font-700 text-night">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.email}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
