import { Hash, Users, Plus, Send } from 'lucide-react'

const servers = ['N', 'G', 'D', 'S']
const channels = ['general', 'announcements', 'design', 'random']
const messages = [
  {
    name: 'Nova',
    color: 'bg-chart-1',
    text: 'Just pushed the new realtime sync — messages are instant now ⚡',
    time: '9:41',
  },
  {
    name: 'Kai',
    color: 'bg-chart-2',
    text: 'Incredible. The file previews look so clean too.',
    time: '9:42',
  },
  {
    name: 'Mira',
    color: 'bg-chart-3',
    text: 'Dropping the launch assets here 👇',
    time: '9:44',
    attachment: true,
  },
]

export function ChatPreview() {
  return (
    <section id="preview" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            A workspace that feels alive
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Servers, channels, and realtime messages — exactly how you would
            expect, only faster and more beautiful.
          </p>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="animate-pulse-glow pointer-events-none absolute inset-x-10 -top-6 -z-10 h-40 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="mx-auto flex h-[520px] max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
            {/* Server rail */}
            <div className="hidden w-16 flex-col items-center gap-3 border-r border-border/60 bg-sidebar py-4 sm:flex">
              {servers.map((s, i) => (
                <span
                  key={s}
                  className={`flex size-11 items-center justify-center rounded-2xl text-sm font-semibold text-primary-foreground ${
                    i === 0 ? 'bg-primary' : 'bg-muted text-foreground'
                  }`}
                >
                  {s}
                </span>
              ))}
              <span className="flex size-11 items-center justify-center rounded-2xl bg-muted text-primary">
                <Plus className="size-5" />
              </span>
            </div>

            {/* Channels */}
            <div className="hidden w-48 flex-col border-r border-border/60 bg-sidebar/60 p-3 md:flex">
              <p className="px-2 pb-2 text-sm font-semibold">Nebula HQ</p>
              <div className="flex flex-col gap-0.5">
                {channels.map((c, i) => (
                  <span
                    key={c}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                      i === 0
                        ? 'bg-primary/15 text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Hash className="size-4" />
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <span className="flex items-center gap-2 font-medium">
                  <Hash className="size-4 text-muted-foreground" />
                  general
                </span>
                <Users className="size-4 text-muted-foreground" />
              </div>

              <div className="flex flex-1 flex-col justify-end gap-4 p-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className="animate-fade-up flex gap-3"
                    style={{ animationDelay: `${0.15 * i}s` }}
                  >
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground ${m.color}`}
                    >
                      {m.name[0]}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold">{m.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {m.time}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90">{m.text}</p>
                      {m.attachment && (
                        <div className="mt-2 flex h-28 w-44 items-center justify-center rounded-lg border border-border/60 bg-gradient-to-br from-primary/30 to-accent/30 text-xs text-foreground/80">
                          launch-hero.png
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/60 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-input px-3 py-2">
                  <Plus className="size-4 text-muted-foreground" />
                  <span className="flex-1 text-sm text-muted-foreground">
                    Message #general
                  </span>
                  <Send className="size-4 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
