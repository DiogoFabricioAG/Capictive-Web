"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Video, ExternalLink, Volume2 } from "lucide-react"
import { useRouter } from "next/navigation"

type VideoOption = "defecto" | "video1" | "video2"

interface GeneratedResult {
  type: "video" | "audio"
  link: string
}

export function VideoGenerator() {
  const [message, setMessage] = useState("")
  const [videoOption, setVideoOption] = useState<VideoOption>("defecto")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GeneratedResult | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!message.trim()) {
      setError("Por favor ingresa un tema para el video")
      return
    }

    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/videos/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, videoOption }),
      })

      if (!response.ok) throw new Error("Failed to generate video")

      const data = await response.json()
      setResult(data.result)

      // Refresh the page to show new videos
      router.refresh()
      setMessage("")
      setVideoOption("defecto")
    } catch (err) {
      console.error("[v0] Error generating video:", err)
      setError("Error al generar el video. Por favor intenta de nuevo.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-2 border-mustard/30 bg-gradient-to-br from-amber-50 to-orange-50 mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Video className="h-6 w-6 text-mustard" />
          <CardTitle className="text-xl">Generar Video con IA</CardTitle>
        </div>
        <CardDescription>
          ¿Sobre qué tema quieres un video hoy? Capictive generará contenido sobre el tema que elijas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="message" className="text-sm font-medium text-wood-dark mb-2 block">
            Tema del Video
          </label>
          <Textarea
            id="message"
            placeholder="Ej: Kast sobre la Inmigración"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] border-wood/20 focus:border-mustard focus:ring-mustard"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label htmlFor="video-option" className="text-sm font-medium text-wood-dark mb-2 block">
            Opción de Video Base
          </label>
          <Select
            value={videoOption}
            onValueChange={(value) => setVideoOption(value as VideoOption)}
            disabled={isGenerating}
          >
            <SelectTrigger className="border-wood/20 focus:border-mustard focus:ring-mustard">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="defecto">Por defecto (sin video base)</SelectItem>
              <SelectItem value="video1">Video 1: Futuro con Jeannette Jaram</SelectItem>
              <SelectItem value="video2">Video 2: Debate Presidencial Chile</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-wood mt-1">Selecciona un video base opcional para el análisis</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {result && (
          <div className="p-4 bg-white rounded-lg border-2 border-mustard/50">
            {result.type === "video" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700">
                  <Video className="h-5 w-5" />
                  <p className="font-semibold">¡Tu video está listo!</p>
                </div>
                <Button asChild className="w-full bg-mustard hover:bg-mustard/90 text-wood-dark cursor-pointer">
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Ver Video en YouTube
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-mustard">
                  <Volume2 className="h-5 w-5" />
                  <p className="font-semibold">Audio generado</p>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                  <img
                    src="/images/capictive-detective-poster.png"
                    alt="Capictive Detective"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <audio controls className="w-full max-w-md px-4">
                      <source src={result.link} type="audio/mpeg" />
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !message.trim()}
          className="w-full bg-mustard hover:bg-mustard/90 text-wood-dark cursor-pointer disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando contenido...
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Generar Video
            </>
          )}
        </Button>

        <p className="text-xs text-wood text-center">
          El contenido se generará automáticamente y aparecerá en la lista
        </p>
      </CardContent>
    </Card>
  )
}
