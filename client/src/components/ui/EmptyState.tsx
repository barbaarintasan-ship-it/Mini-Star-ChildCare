interface EmptyStateProps {
  icon?: string
  title: string
  message?: string
  action?: React.ReactNode
}

export function EmptyState({ icon = '📭', title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="text-5xl mb-4 opacity-40">{icon}</span>
      <h3 className="font-heading text-lg font-600 text-gray-500 mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-400 max-w-xs">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
