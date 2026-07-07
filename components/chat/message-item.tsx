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
        className="max-h-80 max-w-sm rounded-lg border border-border/60 object-cover"
      />
    )
  }

  if (type.startsWith('video/')) {
    return (
      <video
        controls
        src={attachment.url}
        className="max-h-80 max-w-sm rounded-lg border border-border/60"
      />
    )
  }

  if (type.startsWith('audio/')) {
    return <audio controls src={attachment.url} className="w-72 max-w-full" />
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex max-w-sm items-center gap-3 rounded-lg border border-border/60 bg-card p-3 transition-colors hover:border-primary/50"
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
        'group relative flex gap-3 px-4 py-0.5 hover:bg-muted/30',
        grouped ? 'mt-0' : 'mt-3',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-10 shrink-0">
        {!grouped && (
          <Avatar className="size-10">
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
            {message.attachments.map((a) => (
              <AttachmentView key={a.id} attachment={a} />
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
                  'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors',
                  info.mine
                    ? 'border-primary/60 bg-primary/15 text-foreground'
                    : 'border-border/60 bg-muted/50 text-muted-foreground hover:border-primary/40',
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
          'absolute -top-3 right-4 flex items-center gap-0.5 rounded-lg border border-border/60 bg-card p-0.5 shadow-lg transition-opacity',
          hovered ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Add reaction"
            >
              <SmilePlus className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-0">
            <div className="grid grid-cols-4 gap-1 p-1">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => toggleReaction(emoji)}
                  className="flex size-8 items-center justify-center rounded-md text-lg hover:bg-muted"
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
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
            aria-label="Delete message"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
