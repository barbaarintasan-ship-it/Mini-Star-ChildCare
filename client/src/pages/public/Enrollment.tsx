import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useSubmitEnrollment } from '@/hooks/useEnrollments'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { EnrollmentPublicForm } from '@/types'

const FAQS = [
  { q: 'Is this a daycare or a curriculum-based program?', a: 'Mini Star is a curriculum-based child development program. While we provide full childcare, every hour is structured around age-appropriate lesson plans covering 10 development domains. Teachers follow daily schedules with clear learning objectives, track each child\'s progress, and deliver weekly reports to parents. We are not a drop-off and watch — we actively teach.' },
  { q: 'What ages do you serve?', a: 'We care for children from birth (infants) through age 12. We have four dedicated age programs: Infants (0–1 yr), Toddlers (1–3 yrs), Preschoolers (3–5 yrs), and School-Age (5–12 yrs). Each program has its own curriculum, daily schedule, and milestone tracking system tailored to that developmental stage.' },
  { q: 'How will I know what my child did each day?', a: 'Every enrolled family has access to the Mini Star parent portal. Each day, you receive a full daily report including your child\'s mood, meals, nap, completed curriculum activities, and a personalized note from your caregiver. Each week, you receive an auto-generated weekly summary showing the learning theme, activities completed, milestones reached, and domain progress bars.' },
  { q: 'Do you teach financial literacy and leadership to young children?', a: 'Yes. These are built into our curriculum at every age, scaled appropriately. Toddlers explore sharing and the concept of "mine vs. ours." Preschoolers use pretend stores, coin counting, and role play around the value of work. School-age children learn budgeting basics, create mini business plans, and practice peer leadership and mentoring. Financial literacy and leadership are woven into daily activities, not taught as separate classes.' },
  { q: 'What is school readiness and how do you measure it?', a: 'School readiness at Mini Star covers 8 areas: Language & Communication, Mathematical Thinking, Social-Emotional Readiness, Physical Development, Creative Thinking, Self-Regulation, Cultural Awareness, and Early Literacy. We score each child across these areas and track growth over time. Parents can view their child\'s readiness scores in the parent portal.' },
  { q: 'What are your hours and location?', a: 'Mini Star Child Care is open 24 hours, 7 days a week. We are located at 17735 38th Ave South, SeaTac, WA 98188, serving families in SeaTac and the surrounding area. You can reach us by phone at (206) 255-4000 or by email at ministarchildcare14@gmail.com.' },
  { q: 'How do I enroll my child?', a: 'Fill out the enrollment form below with your family information, your child\'s details, and any relevant notes. We will review your request and contact you to confirm availability and schedule a visit. You can also call us at (206) 255-4000 or email ministarchildcare14@gmail.com with any questions before enrolling.' },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2">
      {FAQS.map(({ q, a }, i) => (
        <div key={q} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="flex-1 font-700 text-night text-sm">{q}</span>
            {open === i ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 border-t border-gray-50 pt-3">{a}</div>
          )}
        </div>
      ))}
    </div>
  )
}

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
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
      <div>
        <p className="section-eyebrow">★ Enrollment</p>
        <h2 className="text-night mb-2">We're happy to welcome new families</h2>
      </div>

      {/* Why Choose Us */}
      <section>
        <p className="section-eyebrow">★ Why families choose us</p>
        <h3 className="font-heading text-xl font-600 text-night mb-2">What Makes Mini Star Different?</h3>
        <p className="text-gray-500 text-sm mb-5">This is not ordinary daycare. Here is what your child gets from day one:</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { ic: '📅', b: 'Structured Daily Curriculum',   s: 'Every day follows a lesson plan with clear objectives, activities, and learning outcomes — not free-play all day', border: 'border-l-teal' },
            { ic: '📊', b: 'Development Tracking',          s: "Each child's progress across 10 domains is tracked, documented, and shared with parents every week", border: 'border-l-gold' },
            { ic: '📝', b: 'Parent Communication',          s: 'Daily reports, weekly summaries, milestone alerts, and direct messaging with your caregiver — always in the loop', border: 'border-l-coral' },
            { ic: '🌟', b: 'Individual Growth Monitoring',  s: "Every child has their own growth profile with personalized milestones, portfolio, and caregiver observations", border: 'border-l-teal' },
            { ic: '🎓', b: 'School Readiness',              s: 'Formally assessed across 8 school-readiness areas so your child is prepared — academically and socially — before kindergarten', border: 'border-l-gold' },
            { ic: '🏠', b: 'Life Readiness',                s: 'Practical skills, emotional regulation, financial literacy, and leadership built into the curriculum — preparing children for real life', border: 'border-l-coral' },
          ].map(({ ic, b, s, border }) => (
            <div key={b} className={`card border-l-4 ${border} flex items-start gap-3`}>
              <span className="text-2xl shrink-0">{ic}</span>
              <div>
                <b className="text-sm text-night block mb-0.5">{b}</b>
                <span className="text-xs text-gray-500">{s}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <p className="section-eyebrow">★ Questions from families</p>
        <h3 className="font-heading text-xl font-600 text-night mb-5">Frequently Asked Questions</h3>
        <FAQ />
      </section>

      {/* Enrollment Form */}
      <div>
        <p className="section-eyebrow">★ Ready to join?</p>
        <h3 className="font-heading text-xl font-600 text-night mb-2">Enrollment Form</h3>
        <p className="text-gray-500 text-sm mb-8">
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
    </div>
  )
}
