'use client'

import { useState } from 'react'
import { Hash, Plus, ChevronDown, Copy, Check, Settings } from 'lucide-react'
import type { Channel, Profile, Server } from '@/lib/types'
import { createChannel } from '@/app/app/actions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export function ChannelSidebar({
  server,
  channels,
  activeChannelId,
  onSelectChannel,
  onChannelCreated,
  currentUser,
}: {
  server: Server
  channels: Channel[]
  activeChannelId: string | null
  onSelectChannel: (id: string) => void
  onChannelCreated: (channel: Channel) => void
  currentUser: Profile
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleCreate() {
    setLoading(true)
    try {
      const res = await createChannel(server.id, name)
      if (res.error) {
        toast.error(res.error)
      } else if (res.channel) {
        onChannelCreated(res.channel as Channel)
        setName('')
        setDialogOpen(false)
      }
    } finally {
      setLoading(false)
    }
  }

  function copyInvite() {
    navigator.clipboard.writeText(server.invite_code)
    setCopied(true)
    toast.success('Invite code copied')
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border/60 bg-sidebar/60">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-between border-b border-border/60 px-4 py-3.5 text-left transition-colors hover:bg-muted/50">
            <span className="truncate font-semibold">{server.name}</span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => setInviteOpen(true)}>
            <Copy className="size-4" /> Invite people
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" /> Create channel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Text channels
          </span>
          <button
            onClick={() => setDialogOpen(true)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Create channel"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          {channels.map((channel) => {
            const active = channel.id === activeChannelId
            return (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-primary/15 text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <Hash className="size-4 shrink-0" />
                <span className="truncate">{channel.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Current user footer */}
      <div className="flex items-center gap-2 border-t border-border/60 bg-sidebar px-2 py-2">
        <Avatar className="size-8">
          {currentUser.avatar_url && (
            <AvatarImage src={currentUser.avatar_url} alt="" />
          )}
          <AvatarFallback className="bg-primary text-xs text-primary-foreground">
            {(currentUser.display_name ?? currentUser.username)
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {currentUser.display_name ?? currentUser.username}
          </p>
          <p className="truncate text-xs text-muted-foreground">Online</p>
        </div>
        <Settings className="size-4 text-muted-foreground" />
      </div>

      {/* Create channel dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create channel</DialogTitle>
            <DialogDescription>
              Channels are where your conversations happen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="channel-name">Channel name</Label>
            <Input
              id="channel-name"
              placeholder="new-channel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing)
                  handleCreate()
              }}
            />
          </div>
          <Button onClick={handleCreate} disabled={loading}>
            Create channel
          </Button>
        </DialogContent>
      </Dialog>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {server.name}</DialogTitle>
            <DialogDescription>
              Share this code so others can join your server.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input readOnly value={server.invite_code} className="font-mono" />
            <Button onClick={copyInvite} variant="secondary" className="gap-2">
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
