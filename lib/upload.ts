import { createClient } from '@/lib/supabase/client'

export type UploadedFile = {
  url: string
  file_name: string
  file_type: string
  file_size: number
}

export async function uploadFile(
  file: File,
  userId: string,
): Promise<UploadedFile> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${userId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('chat-files')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from('chat-files').getPublicUrl(path)

  return {
    url: data.publicUrl,
    file_name: file.name,
    file_type: file.type || 'application/octet-stream',
    file_size: file.size,
  }
}
