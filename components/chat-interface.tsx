"use client"

import type React from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { formatMarkdownResponse } from "@/lib/capictive-bot"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get("message") as string
    const style = (formData.get("style") as string) || "default"

    if (!message.trim() || !userId) return

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])

    e.currentTarget.reset()
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationId,
          userId,
          style,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-wood/20 bg-white/50 backdrop-blur-sm p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="/capictive-logo.png" alt="Capictive" width={32} height={32} className="sm:w-10 sm:h-10" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-wood-dark">Capictive AI</h1>
            <p className="text-xs sm:text-sm text-wood">Tu asistente de análisis político</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <Image
                src="/capictive-logo.png"
                alt="Capictive"
                width={60}
                height={60}
                className="sm:w-20 sm:h-20 mx-auto mb-4"
              />
              <h2 className="text-xl sm:text-2xl font-bold text-wood-dark mb-2">¡Hola! Soy Capictive</h2>
              <p className="text-sm sm:text-base text-wood">
                Puedo ayudarte a analizar campañas políticas, verificar información gubernamental y responder preguntas
                sobre procesos electorales.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0">
                <Image src="/capictive-logo.png" alt="Capictive" width={28} height={28} className="sm:w-8 sm:h-8" />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-md ${
                message.role === "user" ? "bg-mustard text-wood-dark" : "bg-white border border-wood/20 text-wood-dark"
              }`}
            >
              {message.role === "assistant" ? (
                <div
                  className="prose prose-sm sm:prose-base max-w-none prose-headings:text-wood-dark prose-p:text-wood-dark prose-strong:text-wood-dark prose-li:text-wood-dark"
                  dangerouslySetInnerHTML={{ __html: formatMarkdownResponse(message.content) }}
                />
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 sm:gap-3 justify-start">
            <div className="flex-shrink-0">
              <Image src="/capictive-logo.png" alt="Capictive" width={28} height={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className="bg-white border border-wood/20 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-md">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-wood animate-spin" />
                <span className="text-sm text-wood">Capictive está pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-wood/20 bg-white/50 backdrop-blur-sm p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <div className="flex items-center gap-2">
            <label htmlFor="chat-style" className="text-xs sm:text-sm text-wood-dark whitespace-nowrap">
              Estilo:
            </label>
            <select
              id="chat-style"
              name="style"
              defaultValue="default"
              className="px-2 py-2 border border-wood/20 rounded-md bg-white text-wood-dark text-xs sm:text-sm cursor-pointer"
              disabled={isLoading}
            >
              <option value="default">Defecto</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <Textarea
            ref={textareaRef}
            name="message"
            placeholder="Escribe tu mensaje..."
            className="flex-1 min-h-[50px] sm:min-h-[60px] max-h-[150px] sm:max-h-[200px] resize-none border-wood/20 focus:border-mustard focus:ring-mustard bg-white text-sm sm:text-base"
            disabled={isLoading}
            onKeyDown={handleKeyDown}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = "auto"
              target.style.height = target.scrollHeight + "px"
            }}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-mustard hover:bg-mustard/90 text-wood-dark self-end cursor-pointer disabled:cursor-not-allowed h-[50px] sm:h-auto px-3 sm:px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
