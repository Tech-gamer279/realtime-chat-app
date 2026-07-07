import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatWorkspace } from '@/components/chat/chat-workspace'
import type { Profile, Server } from '@/lib/types'

export default async function AppPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: memberships } = await supabase
    .from('server_members')
    .select('server:servers(*)')
    .eq('user_id', user.id)

  const servers: Server[] = (memberships ?? [])
    .map((m) => (m as { server: Server | null }).server)
    .filter((s): s is Server => Boolean(s))

  return (
    <ChatWorkspace
      currentUser={(profile ?? {
        id: user.id,
        username: user.email ?? 'user',
        display_name: user.email ?? 'User',
        avatar_url: null,
        status: 'online',
      }) as Profile}
      initialServers={servers}
    />
  )
}
