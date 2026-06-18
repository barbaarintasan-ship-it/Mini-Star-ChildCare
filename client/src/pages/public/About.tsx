import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* Intro */}
      <section>
        <p className="section-eyebrow">★ About Us</p>
        <h2 className="text-night mb-6">Built on love, trust, learning &amp; family support</h2>
        <div className="space-y-4">
          <div className="card border-t-4 border-t-gold">
            <p className="text-gray-600 text-sm">
              We understand that choosing childcare is an important decision. That is why we are committed to providing a warm, home-like environment where children feel safe and welcome. Our caregivers focus on kindness, patience, and attentive care so each child receives the support they need to grow with confidence.
            </p>
          </div>
          <div className="card border-t-4 border-t-teal">
            <p className="text-gray-600 text-sm">
              We believe children learn best through positive experiences, meaningful play, and caring relationships. At Mini Star Child Care, we help children build early social, emotional, and learning skills that prepare them for the future.
            </p>
          </div>
          <div className="card border-t-4 border-t-coral">
            <p className="font-700 text-night text-sm">
              Our mission is simple: to care for children with love while helping them learn and thrive every day.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Philosophy */}
      <section>
        <p className="section-eyebrow">★ Our educational philosophy</p>
        <h3 className="font-heading text-xl font-600 text-night mb-2">We raise whole children, not just well-behaved ones</h3>
        <p className="text-gray-500 text-sm mb-6">
          At Mini Star, every child who walks through our doors is treated as a future leader, thinker, and contributor. Our structured curriculum is designed to develop children who are:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { ic: '🔍', b: 'Curious Learners',           s: 'Children who ask "why" and explore the world with open minds' },
            { ic: '🧠', b: 'Independent Thinkers',        s: 'Who reason through problems and form their own ideas' },
            { ic: '🔭', b: 'Creative Problem Solvers',    s: 'Who see challenges as opportunities and find original solutions' },
            { ic: '🌟', b: 'Responsible Individuals',     s: 'Who respect others, follow through, and take ownership' },
            { ic: '💬', b: 'Effective Communicators',     s: 'Who listen carefully and express themselves clearly and confidently' },
            { ic: '🎨', b: 'Creative Innovators',         s: 'Who bring fresh ideas, imagination, and inventive thinking' },
            { ic: '❤️', b: 'Emotionally Intelligent',     s: 'Who understand their own feelings and empathize with others' },
            { ic: '★',  b: 'Future Leaders',              s: 'Who inspire, support, and uplift the people around them' },
          ].map(({ ic, b, s }) => (
            <div key={b} className="card flex items-start gap-3">
              <span className="text-2xl shrink-0">{ic}</span>
              <div>
                <b className="text-sm text-night block mb-0.5">{b}</b>
                <span className="text-xs text-gray-500">{s}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How Teachers Teach */}
      <section>
        <div className="card">
          <p className="section-eyebrow mb-2">★ How our caregivers teach</p>
          <h3 className="font-heading text-xl font-600 text-night mb-2">Structured, intentional, and responsive — every single day</h3>
          <p className="text-gray-500 text-sm mb-5">
            Our caregivers don't just supervise — they teach with intention. Here's how the curriculum comes to life each day:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { ic: '☀️', b: 'Morning Prep',         s: "Caregiver reviews the day's lesson plan, materials, and each child's active goals before the day begins" },
              { ic: '📅', b: 'Daily Lesson Plans',   s: 'Each age group follows a structured schedule with objectives, activities, materials list, and assessment checklist' },
              { ic: '👁️', b: 'Live Observation',      s: "During activities, caregivers observe and document each child's participation, focus, and skill development" },
              { ic: '✅', b: 'Lesson Completion',    s: 'Activities are marked complete, partial, or not attempted — creating an accurate daily record' },
              { ic: '📊', b: 'Milestone Tracking',   s: "When a child reaches a development milestone, it's immediately recorded in their personal profile" },
              { ic: '📋', b: 'Daily Report',          s: 'Each day closes with a full report: mood, meals, nap, activities, and personalized caregiver notes' },
              { ic: '📝', b: 'Parent Communication', s: 'Reports are auto-populated from completed curriculum activities and delivered to parents through the portal' },
              { ic: '🕐', b: 'Weekly Planning',      s: "Caregivers plan the following week's curriculum theme, activities, and differentiated goals for each child" },
            ].map(({ ic, b, s }) => (
              <div key={b} className="flex items-start gap-2">
                <span className="text-xl shrink-0">{ic}</span>
                <div>
                  <b className="text-sm text-night block mb-0.5">{b}</b>
                  <span className="text-xs text-gray-500">{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Benefits */}
      <section>
        <p className="section-eyebrow">★ For parents</p>
        <h3 className="font-heading text-xl font-600 text-night mb-2">Stay connected to your child's learning every single day</h3>
        <p className="text-gray-500 text-sm mb-5">Through the Mini Star parent portal, families have full transparency into their child's education:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { ic: '📋', b: 'Daily Learning Reports',  s: "See exactly what your child worked on, what they ate, their mood, and a personal note from their caregiver" },
            { ic: '📊', b: 'Domain Progress Bars',    s: 'Visual progress tracking across all 10 learning domains updated in real time' },
            { ic: '✅', b: 'Milestone Notifications', s: "Instantly know when your child reaches a new development milestone — never miss a breakthrough" },
            { ic: '📱', b: 'Child Portfolio',          s: "A growing digital record of your child's best work, projects, and learning moments" },
            { ic: '📅', b: 'Weekly Summaries',         s: 'Auto-generated weekly learning summaries with theme, activities completed, and milestones reached' },
            { ic: '🌟', b: 'Readiness Scores',         s: 'School readiness and life readiness scores tracked across 8 categories so you always know where your child stands' },
            { ic: '💬', b: 'Direct Messaging',         s: 'Communicate directly with your child\'s caregiver anytime — ask questions, share updates, stay connected' },
            { ic: '💰', b: 'Payment Tracking',         s: 'View invoices, payment history, and upcoming balances — all in one place' },
          ].map(({ ic, b, s }) => (
            <div key={b} className="card flex items-start gap-3">
              <span className="text-xl shrink-0">{ic}</span>
              <div>
                <b className="text-sm text-night block mb-0.5">{b}</b>
                <span className="text-xs text-gray-500">{s}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Highlights */}
      <section>
        <p className="section-eyebrow">★ Curriculum highlights</p>
        <h3 className="font-heading text-xl font-600 text-night mb-2">Beyond the basics — building skills for life</h3>
        <p className="text-gray-500 text-sm mb-5">What separates Mini Star from ordinary daycare — seven domains you won't find everywhere:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { ic: '🧠', b: 'Critical Thinking',            s: 'Age-appropriate reasoning, analysis, and creative problem-solving in every lesson', bg: 'bg-night text-white' },
            { ic: '🌟', b: 'Leadership Development',       s: 'Responsibility, decision-making, peer mentoring, and confidence-building from infancy', bg: 'bg-teal/10 text-teal' },
            { ic: '💰', b: 'Financial Literacy',           s: 'Money value, saving, earning, and responsible spending taught at every age level', bg: 'bg-gold/10 text-gold' },
            { ic: '💡', b: 'Entrepreneurship Foundations', s: 'Creative thinking, initiative, and mini business projects for preschool and school-age', bg: 'bg-coral/10 text-coral' },
            { ic: '🎨', b: 'Creativity & Innovation',      s: 'Art, music, dramatic play, and open-ended exploration built into every week', bg: 'bg-teal/10 text-teal' },
            { ic: '❤️', b: 'Emotional Intelligence',       s: 'Self-regulation, empathy, conflict resolution, and healthy social relationships', bg: 'bg-gold/10 text-gold' },
            { ic: '🏠', b: 'Practical Life Skills',        s: 'Self-care, tidiness, routines, and real-world independence from the earliest age', bg: 'bg-night/10 text-night' },
          ].map(({ ic, b, s, bg }) => (
            <div key={b} className={`rounded-2xl p-4 ${bg}`}>
              <div className="text-2xl mb-2">{ic}</div>
              <b className="text-sm block mb-1">{b}</b>
              <span className="text-xs opacity-80">{s}</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/programs')}>
            See Our Full Programs →
          </button>
        </div>
      </section>

    </div>
  )
}
