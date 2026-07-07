'use server'

import { createClient } from '@/lib/supabase/server'

export async function createServer(name: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const trimmed = name.trim()
  if (!trimmed) return { error: 'Server name is required' }

  const { data: server, error: serverError } = await supabase
    .from('servers')
    .insert({ name: trimmed, owner_id: user.id })
    .select()
    .single()
  if (serverError || !server) return { error: serverError?.message ?? 'Failed' }

  const { error: memberError } = await supabase
    .from('server_members')
    .insert({ server_id: server.id, user_id: user.id, role: 'owner' })
  if (memberError) return { error: memberError.message }

  const { error: channelError } = await supabase.from('channels').insert([
    { server_id: server.id, name: 'general', position: 0 },
    { server_id: server.id, name: 'random', position: 1 },
  ])
  if (channelError) return { error: channelError.message }

  return { server }
}

export async function joinServer(inviteCode: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const code = inviteCode.trim().toLowerCase()
  if (!code) return { error: 'Invite code is required' }

  const { data: server, error: findError } = await supabase
    .from('servers')
    .select('*')
    .eq('invite_code', code)
    .maybeSingle()

  if (findError) return { error: findError.message }
  if (!server) return { error: 'No server found with that invite code' }

  const { error: joinError } = await supabase
    .from('server_members')
    .insert({ server_id: server.id, user_id: user.id, role: 'member' })

  if (joinError && !joinError.message.includes('duplicate')) {
    return { error: joinError.message }
  }

  return { server }
}

export async function createChannel(serverId: string, name: string) {
  const supabase = await createClient()
  const trimmed = name.trim().toLowerCase().replace(/\s+/g, '-')
  if (!trimmed) return { error: 'Channel name is required' }

  const { data, error } = await supabase
    .from('channels')
    .insert({ server_id: serverId, name: trimmed })
    .select()
    .single()

  if (error) return { error: error.message }
  return { channel: data }
}
