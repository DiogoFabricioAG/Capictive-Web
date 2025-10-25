"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subscribeToNewsletter } from "@/lib/supabase/queries"
import { createClient } from "@/lib/supabase/client"

export function NewsletterSubscriptionForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      await subscribeToNewsletter(email, user?.id)
      setMessage({ type: "success", text: "¡Gracias por suscribirte! Revisa tu correo." })
      setEmail("")
    } catch (error) {
      setMessage({ type: "error", text: "Error al suscribirse. Intenta de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="tu@email.com"
          className="flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" size="lg" disabled={isLoading} className="cursor-pointer">
          {isLoading ? "Suscribiendo..." : "Suscribirse"}
        </Button>
      </form>
      {message && (
        <p className={`text-sm mt-3 text-center ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}
