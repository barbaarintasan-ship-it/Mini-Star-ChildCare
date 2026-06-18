import { useParents } from '@/hooks/useStaff'
import { useChildren } from '@/hooks/useChildren'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSkeleton'

export default function Parents() {
  const { data: parents = [], isLoading } = useParents()
  const { data: children = [] } = useChildren()

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-600 text-night">Parents</h1>

      {parents.length === 0 ? (
        <EmptyState icon="👨‍👩‍👧" title="No parent accounts yet"
          message="Parents can self-register from the Login page, or be invited via Supabase Auth." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parents.map((parent) => {
            const myChildren = children.filter((c) =>
              (c.parents ?? []).some((p) => (p as { id: string }).id === parent.id)
            )
            return (
              <Card key={parent.id}>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={parent.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-700 text-night truncate">{parent.name}</p>
                    <p className="text-xs text-gray-400">@{parent.username}</p>
                    {parent.email && <p className="text-xs text-gray-400 truncate">{parent.email}</p>}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-700">Children: </span>
                  {myChildren.length > 0
                    ? myChildren.map((c) => c.name).join(', ')
                    : <span className="text-amber-600">None linked</span>
                  }
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
