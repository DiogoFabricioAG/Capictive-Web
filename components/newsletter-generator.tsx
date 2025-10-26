"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function NewsletterGenerator() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Por favor ingresa un tema para el newsletter")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/newsletter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) throw new Error("Failed to generate newsletter")

      const data = await response.json()

      // Redirect to the new newsletter
      router.push(`/newsletter/${data.newsletter.slug}`)
      router.refresh()
    } catch (err) {
      console.error("[v0] Error generating newsletter:", err)
      setError("Error al generar el newsletter. Por favor intenta de nuevo.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-2 border-mustard/30 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-mustard" />
          <CardTitle className="text-xl">Generar Newsletter con IA</CardTitle>
        </div>
        <CardDescription>
          Usa Capictive AI para generar un análisis detallado sobre cualquier tema político
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="topic" className="text-sm font-medium text-wood-dark mb-2 block">
            Tema del Newsletter
          </label>
          <Textarea
            id="topic"
            placeholder="Ej: Analiza la propuesta de Johannes Kaiser sobre migración"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-[100px] border-wood/20 focus:border-mustard focus:ring-mustard"
            disabled={isGenerating}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="w-full bg-mustard hover:bg-mustard/90 text-wood-dark cursor-pointer disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando newsletter...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generar Newsletter
            </>
          )}
        </Button>

        <p className="text-xs text-wood text-center">
          El newsletter se generará automáticamente y se publicará en la página
        </p>
      </CardContent>
    </Card>
  )
}
