import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMedications, useMedicationLogs, useAddMedication, useLogMedication, useDeactivateMedication } from '@/hooks/useMedications'
import { useChildren } from '@/hooks/useChildren'
import { useAuthStore } from '@/store/auth'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'
import { fmtDateTime, today } from '@/lib/utils'
import { Plus, Pill, CheckCircle, XCircle } from 'lucide-react'
import type { MedicationForm } from '@/types'

const schema = z.object({
  child_id: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  dosage: z.string().min(1, 'Required'),
  frequency: z.string().optional(),
  instructions: z.string().optional(),
  prescribed_by: z.string().optional(),
  parent_authorized: z.boolean(),
})

export default function MedicationsPage() {
  const { user } = useAuthStore()
  const isStaff = user?.role !== 'parent'
  const [showAddForm, setShowAddForm] = useState(false)
  const [logModal, setLogModal] = useState<string | null>(null) // medication id
  const [logNote, setLogNote] = useState('')
  const [logMissed, setLogMissed] = useState(false)

  const { data: medications = [], isLoading } = useMedications()
  const { data: todayLogs = [] } = useMedicationLogs(undefined, today())
  const { data: children = [] } = useChildren()
  const addMed = useAddMedication()
  const logMed = useLogMedication()
  const deactivate = useDeactivateMedication()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<MedicationForm>({
    resolver: zodResolver(schema),
    defaultValues: { parent_authorized: false },
  })

  async function onSubmit(data: MedicationForm) {
    await addMed.mutateAsync(data)
    setShowAddForm(false)
    reset()
  }

  async function handleLog() {
    if (!logModal) return
    const med = medications.find((m) => m.id === logModal)
    if (!med) return
    await logMed.mutateAsync({
      medicationId: med.id,
      childId: med.child_id,
      notes: logNote,
      missed: logMissed,
    })
    setLogModal(null)
    setLogNote('')
    setLogMissed(false)
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-heading text-2xl font-600 text-night">Medications</h1>
        {isStaff && (
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            <Plus size={16} /> Add Medication
          </Button>
        )}
      </div>

      {/* Today's log summary */}
      {todayLogs.length > 0 && (
        <div className="card bg-teal-soft">
          <p className="text-sm font-700 text-night mb-2">Today's Medication Log</p>
          <div className="space-y-1">
            {todayLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-2 text-xs">
                {log.missed
                  ? <XCircle size={14} className="text-red-500" />
                  : <CheckCircle size={14} className="text-teal" />}
                <span className="font-700 text-night">{log.medication?.name}</span>
                <span className="text-gray-500">— {fmtDateTime(log.given_at)}</span>
                {log.teacher && <span className="text-gray-400">by {log.teacher.name}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {medications.length === 0 ? (
        <EmptyState icon="💊" title="No medications"
          action={isStaff ? <Button size="sm" onClick={() => setShowAddForm(true)}><Plus size={14} /> Add</Button> : undefined}
        />
      ) : (
        <div className="space-y-3">
          {medications.map((med) => {
            const alreadyLogged = todayLogs.some((l) => l.medication_id === med.id && !l.missed)
            return (
              <Card key={med.id}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Pill size={18} className="text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-700 text-night">{med.name}</p>
                      {med.parent_authorized
                        ? <Badge color="green">Parent Authorized</Badge>
                        : <Badge color="amber">Awaiting Authorization</Badge>}
                      {alreadyLogged && <Badge color="teal">Given Today ✓</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-700">Dose:</span> {med.dosage} ·{' '}
                      <span className="font-700">Frequency:</span> {med.frequency ?? 'As needed'}
                    </p>
                    {med.instructions && (
                      <p className="text-xs text-gray-500 mt-1">📋 {med.instructions}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Child: {med.child?.name} {med.prescribed_by && `· Prescribed by: ${med.prescribed_by}`}
                    </p>
                  </div>
                  {isStaff && (
                    <div className="flex flex-col gap-1">
                      <Button variant="teal" size="sm" onClick={() => setLogModal(med.id)}>
                        Log Dose
                      </Button>
                      <Button variant="ghost" size="sm"
                        onClick={() => deactivate.mutate(med.id)}>
                        Deactivate
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Log dose modal */}
      <Modal open={!!logModal} onClose={() => setLogModal(null)} title="Log Medication Dose" size="sm">
        {logModal && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Medication: <strong>{medications.find(m => m.id === logModal)?.name}</strong>
            </p>
            <Textarea
              label="Notes (optional)"
              value={logNote}
              onChange={(e) => setLogNote(e.target.value)}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={logMissed} onChange={(e) => setLogMissed(e.target.checked)} />
              <span className="text-sm font-700 text-red-600">Mark as Missed</span>
            </label>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setLogModal(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleLog} loading={logMed.isPending}>
                {logMissed ? 'Log as Missed' : 'Confirm Given'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add medication modal */}
      <Modal open={showAddForm} onClose={() => { setShowAddForm(false); reset() }} title="Add Medication" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Select label="Child *" error={errors.child_id?.message} {...register('child_id')}>
            <option value="">Select child</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Medication Name *" error={errors.name?.message} {...register('name')} />
            <Input label="Dosage *" error={errors.dosage?.message} {...register('dosage')} />
            <Input label="Frequency" placeholder="e.g. Twice daily" {...register('frequency')} />
            <Input label="Prescribed By" {...register('prescribed_by')} />
          </div>
          <Textarea label="Instructions" {...register('instructions')} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('parent_authorized')} />
            <span className="text-sm font-700">Parent has authorized this medication</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => { setShowAddForm(false); reset() }}>Cancel</Button>
            <Button type="submit" loading={addMed.isPending}>Add Medication</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
