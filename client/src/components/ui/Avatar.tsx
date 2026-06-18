import { cn, initials } from '@/lib/utils'

interface AvatarProps {
  name: string
  url?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClass = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

// Deterministic color based on name
const COLORS = [
  'bg-night',
  'bg-gold',
  'bg-teal',
  'bg-coral',
  'bg-purple-500',
  'bg-blue-500',
  'bg-pink-500',
]

function colorFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export function Avatar({ name, url, size = 'md', className }: AvatarProps) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={cn('avatar object-cover', sizeClass[size], className)}
      />
    )
  }

  return (
    <span
      className={cn('avatar', colorFor(name), sizeClass[size], className)}
      title={name}
    >
      {initials(name)}
    </span>
  )
}
