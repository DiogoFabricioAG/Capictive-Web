import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VideosPage() {
  const videos = [
    {
      id: 1,
      title: "Análisis Electoral: Tendencias 2024",
      description:
        "Un análisis profundo de las tendencias electorales y cómo la IA está transformando las campañas políticas.",
      thumbnail: "/political-analysis-video-thumbnail.jpg",
      xLink: "https://x.com/capictive",
      date: "15 Oct 2025",
    },
    {
      id: 2,
      title: "Transparencia Gubernamental con IA",
      description: "Cómo Capictive ayuda a rastrear y verificar promesas políticas en tiempo real.",
      thumbnail: "/government-transparency-ai-video.jpg",
      xLink: "https://x.com/capictive",
      date: "10 Oct 2025",
    },
    {
      id: 3,
      title: "Verificación de Datos en Campañas",
      description: "La importancia de la verificación de datos y cómo nuestra IA detecta información falsa.",
      thumbnail: "/fact-checking-campaign-video.jpg",
      xLink: "https://x.com/capictive",
      date: "5 Oct 2025",
    },
    {
      id: 4,
      title: "El Futuro de las Campañas Digitales",
      description: "Exploramos cómo la inteligencia artificial está redefiniendo las estrategias de campaña.",
      thumbnail: "/digital-campaign-future-video.jpg",
      xLink: "https://x.com/capictive",
      date: "1 Oct 2025",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Videos</h1>
          <p className="text-lg text-muted-foreground">
            Contenido exclusivo sobre análisis político, transparencia gubernamental y el futuro de las campañas
            electorales.
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{video.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-2">{video.date}</CardDescription>
                  </div>
                </div>
                <CardDescription className="text-base">{video.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <a
                    href={video.xLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Ver en X
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
