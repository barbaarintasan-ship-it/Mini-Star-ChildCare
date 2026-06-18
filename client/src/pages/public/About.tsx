import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="section-eyebrow">About Us</p>
      <h2 className="text-night mb-4">Built on love, trust, learning &amp; family support</h2>

      <div className="prose prose-sm text-gray-600 space-y-4">
        <p>
          We understand that choosing child care is an important decision. That's why we are committed
          to providing a warm, homelike environment where every child is known, loved, and celebrated.
        </p>
        <p>
          We believe children learn best through positive experiences, meaningful play, and nurturing
          relationships. Our staff is trained, caring, and passionate about early childhood education.
        </p>
        <p className="font-700 text-night">
          Our mission is simple: care for children with love while helping them learn and thrive every day.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {[
          { icon: '🏠', title: 'Home-Like Setting', desc: 'A cozy, safe space that feels like a second home.' },
          { icon: '🎓', title: 'Trained Staff',     desc: 'Qualified caregivers committed to child development.' },
          { icon: '🌍', title: 'Inclusive',         desc: 'Welcoming families of all backgrounds and cultures.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="card text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-heading font-600 text-night text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button className="btn-primary btn" onClick={() => navigate('/programs')}>
          View Our Programs
        </button>
      </div>
    </div>
  )
}
