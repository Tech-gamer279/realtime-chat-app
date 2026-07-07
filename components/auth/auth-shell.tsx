import Link from 'next/link'
import type { ReactNode } from 'react'
import { MessagesSquare } from 'lucide-react'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: 'url(/hero-glow.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-background/70"
      />

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MessagesSquare className="size-5" />
            </span>
            <span className="text-xl font-semibold tracking-tight">Nebula</span>
          </Link>
          <h1 className="text-balance text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-pretty text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {children}
        </div>
      </div>
    </main>
  )
}
