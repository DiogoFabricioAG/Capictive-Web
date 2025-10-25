import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPodcasts } from "@/lib/supabase/queries"

export default async function PodcastPage() {
  const episodes = await getPodcasts()

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Podcast Capictive</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Conversaciones profundas sobre política, tecnología y democracia. Generado con IA de ElevenLabs.
          </p>
          <Badge variant="secondary" className="text-sm">
            Powered by ElevenLabs
          </Badge>
        </div>

        {/* Episodes List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {episodes.map((episode) => (
            <Card key={episode.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{episode.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-3">
                      {new Date(episode.published_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </CardDescription>
                    <CardDescription className="text-base">{episode.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {episode.duration}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {episode.audio_url ? (
                    <audio controls className="w-full">
                      <source src={episode.audio_url} type="audio/mpeg" />
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  ) : (
                    <>
                      <button className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                        <Play className="h-5 w-5 ml-0.5" />
                      </button>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-0 bg-primary rounded-full"></div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-16 p-8 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Sobre nuestro podcast</h3>
          <p className="text-muted-foreground leading-relaxed">
            Nuestro podcast utiliza tecnología de voz AI de ElevenLabs para crear contenido accesible y de alta calidad.
            Cada episodio explora temas relevantes sobre política, tecnología y democracia, ofreciendo análisis
            profundos y perspectivas únicas sobre el futuro de las campañas electorales y la transparencia
            gubernamental.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
