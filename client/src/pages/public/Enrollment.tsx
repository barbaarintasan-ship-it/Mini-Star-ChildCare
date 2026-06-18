import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useSubmitEnrollment } from '@/hooks/useEnrollments'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { EnrollmentPublicForm } from '@/types'

const schema = z.object({
  parent_name:     z.string().min(2, 'Required'),
  parent_email:    z.string().email('Valid email required'),
  parent_phone:    z.string().optional(),
  parent_username: z.string().min(3, 'Min 3 characters'),
  child_name:      z.string().min(2, 'Required'),
  child_dob:       z.string().optional(),
  class_preference:z.string().optional(),
  allergies:       z.string().optional(),
  food_notes:      z.string().optional(),
  medical_notes:   z.string().optional(),
  emergency_name:  z.string().optional(),
  emergency_phone: z.string().optional(),
  start_date:      z.string().optional(),
  notes:           z.string().optional(),
})

export default function Enrollment() {
  const [submitted, setSubmitted] = useState(false)
  const { data: classrooms = [] } = useClassrooms()
  const submit = useSubmitEnrollment()

  const { register, handleSubmit, formState: { errors } } = useForm<EnrollmentPublicForm>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: EnrollmentPublicForm) {
    await submit.mutateAsync(data)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <span className="text-5xl mb-4 block">🎉</span>
        <h2 className="text-night mb-2">Enrollment Request Sent!</h2>
        <p className="text-gray-500">
          Thank you! We have received your request and will contact you shortly to discuss availability.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <p className="section-eyebrow">Enrollment</p>
      <h2 className="text-night mb-2">We'd love to welcome your family</h2>
      <p className="text-gray-500 mb-8">
        Fill out the form below and we will contact you to discuss availability and next steps.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parent info */}
        <div className="card">
          <h3 className="font-heading font-600 text-night mb-4">Parent / Guardian Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name *" error={errors.parent_name?.message} {...register('parent_name')} />
            <Input label="Email *" type="email" error={errors.parent_email?.message} {...register('parent_email')} />
            <Input label="Phone" type="tel" {...register('parent_phone')} />
            <Input
              label="Choose a Username *"
              error={errors.parent_username?.message}
              placeholder="Used to log into the parent portal"
              {...register('parent_username')}
            />
          </div>
        </div>

        {/* Child info */}
        <div className="card">
          <h3 className="font-heading font-600 text-night mb-4">Child Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Child's Full Name *" error={errors.child_name?.message} {...register('child_name')} />
            <Input label="Date of Birth" type="date" {...register('child_dob')} />
            <Select label="Preferred Classroom" {...register('class_preference')}>
              <option value="">— Select classroom —</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.age_group})</option>
              ))}
            </Select>
            <Input label="Desired Start Date" type="date" {...register('start_date')} />
          </div>
        </div>

        {/* Health / special needs */}
        <div className="card">
          <h3 className="font-heading font-600 text-night mb-4">Health &amp; Special Notes</h3>
          <div className="space-y-3">
            <Textarea label="Allergies" placeholder="List any allergies..." {...register('allergies')} />
            <Textarea label="Food / Dietary Notes" placeholder="Halal only, no dairy, etc." {...register('food_notes')} />
            <Textarea label="Medical Notes" placeholder="Diagnoses, medications, etc." {...register('medical_notes')} />
          </div>
        </div>

        {/* Emergency */}
        <div className="card">
          <h3 className="font-heading font-600 text-night mb-4">Emergency Contact</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Contact Name" {...register('emergency_name')} />
            <Input label="Contact Phone" type="tel" {...register('emergency_phone')} />
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <Textarea label="Additional Notes" placeholder="Anything else we should know?" {...register('notes')} />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={submit.isPending}>
          Submit Enrollment Request
        </Button>
      </form>
    </div>
  )
}
