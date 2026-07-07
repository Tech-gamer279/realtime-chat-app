export type Profile = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  status: string | null
}

export type Server = {
  id: string
  name: string
  icon_url: string | null
  owner_id: string
  invite_code: string
  created_at: string
}

export type Channel = {
  id: string
  server_id: string
  name: string
  type: string
  position: number
  created_at: string
}

export type Attachment = {
  id: string
  message_id: string
  url: string
  file_name: string | null
  file_type: string | null
  file_size: number | null
}

export type Reaction = {
  id: string
  message_id: string
  user_id: string
  emoji: string
}

export type Message = {
  id: string
  channel_id: string
  user_id: string
  content: string | null
  created_at: string
  edited_at: string | null
  profile?: Profile | null
  attachments?: Attachment[]
  reactions?: Reaction[]
}

export type Member = {
  id: string
  server_id: string
  user_id: string
  role: string
  profile?: Profile | null
}
