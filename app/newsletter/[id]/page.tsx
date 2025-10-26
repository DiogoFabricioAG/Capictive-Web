import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { getNewsletterBySlug } from "@/lib/supabase/queries"
import { marked } from "marked"

export default async function NewsletterDetailPage({ params }: { params: { id: string } }) {
  let newsletter
  try {
    // Try to fetch by slug (the id param is actually the slug in the URL)
    newsletter = await getNewsletterBySlug(params.id)
  } catch (error) {
    console.error("[v0] Error fetching newsletter:", error)
    newsletter = null
  }

  if (!newsletter) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 lg:px-8 pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Informe no encontrado</h1>
          <p className="text-gray-600 mb-6">El informe que buscas no existe o ha sido removido.</p>
          <Link href="/newsletter">
            <Button>Volver al Newsletter</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const contentHtml = marked(newsletter.content || "")

  const formattedDate = new Date(newsletter.published_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <main className="min-h-screen bg-[#faf8f3]">
      <Navbar />

      <div className="container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-5xl">
        {/* Confidential Header */}
        <div className="mb-8 border-4 border-[#8B4513] bg-[#f5e6d3] p-6 relative">
          <div className="absolute top-0 left-0 right-0 h-8 bg-[#8B4513] flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-widest">ANÁLISIS CONFIDENCIAL</span>
          </div>
          <div className="mt-6 flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Image src="/capictive-logo.png" alt="Capictive" width={48} height={48} className="rounded-full" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#8B4513]">{newsletter.title}</h1>
                  <p className="text-sm text-[#8B4513]/70">Caso No. CAP-{newsletter.id}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-[#8B4513] mb-1">
                <Calendar className="h-4 w-4" />
                <span className="font-mono text-sm">{formattedDate}</span>
              </div>
              <Badge variant="outline" className="border-[#8B4513] text-[#8B4513]">
                <FileText className="h-3 w-3 mr-1" />
                Informe Oficial
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content - Markdown rendered */}
        <Card className="mb-8 border-2 border-[#D4A574] bg-white shadow-lg">
          <CardContent className="p-8">
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-[#8B4513] 
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-xl prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6
                prose-p:text-[#5C4033] prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-[#8B4513] prose-strong:font-bold
                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                prose-li:text-[#5C4033] prose-li:mb-2
                prose-table:border-2 prose-table:border-[#D4A574] prose-table:w-full
                prose-th:bg-[#D4A574]/20 prose-th:p-3 prose-th:text-[#8B4513] prose-th:font-bold prose-th:border prose-th:border-[#D4A574]
                prose-td:p-3 prose-td:border prose-td:border-[#D4A574] prose-td:text-[#5C4033]
                prose-hr:border-[#D4A574] prose-hr:my-8
                prose-blockquote:border-l-4 prose-blockquote:border-[#D4A574] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#5C4033]"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </CardContent>
        </Card>

        {/* Statistics from newsletter_stats if available */}
        {newsletter.newsletter_stats && newsletter.newsletter_stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {newsletter.newsletter_stats.map((stat: any, index: number) => (
              <Card key={index} className="border-2 border-[#D4A574] bg-white">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-[#D4A574] mb-2">{stat.value}</div>
                  <div className="text-sm text-[#8B4513] font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Findings from newsletter_findings if available */}
        {newsletter.newsletter_findings && newsletter.newsletter_findings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#D4A574]/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[#8B4513]" />
              </div>
              <h2 className="text-2xl font-bold text-[#8B4513]">Hallazgos Principales</h2>
            </div>

            <div className="space-y-6">
              {newsletter.newsletter_findings.map((finding: any, index: number) => (
                <Card key={index} className="border-2 border-[#D4A574] bg-white shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#8B4513] mb-3">{finding.title}</h3>
                    <p className="text-[#5C4033] leading-relaxed">{finding.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Detective Signature */}
        <div className="border-t-2 border-[#8B4513] pt-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image src="/capictive-logo.png" alt="Capictive" width={64} height={64} className="rounded-full" />
              <div>
                <p className="font-bold text-[#8B4513] text-lg">Capictive - Agente de Investigación</p>
                <p className="text-sm text-[#8B4513]/70">Comprometido con la verdad y la transparencia</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#8B4513]/70 font-mono">DOCUMENTO VERIFICADO</p>
              <p className="text-xs text-[#8B4513]/70 font-mono">CAP-{newsletter.id}</p>
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
