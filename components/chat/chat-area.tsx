'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Hash, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Channel, Message, Profile } from '@/lib/types'
import { MessageItem } from './message-item'
import { MessageComposer } from './message-composer'
import { Button } from '@/components/ui/button'

export function ChatArea({
  channel,
  currentUser,
  showMembers,
  onToggleMembers,
}: {
  channel: Channel
  currentUser: Profile
  showMembers: boolean
  onToggleMembers: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = useCallback((smooth = false) => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      })
    })
  }, [])

  const fetchMessage = useCallback(
    async (id: string): Promise<Message | null> => {
      const { data } = await supabase
        .from('messages')
        .select(
          '*, profile:profiles(*), attachments(*), reactions(*)',
        )
        .eq('id', id)
        .single()
      return (data as Message) ?? null
    },
    [supabase],
  )

  const loadMessages = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*, profile:profiles(*), attachments(*), reactions(*)')
      .eq('channel_id', channel.id)
      .order('created_at', { ascending: true })
      .limit(100)
    setMessages((data as Message[]) ?? [])
    setLoading(false)
    scrollToBottom()
  }, [channel.id, supabase, scrollToBottom])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Realtime: messages + reactions for this channel
  useEffect(() => {
    const chan = supabase
      .channel(`room:${channel.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channel.id}`,
        },
        async (payload) => {
          const full = await fetchMessage(payload.new.id as string)
          if (full) {
            setMessages((prev) =>
              prev.some((m) => m.id === full.id) ? prev : [...prev, full],
            )
            scrollToBottom(true)
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channel.id}`,
        },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id))
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reactions' },
        async (payload) => {
          const row = (payload.new ?? payload.old) as { message_id?: string }
          if (!row?.message_id) return
          const full = await fetchMessage(row.message_id)
          if (full) {
            setMessages((prev) =>
              prev.map((m) => (m.id === full.id ? full : m)),
            )
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(chan)
    }
  }, [channel.id, supabase, fetchMessage, scrollToBottom])

  return (
    <section className="flex flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <Hash className="size-5 text-muted-foreground" />
          <span className="font-semibold">{channel.name}</span>
        </div>
        <Button
          variant={showMembers ? 'secondary' : 'ghost'}
          size="icon"
          onClick={onToggleMembers}
          aria-label="Toggle members"
        >
          <Users className="size-5" />
        </Button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-end gap-0.5 py-4">
          {loading ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Loading messages…
            </p>
          ) : messages.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Hash className="size-7" />
              </div>
              <h3 className="mt-3 text-lg font-semibold">
                Welcome to #{channel.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                This is the start of the channel. Say hello!
              </p>
            </div>
          ) : (
            messages.map((message, i) => {
              const prev = messages[i - 1]
              const grouped =
                prev?.user_id === message.user_id &&
                new Date(message.created_at).getTime() -
                  new Date(prev.created_at).getTime() <
                  5 * 60 * 1000
              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  currentUser={currentUser}
                  grouped={grouped}
                />
              )
            })
          )}
        </div>
      </div>

      <MessageComposer channel={channel} currentUser={currentUser} />
    </section>
  )
}
