import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

// Mock data for newsletters
const newsletters = {
  "1": {
    id: 1,
    title: "Resumen Electoral Octubre 2025",
    date: "25 Oct 2025",
    classification: "ANÁLISIS CONFIDENCIAL",
    caseNumber: "CAP-2025-10-001",
    content: {
      executiveSummary:
        "Durante el mes de octubre de 2025, nuestro equipo de investigación ha detectado cambios significativos en las preferencias electorales a nivel nacional. Este informe presenta los hallazgos clave basados en análisis de datos de múltiples fuentes verificadas.",
      findings: [
        {
          title: "Cambio en Preferencias Urbanas",
          description:
            "Se observa un incremento del 12% en la intención de voto hacia candidatos progresistas en zonas urbanas principales. Este cambio se correlaciona con el aumento de discusiones sobre políticas ambientales en redes sociales.",
          severity: "high",
        },
        {
          title: "Desinformación en Redes Sociales",
          description:
            "Identificamos 47 campañas coordinadas de desinformación activas durante el mes. El 68% de estas campañas se originan desde cuentas creadas en los últimos 3 meses.",
          severity: "critical",
        },
        {
          title: "Participación Juvenil",
          description:
            "El registro de nuevos votantes entre 18-25 años aumentó un 23% comparado con el mismo período del año anterior. Las principales motivaciones incluyen temas de educación y empleo.",
          severity: "medium",
        },
      ],
      statistics: [
        { label: "Declaraciones Verificadas", value: "1,247" },
        { label: "Tasa de Precisión", value: "73%" },
        { label: "Campañas Monitoreadas", value: "89" },
        { label: "Fuentes Analizadas", value: "2,341" },
      ],
      conclusions:
        "El panorama electoral muestra una tendencia hacia la polarización en temas clave. Recomendamos a los ciudadanos verificar la información antes de compartirla y mantenerse informados a través de fuentes confiables. Capictive continuará monitoreando estas tendencias y proporcionando actualizaciones semanales.",
    },
  },
  "2": {
    id: 2,
    title: "Transparencia Gubernamental: Avances y Desafíos",
    date: "18 Oct 2025",
    classification: "INFORME ESPECIAL",
    caseNumber: "CAP-2025-10-002",
    content: {
      executiveSummary:
        "Este informe examina el estado actual de la transparencia gubernamental en América Latina, identificando tanto avances significativos como áreas que requieren atención urgente.",
      findings: [
        {
          title: "Implementación de Portales de Datos Abiertos",
          description:
            "7 países de la región han lanzado o actualizado sus portales de datos abiertos en el último trimestre. Sin embargo, solo el 34% de los datos publicados cumplen con estándares internacionales de calidad.",
          severity: "medium",
        },
        {
          title: "Retrasos en Respuestas a Solicitudes de Información",
          description:
            "El tiempo promedio de respuesta a solicitudes de información pública aumentó de 18 a 27 días. Esto representa un retroceso del 50% en eficiencia comparado con 2024.",
          severity: "high",
        },
        {
          title: "Adopción de Tecnologías de Verificación",
          description:
            "Incremento del 156% en el uso de blockchain y tecnologías de verificación para registros públicos. Esta tendencia muestra un compromiso creciente con la inmutabilidad de datos.",
          severity: "low",
        },
      ],
      statistics: [
        { label: "Portales Analizados", value: "23" },
        { label: "Solicitudes Monitoreadas", value: "4,892" },
        { label: "Índice de Transparencia Promedio", value: "6.2/10" },
        { label: "Mejora Anual", value: "+8%" },
      ],
      conclusions:
        "Aunque se observan avances en la adopción de tecnologías para la transparencia, persisten desafíos significativos en la implementación efectiva y el cumplimiento de plazos. Es fundamental que los ciudadanos continúen ejerciendo presión para mantener y mejorar estos estándares.",
    },
  },
  "3": {
    id: 3,
    title: "Verificación de Datos: Casos de Estudio",
    date: "11 Oct 2025",
    classification: "REPORTE DE CAMPO",
    caseNumber: "CAP-2025-10-003",
    content: {
      executiveSummary:
        "Durante las últimas semanas, Capictive ha verificado más de 150 declaraciones políticas en tiempo real. Este informe presenta casos destacados que ilustran la importancia del fact-checking en el proceso democrático.",
      findings: [
        {
          title: "Caso: Estadísticas de Empleo Manipuladas",
          description:
            "Un candidato citó cifras de empleo que diferían en un 34% de los datos oficiales. Nuestra verificación cruzada con 5 fuentes gubernamentales confirmó la discrepancia. El candidato posteriormente corrigió su declaración.",
          severity: "high",
        },
        {
          title: "Caso: Promesas de Campaña Inconsistentes",
          description:
            "Detectamos 12 instancias donde un mismo candidato hizo promesas contradictorias en diferentes regiones. El análisis de video y transcripciones confirmó las inconsistencias.",
          severity: "critical",
        },
        {
          title: "Caso: Uso Correcto de Datos Económicos",
          description:
            "Identificamos 23 declaraciones que utilizaron datos económicos de manera precisa y contextualizada. Estos casos demuestran que es posible comunicar información compleja de forma honesta.",
          severity: "low",
        },
      ],
      statistics: [
        { label: "Declaraciones Verificadas", value: "156" },
        { label: "Falsas o Engañosas", value: "42%" },
        { label: "Verdaderas", value: "31%" },
        { label: "Parcialmente Verdaderas", value: "27%" },
      ],
      conclusions:
        "La verificación de datos es esencial para mantener la integridad del discurso político. Los ciudadanos deben desarrollar habilidades de pensamiento crítico y utilizar herramientas como Capictive para validar información antes de tomar decisiones electorales.",
    },
  },
  "4": {
    id: 4,
    title: "El Futuro de las Campañas Digitales",
    date: "4 Oct 2025",
    classification: "ANÁLISIS PROSPECTIVO",
    caseNumber: "CAP-2025-10-004",
    content: {
      executiveSummary:
        "Las campañas políticas digitales están experimentando una transformación radical impulsada por la inteligencia artificial y nuevas plataformas de comunicación. Este informe explora las tendencias emergentes y sus implicaciones para la democracia.",
      findings: [
        {
          title: "Personalización Extrema de Mensajes",
          description:
            "Las campañas ahora utilizan IA para crear miles de variaciones de mensajes adaptados a micro-segmentos de votantes. Esto plantea preguntas sobre transparencia y manipulación.",
          severity: "high",
        },
        {
          title: "Deepfakes y Contenido Sintético",
          description:
            "Detectamos un aumento del 340% en el uso de contenido generado por IA en campañas. Mientras algunos usos son legítimos, otros bordean la desinformación.",
          severity: "critical",
        },
        {
          title: "Plataformas Descentralizadas",
          description:
            "Crecimiento del 89% en el uso de plataformas descentralizadas para comunicación política. Esto dificulta el monitoreo pero aumenta la resistencia a la censura.",
          severity: "medium",
        },
      ],
      statistics: [
        { label: "Campañas Digitales Analizadas", value: "67" },
        { label: "Inversión en IA", value: "+215%" },
        { label: "Alcance Promedio", value: "2.3M" },
        { label: "Tasa de Engagement", value: "4.7%" },
      ],
      conclusions:
        "El futuro de las campañas digitales será cada vez más sofisticado y personalizado. Es crucial desarrollar marcos regulatorios que protejan la integridad electoral sin coartar la libertad de expresión. La educación digital de los ciudadanos será fundamental.",
    },
  },
}

