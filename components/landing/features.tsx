import {
  MessagesSquare,
  FolderUp,
  Server,
  Hash,
  Smile,
  Users,
  Zap,
  ShieldCheck,
} from 'lucide-react'

const features = [
  {
    icon: MessagesSquare,
    title: 'Realtime messaging',
    desc: 'Messages appear instantly across every device with live typing and presence.',
  },
  {
    icon: FolderUp,
    title: 'Rich file sharing',
    desc: 'Drag and drop images, docs, video and audio. Inline previews for everything.',
  },
  {
    icon: Server,
    title: 'Servers & spaces',
    desc: 'Spin up dedicated servers for teams, friends, or huge public communities.',
  },
  {
    icon: Hash,
    title: 'Organized channels',
    desc: 'Structure conversations into topic channels so nothing gets lost.',
  },
  {
    icon: Smile,
    title: 'Reactions',
    desc: 'React to any message with emoji and keep the vibe going.',
  },
  {
    icon: Users,
    title: 'Member lists',
    desc: 'See who is online at a glance with live member presence per server.',
  },
  {
    icon: Zap,
    title: 'Blazing fast',
    desc: 'Built on a realtime backend that keeps everyone in perfect sync.',
  },
  {
    icon: ShieldCheck,
    title: 'Private & secure',
    desc: 'Row-level security means members only ever see what they should.',
  },
]

export function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything you need to connect
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            All the features you love from the best chat platforms, reimagined
            in one focused, beautiful app.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border/60 bg-card/50 p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-card"
            >
              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
