import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon?: string
  color?: 'gold' | 'teal' | 'coral' | 'night'
  sub?: string
  className?: string
}

const colorTop: Record<string, string> = {
  gold:  'border-t-gold',
  teal:  'border-t-teal',
  coral: 'border-t-coral',
  night: 'border-t-night',
}

export function StatCard({ label, value, icon, color = 'night', sub, className }: StatCardProps) {
  return (
    <div className={cn('card border-t-4', colorTop[color], className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-800 text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-heading font-600 text-night mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {icon && <span className="text-3xl opacity-60">{icon}</span>}
      </div>
    </div>
  )
}
