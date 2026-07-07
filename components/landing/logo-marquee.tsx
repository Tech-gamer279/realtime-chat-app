const items = [
  'Gaming guilds',
  'Startup teams',
  'Study groups',
  'Creators',
  'Open source',
  'Dev communities',
  'Book clubs',
  'Esports orgs',
]

export function LogoMarquee() {
  return (
    <section className="border-y border-border/60 bg-card/30 py-6">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by every kind of community
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-10 pr-10">
            {[...items, ...items].map((item, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-lg font-medium text-muted-foreground/80"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
