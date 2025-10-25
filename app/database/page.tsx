import { Database, FileText, Globe, Shield, Search, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { DatabaseSubmissionModal } from "@/components/database-submission-modal"

export default function DatabasePage() {
  const sources = [
    {
      category: "Fuentes Gubernamentales",
      icon: Shield,
      color: "text-wood",
      sources: [
        {
          name: "Diario Oficial de la República",
          type: "Oficial",
          lastUpdate: "Actualizado diariamente",
          verified: true,
          pdfUrl: "/documents/diario-oficial.pdf",
        },
        {
          name: "Contraloría General de la República",
          type: "Oficial",
          lastUpdate: "Actualizado semanalmente",
          verified: true,
          pdfUrl: "/documents/contraloria.pdf",
        },
        {
          name: "Transparencia Activa - Gobierno",
          type: "Oficial",
          lastUpdate: "Actualizado mensualmente",
          verified: true,
          pdfUrl: "/documents/transparencia-activa.pdf",
        },
        {
          name: "Servicio Electoral (SERVEL)",
          type: "Oficial",
          lastUpdate: "Actualizado en tiempo real",
          verified: true,
          pdfUrl: "/documents/servel.pdf",
        },
      ],
    },
    {
      category: "Medios de Comunicación",
      icon: Globe,
      color: "text-mustard",
      sources: [
        {
          name: "Agencias de Noticias Verificadas",
          type: "Prensa",
          lastUpdate: "Actualizado en tiempo real",
          verified: true,
          pdfUrl: "/documents/agencias-noticias.pdf",
        },
        {
          name: "Fact-Checking Organizations",
          type: "Verificación",
          lastUpdate: "Actualizado diariamente",
          verified: true,
          pdfUrl: "/documents/fact-checking.pdf",
        },
        {
          name: "Medios Tradicionales Certificados",
          type: "Prensa",
          lastUpdate: "Actualizado en tiempo real",
          verified: true,
          pdfUrl: "/documents/medios-tradicionales.pdf",
        },
      ],
    },
    {
      category: "Registros Públicos",
      icon: FileText,
      color: "text-wood",
      sources: [
        {
          name: "Registro Civil e Identificación",
          type: "Público",
          lastUpdate: "Actualizado mensualmente",
          verified: true,
          pdfUrl: "/documents/registro-civil.pdf",
        },
        {
          name: "Declaraciones de Patrimonio",
          type: "Público",
          lastUpdate: "Actualizado anualmente",
          verified: true,
          pdfUrl: "/documents/declaraciones-patrimonio.pdf",
        },
        {
          name: "Registro de Lobbying",
          type: "Público",
          lastUpdate: "Actualizado semanalmente",
          verified: true,
          pdfUrl: "/documents/registro-lobbying.pdf",
        },
        {
          name: "Financiamiento de Campañas",
          type: "Público",
          lastUpdate: "Actualizado mensualmente",
          verified: true,
          pdfUrl: "/documents/financiamiento-campanas.pdf",
        },
      ],
    },
    {
      category: "Bases de Datos Académicas",
      icon: Database,
      color: "text-mustard",
      sources: [
        {
          name: "Estudios de Políticas Públicas",
          type: "Académico",
          lastUpdate: "Actualizado trimestralmente",
          verified: true,
          pdfUrl: "/documents/estudios-politicas.pdf",
        },
        {
          name: "Investigaciones Universitarias",
          type: "Académico",
          lastUpdate: "Actualizado semestralmente",
          verified: true,
          pdfUrl: "/documents/investigaciones-universitarias.pdf",
        },
        {
          name: "Think Tanks Certificados",
          type: "Académico",
          lastUpdate: "Actualizado mensualmente",
          verified: true,
          pdfUrl: "/documents/think-tanks.pdf",
        },
      ],
    },
  ]

  const verificationProcess = [
    {
      step: "1. Recolección",
      description: "Capictive recopila información de fuentes oficiales y verificadas",
      icon: Database,
    },
    {
      step: "2. Verificación Cruzada",
      description: "Cada dato es contrastado con múltiples fuentes independientes",
      icon: CheckCircle2,
    },
    {
      step: "3. Análisis de Contexto",
      description: "Se analiza el contexto histórico y político de cada información",
      icon: Search,
    },
    {
      step: "4. Actualización Continua",
      description: "Las bases de datos se actualizan constantemente con nueva información",
      icon: Clock,
    },
  ]

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-mustard/10 border border-mustard/20 mb-4 sm:mb-6">
              <Shield className="w-4 h-4 text-mustard" />
              <span className="text-xs sm:text-sm font-medium text-mustard">Transparencia Total</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
              Base de Datos de Capictive
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground text-pretty leading-relaxed">
              Toda la información que utiliza Capictive proviene de fuentes oficiales, verificadas y públicas. Aquí
              puedes explorar exactamente de dónde obtenemos nuestros datos para garantizar la máxima transparencia.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="text" placeholder="Buscar fuentes..." className="pl-10 bg-card border-wood/20" />
              </div>
              <Button className="bg-mustard hover:bg-mustard/90 text-wood cursor-pointer w-full sm:w-auto">
                Buscar
              </Button>
            </div>
          </div>

          {/* Verification Process */}
          <div className="max-w-5xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Proceso de Verificación
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {verificationProcess.map((process, index) => (
                <Card
                  key={index}
                  className="p-4 sm:p-6 bg-card border-wood/10 hover:border-mustard/30 transition-colors"
                >
                  <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-mustard/10 flex items-center justify-center">
                      <process.icon className="w-5 h-5 sm:w-6 sm:h-6 text-mustard" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{process.step}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{process.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sources by Category */}
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            {sources.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <category.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${category.color}`} />
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">{category.category}</h2>
                  </div>
                  <Badge variant="outline" className="border-wood/20 text-wood w-fit sm:ml-auto">
                    {category.sources.length} fuentes
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {category.sources.map((source, sourceIndex) => (
                    <Card
                      key={sourceIndex}
                      className="p-4 sm:p-6 bg-card border-wood/10 hover:border-mustard/30 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{source.name}</h3>
                          <Badge variant="secondary" className="bg-mustard/10 text-mustard border-0 text-xs">
                            {source.type}
                          </Badge>
                        </div>
                        {source.verified && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{source.lastUpdate}</span>
                      </div>

                      <Link href={source.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-wood/20 hover:bg-mustard/10 bg-transparent cursor-pointer text-xs sm:text-sm"
                        >
                          Ver Fuente
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Transparency Statement */}
          <div className="max-w-4xl mx-auto mt-16 sm:mt-20">
            <Card className="p-6 sm:p-8 bg-mustard/5 border-mustard/20">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-mustard/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-mustard" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Compromiso con la Transparencia</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                    Capictive se compromete a mantener la más alta transparencia en todas sus operaciones. Todas
                    nuestras fuentes son públicas y verificables. Si encuentras alguna inconsistencia o tienes preguntas
                    sobre nuestras fuentes de información, no dudes en contactarnos.
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Última actualización de esta página: {new Date().toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contribution Modal Button */}
          <div className="max-w-4xl mx-auto mt-12 sm:mt-16 text-center">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-mustard/10 to-wood/5 border border-mustard/20">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Tu Voz Importa</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
                ¿Conoces una fuente de información que debería estar aquí? Ayúdanos a construir la base de datos más
                completa y transparente para la democracia.
              </p>
              <DatabaseSubmissionModal />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
