import { useNavigate } from 'react-router-dom'

const VALUES = [
  { icon: '🛡️', title: 'Safe',     desc: 'A secure, nurturing environment where every child feels protected and comfortable.' },
  { icon: '❤️', title: 'Loving',   desc: 'Warm, caring relationships that support emotional development and wellbeing.' },
  { icon: '📚', title: 'Learning', desc: 'Research-based curriculum aligned with NAEYC DAP guidelines for every age group.' },
  { icon: '🌱', title: 'Growing',  desc: 'Helping each child grow at their own pace — physically, socially, and cognitively.' },
]

const PROGRAMS = [
  { icon: '👶', title: 'Infants',    age: '0–12 months', desc: 'Tender care, comfort, feeding support, and early development foundations.' },
  { icon: '🧒', title: 'Toddlers',   age: '1–3 years',   desc: 'Safe play, language development, movement, and learning through routines.' },
  { icon: '🎨', title: 'Preschool',  age: '3–5 years',   desc: 'Early education activities, creativity, and school readiness preparation.' },
  { icon: '📖', title: 'School-Age', age: '5–12 years',  desc: 'Homework support, enrichment activities, and after-school care.' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-coral via-gold to-coral-soft py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none text-4xl">
          {'★'.repeat(40)}
        </div>
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-block bg-night text-white text-xs font-800 px-4 py-1.5 rounded-full mb-4">
            Caring for children from birth to age 12
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-600 text-night mb-4">
            Welcome to <span className="text-white drop-shadow">Mini Star</span><br />Child Care
          </h1>
          <p className="text-night/80 text-lg mb-8">
            A safe, loving, and nurturing place where every child can learn, grow, and shine.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="btn-primary btn btn-lg" onClick={() => navigate('/enrollment')}>
              Enroll Today
            </button>
            <button className="btn-outline btn btn-lg border-white text-night" onClick={() => navigate('/programs')}>
              Our Programs
            </button>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="section-eyebrow">Where bright futures begin</p>
          <h2 className="text-night">Every child is unique</h2>
          <p className="text-gray-500 max-w-xl mx-auto mt-2">
            At Mini Star Child Care, we offer a safe, caring, and welcoming place where every child
            can learn, grow, and shine.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VALUES.map(({ icon, title, desc }) => (
            <div key={title} className="card text-center hover:shadow-card-hover transition-shadow">
              <div className="text-3xl mb-2">{icon}</div>
              <h3 className="font-heading font-600 text-night mb-1">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS TEASER */}
      <section className="bg-night py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-eyebrow text-gold">Programs</p>
            <h2 className="text-white">Care for every age, birth to 12</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROGRAMS.map(({ icon, title, age, desc }) => (
              <div key={title} className="bg-white/10 rounded-2xl p-4 text-white text-center">
                <div className="text-3xl mb-2">{icon}</div>
                <h3 className="font-heading font-600">{title}</h3>
                <p className="text-gold text-xs font-700 mb-1">{age}</p>
                <p className="text-white/70 text-xs">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-night transition-colors"
              onClick={() => navigate('/programs')}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-night mb-3">Join the Mini Star Family</h2>
        <p className="text-gray-500 mb-6">
          We are now accepting enrollments. Contact us today to ask about availability.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="btn-primary btn btn-lg" onClick={() => navigate('/enrollment')}>
            Start Enrollment
          </button>
          <button className="btn-outline btn btn-lg" onClick={() => navigate('/contact')}>
            Contact Us
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-night text-white/60 text-center py-6 text-xs font-700">
        Mini Star Child Care — Where bright futures begin. SeaTac, WA
      </footer>
    </div>
  )
}
