import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function NewsletterPage() {
  const pastNewsletters = [
    {
      id: 1,
      title: "Resumen Electoral Octubre 2025",
      description: "Las principales tendencias electorales del mes, análisis de datos y predicciones basadas en IA.",
      date: "25 Oct 2025",
      preview:
        "Este mes hemos visto cambios significativos en las preferencias electorales. Nuestro análisis de IA revela...",
    },
    {
      id: 2,
      title: "Transparencia Gubernamental: Avances y Desafíos",
      description: "Un análisis profundo sobre el estado actual de la transparencia en gobiernos latinoamericanos.",
      date: "18 Oct 2025",
      preview:
        "La transparencia gubernamental sigue siendo un desafío en la región. Sin embargo, nuevas tecnologías...",
    },
    {
      id: 3,
      title: "Verificación de Datos: Casos de Estudio",
      description: "Ejemplos reales de cómo Capictive ha ayudado a verificar información en campañas políticas.",
      date: "11 Oct 2025",
      preview: "Durante las últimas semanas, hemos identificado y verificado más de 150 declaraciones políticas...",
    },
    {
      id: 4,
      title: "El Futuro de las Campañas Digitales",
      description: "Tendencias emergentes en marketing político y el rol de la inteligencia artificial.",
      date: "4 Oct 2025",
      preview: "Las campañas digitales están evolucionando rápidamente. La IA no solo ayuda en la segmentación...",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Newsletter Capictive</h1>
          <p className="text-lg text-muted-foreground">
            Recibe análisis semanales sobre política, tecnología y transparencia directamente en tu correo.
          </p>
        </div>

        {/* Subscription Form */}
        <div className="max-w-2xl mx-auto mb-20">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Suscríbete a nuestro newsletter</CardTitle>
              <CardDescription className="text-base">
                Únete a más de 5,000 suscriptores que reciben insights semanales sobre el mundo político y tecnológico.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col sm:flex-row gap-3">
                <Input type="email" placeholder="tu@email.com" className="flex-1" />
                <Button type="submit" size="lg">
                  Suscribirse
                </Button>
              </form>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Sin spam. Cancela tu suscripción en cualquier momento.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Past Newsletters */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Ediciones anteriores</h2>
          <div className="space-y-6">
            {pastNewsletters.map((newsletter) => (
              <Card key={newsletter.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <CardTitle className="text-xl">{newsletter.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                      <Calendar className="h-4 w-4" />
                      {newsletter.date}
                    </div>
                  </div>
                  <CardDescription className="text-base mb-3">{newsletter.description}</CardDescription>
                  <p className="text-sm text-muted-foreground italic">{newsletter.preview}</p>
                </CardHeader>
                <CardContent>
                  <Link href={`/newsletter/${newsletter.id}`}>
                    <Button variant="outline" size="sm">
                      Leer completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Contenido Exclusivo</h3>
            <p className="text-sm text-muted-foreground">Análisis y datos que no encontrarás en ningún otro lugar</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Semanal</h3>
            <p className="text-sm text-muted-foreground">
              Recibe actualizaciones cada semana directamente en tu correo
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Sin Spam</h3>
            <p className="text-sm text-muted-foreground">Solo contenido de valor, sin publicidad ni spam</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
