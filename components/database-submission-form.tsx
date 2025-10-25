"use client"

import type React from "react"
import { useState } from "react"
import { Upload, LinkIcon, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface DatabaseSubmissionFormProps {
  onSuccess?: () => void
}

export function DatabaseSubmissionForm({ onSuccess }: DatabaseSubmissionFormProps) {
  const [submissionType, setSubmissionType] = useState<"document" | "url">("url")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert("¡Gracias por tu contribución! Tu envío será revisado por nuestro equipo.")
    setIsSubmitting(false)

    // Reset form
    const form = e.currentTarget
    form.reset()

    // Call onSuccess callback to close modal
    onSuccess?.()
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
          <label className="text-sm font-medium text-foreground">URL de la Noticia o Fuente</label>
          <Input type="url" placeholder="https://ejemplo.com/noticia" required className="bg-card border-wood/20" />
        </div>
      )}

      {/* Document Upload */}
      {submissionType === "document" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Documento (PDF, DOC, DOCX)</label>
          <Input type="file" accept=".pdf,.doc,.docx" required className="bg-card border-wood/20 cursor-pointer" />
        </div>
      )}

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Categoría</label>
        <select
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
        <label className="text-sm font-medium text-foreground">Descripción y Contexto</label>
        <Textarea
          placeholder="Explica por qué esta fuente es relevante y qué información contiene..."
          required
          rows={4}
          className="bg-card border-wood/20 resize-none"
        />
      </div>

      {/* Submitter Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Tu Nombre (opcional)</label>
          <Input type="text" placeholder="Juan Pérez" className="bg-card border-wood/20" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Tu Email (opcional)</label>
          <Input type="email" placeholder="tu@email.com" className="bg-card border-wood/20" />
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
        className="w-full bg-mustard hover:bg-mustard/90 text-wood cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Enviando..." : "Enviar para Revisión"}
      </Button>
    </form>
  )
}
