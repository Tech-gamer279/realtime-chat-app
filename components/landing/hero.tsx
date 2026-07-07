import Link from 'next/link'
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
      {/* Background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          backgroundImage: 'url(/hero-glow.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/70 to-background"
      />

      {/* Floating orbs */}
      <div
        aria-hidden
        className="animate-float-slow animate-pulse-glow pointer-events-none absolute left-[12%] top-[24%] -z-10 size-64 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-slower animate-pulse-glow pointer-events-none absolute right-[10%] top-[40%] -z-10 size-72 rounded-full bg-accent/25 blur-3xl"
      />

      <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
        <Sparkles className="size-3.5 text-primary" />
        Realtime chat, voice notes & file sharing
      </div>

      <h1
        className="animate-fade-up mt-6 max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
        style={{ animationDelay: '0.08s' }}
      >
        Where your community{' '}
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          comes alive
        </span>
      </h1>

      <p
        className="animate-fade-up mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        style={{ animationDelay: '0.16s' }}
      >
        Nebula brings servers, channels, instant messaging, and rich file
        sharing into one beautiful, lightning-fast space. Built for teams,
        friends, and communities of every size.
      </p>

      <div
        className="animate-fade-up mt-9 flex flex-col items-center gap-3 sm:flex-row"
        style={{ animationDelay: '0.24s' }}
      >
        <Button asChild size="lg" className="group gap-2">
          <Link href="/auth/sign-up">
            Start for free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/auth/login">Open Nebula</Link>
        </Button>
      </div>

      <div
        className="animate-fade-up mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        style={{ animationDelay: '0.32s' }}
      >
        <span className="inline-flex items-center gap-2">
          <Zap className="size-4 text-primary" /> Realtime by default
        </span>
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" /> Secure & private
        </span>
        <span className="inline-flex items-center gap-2">
          <Sparkles className="size-4 text-primary" /> Free to start
        </span>
      </div>
    </section>
  )
}
