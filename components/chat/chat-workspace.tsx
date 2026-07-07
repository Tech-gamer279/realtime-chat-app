'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Channel, Profile, Server } from '@/lib/types'
import { ServerRail } from './server-rail'
import { ChannelSidebar } from './channel-sidebar'
import { ChatArea } from './chat-area'
import { MemberList } from './member-list'
import { EmptyState } from './empty-state'
import { Toaster } from '@/components/ui/sonner'

export function ChatWorkspace({
  currentUser,
  initialServers,
}: {
  currentUser: Profile
  initialServers: Server[]
}) {
  const [servers, setServers] = useState<Server[]>(initialServers)
  const [activeServerId, setActiveServerId] = useState<string | null>(
    initialServers[0]?.id ?? null,
  )
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [showMembers, setShowMembers] = useState(true)

  const supabase = createClient()
  const activeServer = servers.find((s) => s.id === activeServerId) ?? null
  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? null

  const loadChannels = useCallback(
    async (serverId: string) => {
      const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('server_id', serverId)
        .order('position', { ascending: true })
      const list = (data as Channel[]) ?? []
      setChannels(list)
      setActiveChannelId((prev) =>
        list.some((c) => c.id === prev) ? prev : (list[0]?.id ?? null),
      )
    },
    [supabase],
  )

  useEffect(() => {
    if (activeServerId) loadChannels(activeServerId)
    else setChannels([])
  }, [activeServerId, loadChannels])

  // Realtime: new channels for the active server
  useEffect(() => {
    if (!activeServerId) return
    const channel = supabase
      .channel(`channels:${activeServerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channels',
          filter: `server_id=eq.${activeServerId}`,
        },
        () => loadChannels(activeServerId),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeServerId, supabase, loadChannels])

  function handleServerCreated(server: Server) {
    setServers((prev) => [...prev, server])
    setActiveServerId(server.id)
  }

  function handleServerJoined(server: Server) {
    setServers((prev) =>
      prev.some((s) => s.id === server.id) ? prev : [...prev, server],
    )
    setActiveServerId(server.id)
  }

  function handleChannelCreated(channel: Channel) {
    setChannels((prev) => [...prev, channel])
    setActiveChannelId(channel.id)
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <ServerRail
        servers={servers}
        activeServerId={activeServerId}
        onSelect={setActiveServerId}
        onServerCreated={handleServerCreated}
        onServerJoined={handleServerJoined}
      />

      {activeServer ? (
        <>
          <ChannelSidebar
            server={activeServer}
            channels={channels}
            activeChannelId={activeChannelId}
            onSelectChannel={setActiveChannelId}
            onChannelCreated={handleChannelCreated}
            currentUser={currentUser}
          />

          {activeChannel ? (
            <ChatArea
              key={activeChannel.id}
              channel={activeChannel}
              currentUser={currentUser}
              showMembers={showMembers}
              onToggleMembers={() => setShowMembers((v) => !v)}
            />
          ) : (
            <EmptyState
              title="No channel selected"
              description="Create or pick a channel to start chatting."
            />
          )}

          {showMembers && activeServer && (
            <MemberList serverId={activeServer.id} currentUser={currentUser} />
          )}
        </>
      ) : (
        <EmptyState
          title="Welcome to Nebula"
          description="Create your first server or join one with an invite code to get started."
        />
      )}
      <Toaster position="top-center" />
    </div>
  )
}
