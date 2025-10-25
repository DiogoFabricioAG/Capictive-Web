"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRef, useEffect } from "react"
import Image from "next/image"

export default function ChatInterface() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get("message") as string

    if (message.trim()) {
      sendMessage({ text: message })
      e.currentTarget.reset()
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
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
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <p key={index} className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {part.text}
                    </p>
                  )
                }
                return null
              })}
            </div>
          </div>
        ))}

        {status === "in_progress" && (
          <div className="flex gap-2 sm:gap-3 justify-start">
            <div className="flex-shrink-0">
              <Image src="/capictive-logo.png" alt="Capictive" width={28} height={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className="bg-white border border-wood/20 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-md">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-wood animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-wood/20 bg-white/50 backdrop-blur-sm p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            name="message"
            placeholder="Escribe tu mensaje..."
            className="flex-1 min-h-[50px] sm:min-h-[60px] max-h-[150px] sm:max-h-[200px] resize-none border-wood/20 focus:border-mustard focus:ring-mustard bg-white text-sm sm:text-base"
            disabled={status === "in_progress"}
            onKeyDown={handleKeyDown}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = "auto"
              target.style.height = target.scrollHeight + "px"
            }}
          />
          <Button
            type="submit"
            disabled={status === "in_progress"}
            className="bg-mustard hover:bg-mustard/90 text-wood-dark self-end cursor-pointer disabled:cursor-not-allowed h-[50px] sm:h-auto px-3 sm:px-4"
          >
            {status === "in_progress" ? (
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
