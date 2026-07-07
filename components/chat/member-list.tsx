'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Member, Profile } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function MemberList({
  serverId,
  currentUser,
}: {
  serverId: string
  currentUser: Profile
}) {
  const [members, setMembers] = useState<Member[]>([])
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('server_members')
      .select('*, profile:profiles(*)')
      .eq('server_id', serverId)
    setMembers((data as Member[]) ?? [])
  }, [serverId, supabase])

  useEffect(() => {
    load()
    const channel = supabase
      .channel(`members:${serverId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'server_members',
          filter: `server_id=eq.${serverId}`,
        },
        () => load(),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [serverId, supabase, load])

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-l border-border/60 bg-sidebar/60 p-3 lg:flex">
      <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Members — {members.length}
      </p>
      <div className="flex flex-col gap-0.5">
        {members.map((member) => {
          const profile = member.profile
          const label =
            profile?.display_name ?? profile?.username ?? 'Unknown'
          const isYou = member.user_id === currentUser.id
          return (
            <div
              key={member.id}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
            >
              <div className="relative">
                <Avatar className="size-8">
                  {profile?.avatar_url && (
                    <AvatarImage src={profile.avatar_url} alt="" />
                  )}
                  <AvatarFallback className="bg-muted text-xs">
                    {label.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-sidebar bg-chart-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {label}
                  {isYou && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      (you)
                    </span>
                  )}
                </p>
                {member.role === 'owner' && (
                  <p className="text-xs text-primary">Owner</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
