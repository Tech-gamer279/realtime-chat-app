'use client'

import { useRef, useState } from 'react'
import { Plus, Send, X, FileText, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { uploadFile } from '@/lib/upload'
import type { Channel, Profile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type PendingFile = { file: File; preview: string | null }

export function MessageComposer({
  channel,
  currentUser,
}: {
  channel: Channel
  currentUser: Profile
}) {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<PendingFile[]>([])
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  function addFiles(list: FileList | null) {
    if (!list) return
    const next: PendingFile[] = Array.from(list).map((file) => ({
      file,
      preview: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null,
    }))
    setFiles((prev) => [...prev, ...next])
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSend() {
    if (sending) return
    if (!content.trim() && files.length === 0) return
    setSending(true)

    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          channel_id: channel.id,
          user_id: currentUser.id,
          content: content.trim() || null,
        })
        .select()
        .single()

      if (error || !message) {
        toast.error(error?.message ?? 'Failed to send')
        return
      }

      if (files.length > 0) {
        const uploaded = await Promise.all(
          files.map(async (f) => {
            const up = await uploadFile(f.file, currentUser.id)
            return {
              message_id: message.id,
              url: up.url,
              file_name: up.file_name,
              file_type: up.file_type,
              file_size: up.file_size,
            }
          }),
        )
        const { error: attachError } = await supabase
          .from('attachments')
          .insert(uploaded)
        if (attachError) toast.error('Some files failed to upload')
      }

      setContent('')
      setFiles([])
      if (textRef.current) textRef.current.style.height = 'auto'
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="px-4 pb-4 pt-1">
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 rounded-t-xl border border-b-0 border-border/60 bg-card/60 p-3">
          {files.map((f, i) => (
            <div
              key={i}
              className="group relative flex items-center gap-2 rounded-lg border border-border/60 bg-background p-2"
            >
              {f.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.preview || '/placeholder.svg'}
                  alt={f.file.name}
                  className="size-12 rounded object-cover"
                />
              ) : (
                <span className="flex size-12 items-center justify-center rounded bg-muted text-muted-foreground">
                  <FileText className="size-5" />
                </span>
              )}
              <span className="max-w-32 truncate text-xs text-muted-foreground">
                {f.file.name}
              </span>
              <button
                onClick={() => removeFile(i)}
                className="flex size-5 items-center justify-center rounded-full bg-destructive text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove file"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 rounded-xl border border-border/60 bg-input px-3 py-2">
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Attach files"
        >
          <Plus className="size-5" />
        </button>

        <textarea
          ref={textRef}
          rows={1}
          value={content}
          placeholder={`Message #${channel.name}`}
          onChange={(e) => {
            setContent(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
          }}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              handleSend()
            }
          }}
          className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        />

        <Button
          size="icon"
          className="size-8 shrink-0"
          onClick={handleSend}
          disabled={sending || (!content.trim() && files.length === 0)}
          aria-label="Send message"
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
