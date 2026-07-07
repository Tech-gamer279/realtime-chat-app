import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section id="cta" className="px-4 py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card/60 px-6 py-16 text-center backdrop-blur-xl sm:px-12">
        <div
          aria-hidden
          className="animate-pulse-glow pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-pulse-glow pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-accent/25 blur-3xl"
        />

        <h2 className="relative text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Bring your community together
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
          Create your first server in seconds. Free to start, delightful to use,
          and ready for whatever you build.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="group gap-2">
            <Link href="/auth/sign-up">
              Create your server
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
