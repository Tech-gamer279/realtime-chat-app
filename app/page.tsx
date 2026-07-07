import { LandingNav } from '@/components/landing/landing-nav'
import { Hero } from '@/components/landing/hero'
import { LogoMarquee } from '@/components/landing/logo-marquee'
import { Features } from '@/components/landing/features'
import { ChatPreview } from '@/components/landing/chat-preview'
import { CtaSection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/landing-footer'

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <LandingNav />
      <main>
        <Hero />
        <LogoMarquee />
        <Features />
        <ChatPreview />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
