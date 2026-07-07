import { MessagesSquare } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessagesSquare className="size-4" />
          </span>
          <span className="font-semibold tracking-tight">Nebula</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built for communities. Realtime by default.
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nebula
        </p>
      </div>
    </footer>
  )
}
