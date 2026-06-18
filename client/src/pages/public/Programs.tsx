import { useNavigate } from 'react-router-dom'

const PROGRAMS = [
  {
    icon: '👶', title: 'Infants', age: '0–12 months', color: 'border-t-gold',
    desc: 'Tender care, comfort, feeding support, and early developmental foundations.',
    includes: ['Responsive feeding & diapering', 'Tummy time & sensory play', 'Music, story time & language', 'Secure attachment building'],
  },
  {
    icon: '🧒', title: 'Toddlers', age: '1–3 years', color: 'border-t-teal',
    desc: 'Safe exploration, language development, movement, and learning through daily routines.',
    includes: ['Language-rich environment', 'Gross & fine motor activities', 'Social play & parallel play', 'Toilet learning support'],
  },
  {
    icon: '🎨', title: 'Preschool', age: '3–5 years', color: 'border-t-coral',
    desc: 'Early education activities, creativity, and school readiness preparation.',
    includes: ['Pre-reading & early literacy', 'Math concepts & STEM exploration', 'Art, music & drama', 'Social-emotional learning'],
  },
  {
    icon: '📖', title: 'School-Age', age: '5–12 years', color: 'border-t-night-2',
    desc: 'Homework support, enrichment activities, and caring after-school environment.',
    includes: ['Homework help', 'STEM projects', 'Sports & outdoor activities', 'Character & leadership'],
  },
]

const DAILY = [
  'Age-appropriate learning activities',
  'Free play and social development',
  'Attentive, caring supervision',
  'Space to explore, discover, and grow at their own pace',
]

export default function Programs() {
  const navigate = useNavigate()
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <p className="section-eyebrow">Programs</p>
      <h2 className="text-night mb-2">Care for every age, birth to 12</h2>
      <p className="text-gray-500 mb-10">
        Our programs are designed to meet the needs of each age group with research-based,
        developmentally appropriate practices.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {PROGRAMS.map(({ icon, title, age, color, desc, includes }) => (
          <div key={title} className={`card border-t-4 ${color}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{icon}</span>
              <div>
                <h3 className="font-heading font-600 text-night">{title}</h3>
                <span className="text-xs font-700 text-gold">{age}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{desc}</p>
            <ul className="space-y-1">
              {includes.map((item) => (
                <li key={item} className="text-xs text-gray-500 flex items-start gap-2">
                  <span className="text-gold mt-0.5">★</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Daily includes */}
      <div className="card border-l-4 border-l-teal mb-8">
        <h3 className="font-heading font-600 text-night mb-3">Every day includes:</h3>
        <ul className="space-y-1">
          {DAILY.map((item) => (
            <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-teal mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500 mt-3">
          Our program helps children develop confidence, independence, and a love of learning.
        </p>
      </div>

      <div className="flex gap-3">
        <button className="btn-primary btn" onClick={() => navigate('/enrollment')}>
          Ask About Openings
        </button>
        <button className="btn-outline btn" onClick={() => navigate('/contact')}>
          Contact Us
        </button>
      </div>
    </div>
  )
}
