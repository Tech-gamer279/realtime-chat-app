import { MessagesSquare } from 'lucide-react'

export function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <MessagesSquare className="size-8" />
      </span>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 max-w-sm text-pretty text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
