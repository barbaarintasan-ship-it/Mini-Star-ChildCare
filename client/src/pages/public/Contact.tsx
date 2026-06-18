export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="section-eyebrow">★ Contact</p>
      <h2 className="text-night mb-3">We would love to hear from you</h2>
      <p className="text-gray-500 mb-8 text-sm">
        If you have questions about our child care services, enrollment, or openings, please contact Mini Star Child Care using the information below:
      </p>

      <div className="card bg-night text-white space-y-5">
        {[
          { ic: '📞', label: 'Phone',   value: '(206) 255-4000',               href: 'tel:+12062554000' },
          { ic: '✉️', label: 'Email',   value: 'ministarchildcare14@gmail.com', href: 'mailto:ministarchildcare14@gmail.com' },
          { ic: '📍', label: 'Address', value: '17735 38th Ave South, SeaTac, WA 98188', href: 'https://maps.google.com/?q=17735+38th+Ave+South,+SeaTac,+WA+98188' },
          { ic: '🕐', label: 'Hours',   value: 'Open 24 Hours – 7 Days a Week', href: null },
        ].map(({ ic, label, value, href }) => (
          <div key={label} className="flex items-start gap-4">
            <span className="text-2xl shrink-0">{ic}</span>
            <div>
              <p className="text-xs font-800 text-white/50 uppercase mb-0.5">{label}</p>
              {href ? (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-white font-700 text-sm hover:text-gold transition-colors">
                  {value}
                </a>
              ) : (
                <p className="text-white font-700 text-sm">{value}</p>
              )}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-3 pt-2">
          <a href="tel:+12062554000" className="btn bg-night-2 text-white border border-white/20 hover:bg-white hover:text-night transition-colors flex-1 text-center min-w-[120px] font-700 text-sm px-4 py-2.5 rounded-xl">
            📞 Call Us
          </a>
          <a href="https://maps.google.com/?q=17735+38th+Ave+South,+SeaTac,+WA+98188" target="_blank" rel="noopener noreferrer" className="btn bg-gold text-night hover:bg-gold/90 transition-colors flex-1 text-center min-w-[120px] font-700 text-sm px-4 py-2.5 rounded-xl">
            📍 Get Directions
          </a>
          <a href="mailto:ministarchildcare14@gmail.com" className="btn bg-teal text-white hover:bg-teal/90 transition-colors flex-1 text-center min-w-[120px] font-700 text-sm px-4 py-2.5 rounded-xl">
            ✉️ Email Us
          </a>
        </div>
      </div>

      <p className="text-gray-400 text-xs mt-6 text-center font-700">
        Serving families in SeaTac, Washington and the surrounding area. ★
      </p>
    </div>
  )
}