export default function NewsletterDetailPage({ params }: { params: { id: string } }) {
  const newsletter = newsletters[params.id as keyof typeof newsletters]

  if (!newsletter) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 lg:px-8 pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Informe no encontrado</h1>
          <Link href="/newsletter">
            <Button>Volver al Newsletter</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "CRÍTICO"
      case "high":
        return "ALTO"
      case "medium":
        return "MEDIO"
      case "low":
        return "POSITIVO"
      default:
        return "INFO"
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8f3]">
      <Navbar />

      <div className="container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-5xl">
        {/* Confidential Header */}
        <div className="mb-8 border-4 border-[#8B4513] bg-[#f5e6d3] p-6 relative">
          <div className="absolute top-0 left-0 right-0 h-8 bg-[#8B4513] flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-widest">{newsletter.classification}</span>
          </div>
          <div className="mt-6 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/capictive-logo.png" alt="Capictive" width={48} height={48} className="rounded-full" />
                <div>
                  <h1 className="text-3xl font-bold text-[#8B4513]">{newsletter.title}</h1>
                  <p className="text-sm text-[#8B4513]/70">Caso No. {newsletter.caseNumber}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-[#8B4513] mb-1">
                <Calendar className="h-4 w-4" />
                <span className="font-mono text-sm">{newsletter.date}</span>
              </div>
              <Badge variant="outline" className="border-[#8B4513] text-[#8B4513]">
                <FileText className="h-3 w-3 mr-1" />
                Informe Oficial
              </Badge>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8 border-2 border-[#D4A574] bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D4A574]/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#8B4513]" />
              </div>
              <h2 className="text-2xl font-bold text-[#8B4513]">Resumen Ejecutivo</h2>
            </div>
            <p className="text-[#5C4033] leading-relaxed text-lg">{newsletter.content.executiveSummary}</p>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {newsletter.content.statistics.map((stat, index) => (
            <Card key={index} className="border-2 border-[#D4A574] bg-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#D4A574] mb-2">{stat.value}</div>
                <div className="text-sm text-[#8B4513] font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Findings */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#D4A574]/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-[#8B4513]" />
            </div>
            <h2 className="text-2xl font-bold text-[#8B4513]">Hallazgos Principales</h2>
          </div>

          <div className="space-y-6">
            {newsletter.content.findings.map((finding, index) => (
              <Card key={index} className={`border-2 ${getSeverityColor(finding.severity)} shadow-md`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-[#8B4513] flex-1">{finding.title}</h3>
                    <Badge className={getSeverityColor(finding.severity)}>{getSeverityLabel(finding.severity)}</Badge>
                  </div>
                  <p className="text-[#5C4033] leading-relaxed">{finding.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conclusions */}
        <Card className="mb-8 border-2 border-[#D4A574] bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D4A574]/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-[#8B4513]" />
              </div>
              <h2 className="text-2xl font-bold text-[#8B4513]">Conclusiones</h2>
            </div>
            <p className="text-[#5C4033] leading-relaxed text-lg">{newsletter.content.conclusions}</p>
          </CardContent>
        </Card>

        {/* Detective Signature */}
        <div className="border-t-2 border-[#8B4513] pt-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/capictive-logo.png" alt="Capictive" width={64} height={64} className="rounded-full" />
              <div>
                <p className="font-bold text-[#8B4513] text-lg">Capictive - Agente de Investigación</p>
                <p className="text-sm text-[#8B4513]/70">Comprometido con la verdad y la transparencia</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#8B4513]/70 font-mono">DOCUMENTO VERIFICADO</p>
              <p className="text-xs text-[#8B4513]/70 font-mono">{newsletter.caseNumber}</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link href="/newsletter">
            <Button size="lg" className="bg-[#D4A574] hover:bg-[#8B4513] text-white">
              Volver al Newsletter
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
