"use client"

import type React from "react"
import { useState } from "react"
import { Upload, LinkIcon, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { uploadFile } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface DatabaseSubmissionFormProps {
  onSuccess?: () => void
}

export function DatabaseSubmissionForm({ onSuccess }: DatabaseSubmissionFormProps) {
  const [submissionType, setSubmissionType] = useState<"document" | "url">("url")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [docFile, setDocFile] = useState<File | null>(null)
  // La subida se hará al enviar el formulario; este componente solo guarda el archivo seleccionado
  const [showThanks, setShowThanks] = useState(false)

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setDocFile(file)
  }

  const playEasterEggAudio = () => {
    try {
      const tracks = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_LsYNk88GeLLZuVuebDkAG5XXAEAr/2lo_SQ-pi7bBu4zXQDjlpP/public/audios/mensaje-1-capictive.mp3",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_LsYNk88GeLLZuVuebDkAG5XXAEAr/0ABh7Ur4F9wiJZeEdwoJDf/public/audios/mensaje-2-capictive.mp3",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_LsYNk88GeLLZuVuebDkAG5XXAEAr/g_fcEBteYNFk37LGPBXkfT/public/audios/mensaje-3-capictive.mp3",
      ]
      const pick = tracks[Math.floor(Math.random() * tracks.length)]
      const audio = new Audio(pick)
      audio.volume = 0.8
      // Fire-and-forget; if the browser blocks autoplay, we ignore the error
      void audio.play().catch(() => {})
    } catch {
      // ignore any audio errors silently
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.currentTarget
    try {
      // Recopilar datos del formulario
      const type = submissionType
      const category = (form.querySelector('#submission-category') as HTMLSelectElement)?.value || ''
      const description = (form.querySelector('#submission-description') as HTMLTextAreaElement)?.value || ''
      const submitterName = (form.querySelector('#submitter-name') as HTMLInputElement)?.value || ''
      const submitterEmail = (form.querySelector('#submitter-email') as HTMLInputElement)?.value || ''

      let url: string | undefined
      let uploadResult: unknown | undefined

      if (type === 'url') {
        url = (form.querySelector('#submission-url') as HTMLInputElement)?.value || ''
        if (!url) throw new Error('Debes indicar una URL válida.')
      } else {
        if (!docFile) throw new Error('Debes seleccionar un documento para subir.')
        // Subir el archivo al enviar el formulario
        uploadResult = await uploadFile(docFile)
        if (!uploadResult) throw new Error('La subida del documento no devolvió resultado.')
      }

      // Construir el payload con toda la info
      const payload = {
        type,
        url,
        category,
        description,
        submitter: { name: submitterName, email: submitterEmail },
        document: docFile ? { name: docFile.name, type: docFile.type, size: docFile.size } : undefined,
        uploadResult,
      }

      // Aquí podrías hacer un fetch a tu API para guardar la metadata en DB
      // await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

      // eslint-disable-next-line no-console
      console.log('Submission payload:', payload)
      if (type === 'document') {
        playEasterEggAudio()
      }
      // Mostrar modal de agradecimiento ~10s y luego cerrar modal padre con onSuccess
      setShowThanks(true)
      window.setTimeout(() => {
        setShowThanks(false)
        onSuccess?.()
      }, 10000)

      // Reset de formulario y estado
      form.reset()
      setDocFile(null)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error al enviar el formulario:', err)
      // Aquí podrías mostrar un toast/modal de error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submission Type Selector */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant={submissionType === "url" ? "default" : "outline"}
          onClick={() => setSubmissionType("url")}
          className={`flex-1 cursor-pointer ${submissionType === "url" ? "bg-mustard hover:bg-mustard/90 text-wood" : "bg-transparent"}`}
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          URL de Noticia
        </Button>
        <Button
          type="button"
          variant={submissionType === "document" ? "default" : "outline"}
          onClick={() => setSubmissionType("document")}
          className={`flex-1 cursor-pointer ${submissionType === "document" ? "bg-mustard hover:bg-mustard/90 text-wood" : "bg-transparent"}`}
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir Documento
        </Button>
      </div>

      {/* URL Input */}
      {submissionType === "url" && (
        <div className="space-y-2">
          <label htmlFor="submission-url" className="text-sm font-medium text-foreground">URL de la Noticia o Fuente</label>
          <Input id="submission-url" type="url" placeholder="https://ejemplo.com/noticia" required className="bg-card border-wood/20" />
        </div>
      )}

      {/* Document Upload */}
      {submissionType === "document" && (
        <div className="space-y-2">
          <label htmlFor="submission-doc" className="text-sm font-medium text-foreground">Documento (PDF, DOC, DOCX)</label>
          <Input
            id="submission-doc"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={handleDocumentChange}
            className="bg-card border-wood/20 cursor-pointer"
          />

          {docFile && (
            <div className="text-sm text-muted-foreground">
              Archivo: <span className="text-foreground">{docFile.name}</span>
            </div>
          )}

        </div>
      )}

      {/* Category */}
      <div className="space-y-2">
        <label htmlFor="submission-category" className="text-sm font-medium text-foreground">Categoría</label>
        <select
          id="submission-category"
          required
          className="w-full px-3 py-2 bg-card border border-wood/20 rounded-md text-foreground cursor-pointer"
        >
          <option value="">Selecciona una categoría</option>
          <option value="government">Fuente Gubernamental</option>
          <option value="media">Medio de Comunicación</option>
          <option value="public">Registro Público</option>
          <option value="academic">Base de Datos Académica</option>
        </select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="submission-description" className="text-sm font-medium text-foreground">Descripción y Contexto</label>
        <Textarea
          id="submission-description"
          placeholder="Explica por qué esta fuente es relevante y qué información contiene..."
          required
          rows={4}
          className="bg-card border-wood/20 resize-none"
        />
      </div>

      {/* Submitter Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="submitter-name" className="text-sm font-medium text-foreground">Tu Nombre (opcional)</label>
          <Input id="submitter-name" type="text" placeholder="Juan Pérez" className="bg-card border-wood/20" />
        </div>
        <div className="space-y-2">
          <label htmlFor="submitter-email" className="text-sm font-medium text-foreground">Tu Email (opcional)</label>
          <Input id="submitter-email" type="email" placeholder="tu@email.com" className="bg-card border-wood/20" />
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-mustard/5 border border-mustard/20 rounded-lg">
        <AlertCircle className="w-5 h-5 text-mustard flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tu envío será revisado por nuestro equipo de validación (humano y IA) antes de ser agregado a la base de
          conocimiento. Este proceso puede tomar entre 24-48 horas.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full duration-300  hover:bg-mustard/90  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Enviando..." : "Enviar para Revisión"}
      </Button>

      {/* Modal de agradecimiento */}
      <Dialog open={showThanks} onOpenChange={setShowThanks}>
        <DialogContent showCloseButton className="text-center">
          <DialogHeader>
            <DialogTitle>¡Gracias por tu contribución!</DialogTitle>
            <DialogDescription>
              Estamos procesando tu envío. Puedes cerrar esta ventana o esperar a que se cierre automáticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 h-2 w-full bg-muted rounded">
            <div
              className="h-2 w-full rounded"
              style={{
                backgroundColor: 'var(--color-primary)',
                animation: 'shimmer 2s linear infinite',
              }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Esta ventana se cerrará en ~10 segundos.</p>
        </DialogContent>
      </Dialog>
    </form>
  )
}
