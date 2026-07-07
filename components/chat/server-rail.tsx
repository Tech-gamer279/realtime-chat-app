'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Compass, LogOut, MessagesSquare } from 'lucide-react'
import type { Server } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { createServer, joinServer } from '@/app/app/actions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

function serverInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ServerRail({
  servers,
  activeServerId,
  onSelect,
  onServerCreated,
  onServerJoined,
}: {
  servers: Server[]
  activeServerId: string | null
  onSelect: (id: string) => void
  onServerCreated: (server: Server) => void
  onServerJoined: (server: Server) => void
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      if (mode === 'create') {
        const res = await createServer(name)
        if (res.error) {
          toast.error(res.error)
        } else if (res.server) {
          onServerCreated(res.server)
          toast.success(`Created ${res.server.name}`)
          setOpen(false)
          setName('')
        }
      } else {
        const res = await joinServer(code)
        if (res.error) {
          toast.error(res.error)
        } else if (res.server) {
          onServerJoined(res.server)
          toast.success(`Joined ${res.server.name}`)
          setOpen(false)
          setCode('')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider delayDuration={100}>
      <aside className="flex w-[72px] shrink-0 flex-col items-center gap-2 border-r border-border/60 bg-sidebar py-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <MessagesSquare className="size-6" />
        </div>
        <div className="my-1 h-px w-8 bg-border" />

        <div className="flex flex-1 flex-col items-center gap-2 overflow-y-auto">
          {servers.map((server) => {
            const active = server.id === activeServerId
            return (
              <Tooltip key={server.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onSelect(server.id)}
                    className={cn(
                      'flex size-12 items-center justify-center rounded-2xl text-sm font-semibold transition-all hover:rounded-xl',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-primary/80 hover:text-primary-foreground',
                    )}
                  >
                    {serverInitials(server.name)}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{server.name}</TooltipContent>
              </Tooltip>
            )
          })}

          <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <button className="flex size-12 items-center justify-center rounded-2xl bg-muted text-primary transition-all hover:rounded-xl hover:bg-primary hover:text-primary-foreground">
                    <Plus className="size-5" />
                  </button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Add a server</TooltipContent>
            </Tooltip>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {mode === 'create' ? 'Create a server' : 'Join a server'}
                </DialogTitle>
                <DialogDescription>
                  {mode === 'create'
                    ? 'Give your server a name. You can invite people afterwards.'
                    : 'Enter an invite code to join an existing server.'}
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={mode === 'create' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setMode('create')}
                >
                  <Plus className="size-4" /> Create
                </Button>
                <Button
                  type="button"
                  variant={mode === 'join' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setMode('join')}
                >
                  <Compass className="size-4" /> Join
                </Button>
              </div>

              {mode === 'create' ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="server-name">Server name</Label>
                  <Input
                    id="server-name"
                    placeholder="My awesome community"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing)
                        handleSubmit()
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="invite-code">Invite code</Label>
                  <Input
                    id="invite-code"
                    placeholder="e.g. 3fa9c1b2"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing)
                        handleSubmit()
                    }}
                  />
                </div>
              )}

              <Button onClick={handleSubmit} disabled={loading}>
                {mode === 'create' ? 'Create server' : 'Join server'}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleSignOut}
              className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-all hover:rounded-xl hover:bg-destructive hover:text-primary-foreground"
            >
              <LogOut className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Sign out</TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  )
}
