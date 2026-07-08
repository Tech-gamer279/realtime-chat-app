'use client'

import { useState } from 'react'
import { SmilePlus, Trash2, Download, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Attachment, Message, Profile } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

const EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '😮', '😢', '🚀']

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatBytes(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function AttachmentView({ attachment }: { attachment: Attachment }) {
  const type = attachment.file_type ?? ''

  if (type.startsWith('image/')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={attachment.url || '/placeholder.svg'}
        alt={attachment.file_name ?? 'image'}
        className="max-h-80 max-w-sm rounded-lg border border-border/60 object-cover animate-scale-in"
      />
    )
  }

  if (type.startsWith('video/')) {
    return (
      <video
        controls
        src={attachment.url}
        className="max-h-80 max-w-sm rounded-lg border border-border/60 animate-scale-in"
      />
    )
  }

  if (type.startsWith('audio/')) {
    return <audio controls src={attachment.url} className="w-72 max-w-full animate-fade-in" />
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex max-w-sm items-center gap-3 rounded-lg border border-border/60 bg-card p-3 transition-smooth hover:border-primary/50 hover:bg-card/80 hover:shadow-lg animate-slide-in"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <FileText className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{attachment.file_name}</p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(attachment.file_size)}
        </p>
      </div>
      <Download className="size-4 text-muted-foreground" />
    </a>
  )
}

export function MessageItem({
  message,
  currentUser,
  grouped,
}: {
  message: Message
  currentUser: Profile
  grouped: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const supabase = createClient()
  const profile = message.profile
  const label = profile?.display_name ?? profile?.username ?? 'Unknown'
  const isOwn = message.user_id === currentUser.id

  // Group reactions by emoji
  const reactionGroups = (message.reactions ?? []).reduce<
    Record<string, { count: number; mine: boolean }>
  >((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = { count: 0, mine: false }
    acc[r.emoji].count += 1
    if (r.user_id === currentUser.id) acc[r.emoji].mine = true
    return acc
  }, {})

  async function toggleReaction(emoji: string) {
    const existing = (message.reactions ?? []).find(
      (r) => r.emoji === emoji && r.user_id === currentUser.id,
    )
    if (existing) {
      await supabase.from('reactions').delete().eq('id', existing.id)
    } else {
      await supabase.from('reactions').insert({
        message_id: message.id,
        user_id: currentUser.id,
        emoji,
      })
    }
  }

  async function handleDelete() {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', message.id)
    if (error) toast.error(error.message)
  }

  return (
    <div
      className={cn(
        'group relative flex gap-3 px-4 py-0.5 hover:bg-muted/30 transition-smooth message-enter',
        grouped ? 'mt-0' : 'mt-3',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-10 shrink-0">
        {!grouped && (
          <Avatar className="size-10 ring-2 ring-primary/20">
            {profile?.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt="" />
            )}
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {label.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {!grouped && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.created_at)}
            </span>
          </div>
        )}

        {message.content && (
          <p className="whitespace-pre-wrap break-words text-sm text-foreground/90">
            {message.content}
          </p>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-1.5 flex flex-col gap-2">
            {message.attachments.map((a, i) => (
              <div key={a.id} className={cn('animate-slide-in', `animate-delay-${i * 100}`)}>
                <AttachmentView attachment={a} />
              </div>
            ))}
          </div>
        )}

        {Object.keys(reactionGroups).length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {Object.entries(reactionGroups).map(([emoji, info]) => (
              <button
                key={emoji}
                onClick={() => toggleReaction(emoji)}
                className={cn(
                  'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-smooth reaction-pop hover:scale-110',
                  info.mine
                    ? 'border-primary/60 bg-primary/15 text-foreground'
                    : 'border-border/60 bg-muted/50 text-muted-foreground hover:border-primary/40 hover:bg-muted/70',
                )}
              >
                <span>{emoji}</span>
                <span>{info.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div
        className={cn(
          'absolute -top-3 right-4 flex items-center gap-0.5 rounded-lg border border-border/60 bg-card p-0.5 shadow-lg transition-all duration-200',
          hovered ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95',
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground hover:scale-110 active:scale-95"
              aria-label="Add reaction"
            >
              <SmilePlus className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-0 animate-scale-in">
            <div className="grid grid-cols-4 gap-1 p-1">
              {EMOJIS.map((emoji, i) => (
                <button
                  key={emoji}
                  onClick={() => toggleReaction(emoji)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-md text-lg hover:bg-muted transition-smooth hover:scale-110 active:scale-95',
                    `animate-delay-${i * 50}`,
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {isOwn && (
          <button
            onClick={handleDelete}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-smooth hover:scale-110 active:scale-95"
            aria-label="Delete message"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
