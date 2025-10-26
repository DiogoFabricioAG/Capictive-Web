"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mic } from "lucide-react"
import { useRouter } from "next/navigation"

export function PodcastGenerator() {
  const [title, setTitle] = useState("")
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError("Por favor ingresa un título para el podcast")
      return
    }

    if (!topic.trim()) {
      setError("Por favor ingresa un tema para el podcast")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/podcast/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, topic }),
      })

      if (!response.ok) throw new Error("Failed to generate podcast")

      const data = await response.json()

      router.refresh()
      setTitle("")
      setTopic("")
    } catch (err) {
      console.error("[v0] Error generating podcast:", err)
      setError("Error al generar el podcast. Por favor intenta de nuevo.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-2 border-mustard/30 bg-gradient-to-br from-amber-50 to-orange-50 mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-mustard" />
          <CardTitle className="text-xl">Generar Podcast con IA</CardTitle>
        </div>
        <CardDescription>
          ¿De qué quieres escuchar hoy? Capictive generará un podcast sobre el tema que elijas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-wood-dark mb-2 block">
            Título del Podcast
          </label>
          <Input
            id="title"
            placeholder="Ej: Análisis de las propuestas económicas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-wood/20 focus:border-mustard focus:ring-mustard"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label htmlFor="topic" className="text-sm font-medium text-wood-dark mb-2 block">
            Tema del Podcast
          </label>
          <Textarea
            id="topic"
            placeholder="Ej: Háblame sobre las propuestas económicas del gobierno actual"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-[100px] border-wood/20 focus:border-mustard focus:ring-mustard"
            disabled={isGenerating}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !title.trim() || !topic.trim()}
          className="w-full bg-mustard hover:bg-mustard/90 text-wood-dark cursor-pointer disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando podcast...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Generar Podcast
            </>
          )}
        </Button>

        <p className="text-xs text-wood text-center">
          El podcast se generará automáticamente con voz de IA y aparecerá en la lista
        </p>
      </CardContent>
    </Card>
  )
}
