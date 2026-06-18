import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-coral via-gold to-coral-soft py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none text-4xl leading-none overflow-hidden">
          {'★'.repeat(60)}
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="mb-5">
            <img src="/images/logo.png" alt="Mini Star Child Care" className="w-24 h-24 mx-auto object-contain drop-shadow-md" />
          </div>
          <span className="inline-block bg-night text-white text-xs font-800 px-4 py-1.5 rounded-full mb-4">
            ★ Curriculum-based program — birth to 12 years
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-600 text-night mb-4">
            Welcome to <span className="text-white drop-shadow">Mini Star</span><br />Child Care
          </h1>
          <p className="text-night/80 text-lg mb-3">
            Not just childcare — a complete child development program with daily lesson plans, progress tracking, and weekly parent reports.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-7 text-sm">
            <span className="bg-white/30 text-night font-700 px-3 py-1 rounded-full">📅 Daily Lesson Plans</span>
            <span className="bg-white/30 text-night font-700 px-3 py-1 rounded-full">📊 Progress Tracking</span>
            <span className="bg-white/30 text-night font-700 px-3 py-1 rounded-full">📝 Weekly Parent Reports</span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate('/enrollment')}>
              Enroll Today
            </button>
            <button type="button" className="btn btn-outline btn-lg border-night text-night hover:bg-night hover:text-white transition-colors" onClick={() => navigate('/programs')}>
              See Our Curriculum
            </button>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="bg-night py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { num: '10', label: 'Learning Domains' },
            { num: '4',  label: 'Age Programs' },
            { num: '24/7', label: 'Care Available' },
            { num: '0–12', label: 'Years Served' },
          ].map(({ num, label }) => (
            <div key={label} className="text-white">
              <div className="font-heading text-3xl font-600 text-gold">{num}</div>
              <div className="text-xs text-white/70 font-700 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EVERY CHILD IS UNIQUE */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="section-eyebrow">★ Where bright futures begin</p>
          <h2 className="text-night">Every child is unique</h2>
          <p className="text-gray-500 max-w-xl mx-auto mt-2">
            At Mini Star Child Care, we provide a safe, loving, and nurturing place where every child can learn, grow, and shine. We care for children from birth to 12 years old and support each child's development through play, learning, creativity, and positive guidance.
          </p>
          <p className="text-gray-500 max-w-xl mx-auto mt-2">
            Our goal is to give families peace of mind knowing their children are in a caring environment every day. We believe every child is unique, and we work hard to create a space where children feel happy, supported, and respected.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🛡️', title: 'Safe',     desc: 'A secure, nurturing environment where every child feels protected and comfortable.' },
            { icon: '❤️', title: 'Loving',   desc: 'Warm, caring relationships that support emotional development and wellbeing.' },
            { icon: '📚', title: 'Learning', desc: 'Research-based curriculum aligned with NAEYC DAP guidelines for every age group.' },
            { icon: '🌱', title: 'Growing',  desc: 'Helping each child grow at their own pace — physically, socially, and cognitively.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card text-center hover:shadow-card-hover transition-shadow">
              <div className="text-3xl mb-2">{icon}</div>
              <h3 className="font-heading font-600 text-night mb-1">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MORE THAN CHILDCARE */}
      <section className="bg-night py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-eyebrow text-gold">★ A complete development program</p>
            <h2 className="text-white">More Than Childcare —<br />A Complete Child Development Program</h2>
            <p className="text-white/60 max-w-xl mx-auto mt-2 text-sm">
              Every hour at Mini Star is intentional and purposeful. Your child is never just waiting — they are actively learning and building real skills every day.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { ic: '📅', b: 'Daily Curriculum',          s: 'Structured lesson plans for each age group, every single day — not free play all day' },
              { ic: '📊', b: 'Progress Tracking',         s: "Each child's development tracked across 10 domains and documented with notes" },
              { ic: '📝', b: 'Parent Reports',            s: 'Weekly learning summaries sent directly to you — know exactly what your child did' },
              { ic: '🎓', b: 'School Readiness',          s: 'Children assessed and prepared for kindergarten and beyond across all key areas' },
              { ic: '🏠', b: 'Life Readiness',            s: 'Practical self-care, responsibility, and emotional skills built into every daily routine' },
              { ic: '🔧', b: 'Project-Based Learning',    s: 'Real-world mini-projects that build critical thinking, creativity, and collaboration' },
              { ic: '🌟', b: 'Leadership Development',    s: 'Decision-making, teamwork, and peer mentoring practiced from an early age' },
              { ic: '💰', b: 'Financial Literacy',        s: 'Age-appropriate money concepts: saving, earning, budgeting, and the value of work' },
            ].map(({ ic, b, s }) => (
              <div key={b} className="bg-white/10 rounded-2xl p-4 text-white">
                <div className="text-2xl mb-2">{ic}</div>
                <b className="text-sm block mb-1">{b}</b>
                <span className="text-white/60 text-xs">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE LEARNING DAY */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <p className="section-eyebrow">★ A day in the curriculum</p>
        <h2 className="text-night mb-2">See What a Learning Day Looks Like</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Every age group follows its own structured daily schedule. Here's a sample day for our Preschool program (ages 3–5). Every activity maps directly to a learning domain:
        </p>
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="bg-night px-5 py-4 flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-heading text-white font-600">🎨 Weekly Theme: Colors &amp; Shapes</h3>
            <span className="text-xs bg-white/20 text-white font-700 px-3 py-1 rounded-full">Preschool · Ages 3–5</span>
          </div>
          <p className="text-xs text-gray-400 px-5 py-2 bg-gray-50 border-b border-gray-100">
            Sample Tuesday schedule — teacher-led, curriculum-aligned, domain-mapped
          </p>
          {[
            { time: '7:00',  ic: '🏠', act: 'Arrival & Morning Welcome Circle',      domain: 'Social-Emotional' },
            { time: '8:00',  ic: '🍳', act: 'Breakfast & Self-Care Routine',         domain: 'Practical Life' },
            { time: '8:30',  ic: '🔬', act: 'Morning Lesson: Colors in Nature',      domain: 'Science' },
            { time: '9:30',  ic: '🎨', act: 'Art Studio: Color Mixing Experiment',   domain: 'Creativity' },
            { time: '10:30', ic: '♻️', act: 'Outdoor Play & Shape Hunt Activity',    domain: 'Physical Dev.' },
            { time: '11:30', ic: '📚', act: 'Story Time & Comprehension Discussion', domain: 'Language' },
            { time: '2:30',  ic: '📐', act: 'Math Centers: Shape Sorting & Counting',domain: 'Mathematics' },
            { time: '3:30',  ic: '🌟', act: 'Leadership Circle: Helper of the Day', domain: 'Leadership' },
          ].map(({ time, ic, act, domain }) => (
            <div key={time} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
              <span className="text-xs font-800 text-gray-400 w-12 shrink-0">{time}</span>
              <span className="text-lg shrink-0">{ic}</span>
              <span className="flex-1 text-sm text-night font-600">{act}</span>
              <span className="text-xs font-700 bg-gold/10 text-gold px-2 py-0.5 rounded-full shrink-0">{domain}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5 flex-wrap">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/programs')}>View All Programs →</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/enrollment')}>Enroll Your Child</button>
        </div>
      </section>

      {/* PARENT PORTAL PREVIEW */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-eyebrow">★ Parent portal</p>
            <h2 className="text-night">Real-Time Visibility Into Your Child's Growth</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-2 text-sm">
              Every enrolled family gets full access to the Mini Star parent portal. See daily reports, track progress across all 10 learning domains, browse your child's portfolio, and message your caregiver directly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Daily Report */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm border-t-4 border-t-teal">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-800 text-night">📋 Today's Daily Report</span>
                <span className="text-[10px] text-gray-400 font-700">Preschool</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {['😊 Happy','🍽️ Ate well','😴 Short nap'].map((c) => (
                  <span key={c} className="text-[10px] font-700 px-2 py-0.5 rounded-full bg-green-50 text-green-700">{c}</span>
                ))}
              </div>
              <div className="text-[11px] bg-gray-50 rounded-xl p-2 mb-2">
                <b className="text-night block mb-1">Activities Completed</b>
                Color mixing art, shape sorting, outdoor nature walk, story time with discussion
              </div>
              <div className="text-[11px] bg-gray-50 rounded-xl p-2">
                <b className="text-night block mb-1">Caregiver Note</b>
                Excellent focus today! Identified 6 colors independently during art time ★
              </div>
            </div>

            {/* Progress Bars */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm border-t-4 border-t-gold">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-800 text-night">📊 Learning Progress</span>
                <span className="text-[10px] text-gray-400 font-700">This Month</span>
              </div>
              {[
                { label: 'Language',    pct: 82, color: 'bg-teal' },
                { label: 'Mathematics', pct: 74, color: 'bg-gold' },
                { label: 'Creativity',  pct: 91, color: 'bg-coral' },
                { label: 'Leadership',  pct: 68, color: 'bg-night' },
                { label: 'Life Skills', pct: 85, color: 'bg-gold' },
                { label: 'Fin. Literacy',pct: 61, color: 'bg-teal' },
              ].map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <span className="text-[10px] text-gray-500 w-20 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] font-800 text-gray-500 w-7 text-right">{pct}%</span>
                </div>
              ))}
            </div>

            {/* Weekly Summary */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm border-t-4 border-t-coral">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-800 text-night">📅 Weekly Summary</span>
                <span className="text-[10px] text-gray-400 font-700">This Week</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-[10px] font-700 px-2 py-0.5 rounded-full bg-green-50 text-green-700">5/5 Days Attended</span>
                <span className="text-[10px] font-700 px-2 py-0.5 rounded-full bg-green-50 text-green-700">8 Activities Done</span>
              </div>
              <div className="text-[11px] bg-gray-50 rounded-xl p-2 mb-2">
                <b className="text-night block mb-1">This Week's Theme</b>
                Colors &amp; Shapes — 3 new milestones reached
              </div>
              <div className="text-[11px] bg-gray-50 rounded-xl p-2">
                <b className="text-night block mb-1">Milestones Reached</b>
                ✅ Counts to 20 · ✅ Writes first name · ✅ Color mixing mastered
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm border-t-4 border-t-night">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-800 text-night">📱 Child Portfolio</span>
                <span className="text-[10px] text-gray-400 font-700">3 Items This Week</span>
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Color Mixing Art',          domain: 'Creativity',  note: 'Created a color wheel using primary colors independently' },
                  { title: 'Shape Sorting Challenge',   domain: 'Mathematics', note: 'Sorted 12 shapes correctly and explained the differences' },
                  { title: 'Helper of the Day',         domain: 'Leadership',  note: 'Led morning circle and assisted two classmates with tasks' },
                ].map(({ title, domain, note }) => (
                  <div key={title} className="bg-gray-50 rounded-xl p-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <b className="text-[11px] text-night">{title}</b>
                      <span className="text-[9px] font-700 bg-gold/20 text-gold px-1.5 py-0.5 rounded-full">{domain}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 bg-night rounded-2xl p-8 text-center">
            <h3 className="font-heading text-white font-600 text-xl mb-2">Ready to see your child grow?</h3>
            <p className="text-white/60 text-sm mb-5 max-w-md mx-auto">
              Enroll at Mini Star and get full access to daily reports, learning progress dashboards, child portfolio, and direct messaging with your caregiver.
            </p>
            <button type="button" className="btn bg-gold text-night font-700 hover:bg-gold/90 transition-colors px-6 py-3 rounded-xl" onClick={() => navigate('/enrollment')}>
              Enroll Now →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-night text-white/60 text-center py-6 text-xs font-700">
        ★ Mini Star Child Care — Where bright futures begin. SeaTac, WA ★
      </footer>
    </div>
  )
}
