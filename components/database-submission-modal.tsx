"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DatabaseSubmissionForm } from "@/components/database-submission-form"
import { Megaphone } from "lucide-react"

export function DatabaseSubmissionModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-mustard hover:bg-mustard/90 text-wood cursor-pointer shadow-lg hover:shadow-xl transition-all"
        >
          <Megaphone className="w-5 h-5 mr-2" />
          ¿Quieres hacer que tu voz se escuche?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-wood/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Contribuye a la Transparencia</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ayúdanos a mantener la base de datos más completa y actualizada
          </DialogDescription>
        </DialogHeader>
        <DatabaseSubmissionForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
