import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ExternalLink, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getVideos } from "@/lib/supabase/queries"
import { VideoGenerator } from "@/components/video-generator"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function VideosPage() {
  const videos = await getVideos()

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

        {user && (
          <div className="max-w-3xl mx-auto mb-12">
            <VideoGenerator />
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden bg-muted">
                {video.audio_url ? (
                  <div className="relative w-full h-full">
                    <img
                      src={video.thumbnail_url || "/images/capictive-detective-poster.png"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Volume2 className="h-12 w-12 text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={video.thumbnail_url || "/placeholder.svg?height=400&width=600"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{video.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-2">
                      {new Date(video.published_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </div>
                </div>
                <CardDescription className="text-base">{video.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {video.audio_url ? (
                  <audio controls className="w-full">
                    <source src={video.audio_url} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                ) : (
                  <Button asChild variant="outline" className="w-full bg-transparent cursor-pointer">
                    <a
                      href={video.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Ver en X
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
