export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="section-eyebrow">Contact</p>
      <h2 className="text-night mb-3">We'd love to hear from you</h2>
      <p className="text-gray-500 mb-8">
        If you have questions about our services, enrollment, or availability, reach out to Mini Star Child Care.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: '📞', label: 'Phone',   value: '(206) 555-0123', href: 'tel:+12065550123' },
          { icon: '✉️', label: 'Email',   value: 'info@ministarchild.com', href: 'mailto:info@ministarchild.com' },
          { icon: '📍', label: 'Address', value: 'SeaTac, Washington', href: '#' },
          { icon: '🕐', label: 'Hours',   value: 'Open 24 Hours, 7 Days a Week', href: '#' },
        ].map(({ icon, label, value, href }) => (
          <div key={label} className="card flex items-start gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-xs font-800 text-gray-400 uppercase">{label}</p>
              <a href={href} className="text-night font-700 text-sm hover:text-gold transition-colors">
                {value}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-6 text-center bg-night text-white">
        <p className="font-heading text-lg font-600 mb-1">Ready to enroll?</p>
        <p className="text-white/70 text-sm mb-4">
          Serving families in SeaTac, Washington and surrounding areas.
        </p>
        <a href="tel:+12065550123" className="btn-primary btn inline-flex">
          Call Us Now
        </a>
      </div>
    </div>
  )
}
