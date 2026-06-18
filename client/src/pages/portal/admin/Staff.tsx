import { useState } from 'react'
import { UserPlus, Edit2 } from 'lucide-react'
import { useStaff, useUpdateUser, useCreateUser } from '@/hooks/useStaff'
import { useClassrooms } from '@/hooks/useClassrooms'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { RoleBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import type { User } from '@/types'

const DEFAULT_CREATE = {
  name: '',
  role: 'teacher',
  username: '',
  email: '',
  phone: '',
  classroom_id: '',
  password: '',
}

export default function Staff() {
  const { data: staff = [], isLoading } = useStaff()
  const { data: classrooms = [] } = useClassrooms()
  const updateUser = useUpdateUser()
  const createUser = useCreateUser()

  const [editing, setEditing] = useState<User | null>(null)
  const [classId, setClassId] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState(DEFAULT_CREATE)

  function openEdit(u: User) {
    setEditing(u)
    setClassId(u.classroom_id ?? '')
  }

  async function saveEdit() {
    if (!editing) return
    await updateUser.mutateAsync({ id: editing.id, updates: { classroom_id: classId || null } })
    setEditing(null)
  }

  async function handleCreate() {
    if (!createForm.name || !createForm.username || !createForm.password) return
    await createUser.mutateAsync({
      ...createForm,
      classroom_id: createForm.classroom_id || undefined,
    })
    setShowCreate(false)
    setCreateForm(DEFAULT_CREATE)
  }

  if (isLoading) return <PageLoader />

  const teachers = staff.filter((s) => s.role === 'teacher')
  const admins = staff.filter((s) => s.role === 'admin')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-600 text-night">Staff</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <UserPlus size={14} /> Add Staff
        </Button>
      </div>

      {/* Admins */}
      {admins.length > 0 && (
        <div>
          <p className="text-xs font-800 uppercase text-gray-400 mb-2">Administrators</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {admins.map((u) => (
              <Card key={u.id}>
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-700 text-night truncate">{u.name}</p>
                    <p className="text-xs text-gray-400">@{u.username}</p>
                    <RoleBadge role={u.role} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Teachers */}
      <div>
        <p className="text-xs font-800 uppercase text-gray-400 mb-2">Teachers</p>
        {teachers.length === 0 ? (
          <EmptyState icon="🎓" title="No teachers yet" message="Use the Add Staff button to create a teacher account." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((u) => {
              const classroom = classrooms.find((c) => c.id === u.classroom_id)
              return (
                <Card key={u.id}>
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={u.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-700 text-night truncate">{u.name}</p>
                      <p className="text-xs text-gray-400">@{u.username}</p>
                      <RoleBadge role={u.role} />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    <span className="font-700">Classroom: </span>
                    {classroom?.name ?? <span className="text-amber-600">Not assigned</span>}
                  </div>
                  {u.email && <p className="text-xs text-gray-400 mb-3">{u.email}</p>}
                  <Button variant="outline" size="sm" className="w-full" onClick={() => openEdit(u)}>
                    <Edit2 size={13} /> Assign Classroom
                  </Button>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Assign classroom modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit — ${editing?.name}`} size="sm">
        {editing && (
          <div className="space-y-3">
            <Select label="Assign to Classroom" value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="">No classroom</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.age_group})</option>
              ))}
            </Select>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
              <Button className="flex-1" onClick={saveEdit} loading={updateUser.isPending}>Save</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create staff modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Staff Account" size="md">
        <div className="space-y-3">
          <Input
            label="Full Name"
            value={createForm.name}
            onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jane Smith"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Username"
              value={createForm.username}
              onChange={(e) => setCreateForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="janesmith"
            />
            <Input
              label="Password"
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="min 6 chars"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email (optional)"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="Phone (optional)"
              value={createForm.phone}
              onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Role"
              value={createForm.role}
              onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
              <option value="parent">Parent</option>
            </Select>
            <Select
              label="Classroom (optional)"
              value={createForm.classroom_id}
              onChange={(e) => setCreateForm((f) => ({ ...f, classroom_id: e.target.value }))}
            >
              <option value="">None</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              className="flex-1"
              onClick={handleCreate}
              loading={createUser.isPending}
              disabled={!createForm.name || !createForm.username || !createForm.password}
            >
              Create Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
