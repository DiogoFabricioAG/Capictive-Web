import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Debes iniciar sesión para contribuir" }, { status: 401 })
    }

    const body = await request.json()
    const { type, category, title, description, url, document_url } = body

    if (!type || !category || !title || !description) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Insert contribution
    const { data, error } = await supabase
      .from("user_contributions")
      .insert({
        user_id: user.id,
        type,
        category,
        title,
        description,
        url: url || null,
        document_url: document_url || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Contribution submission error:", error)
    return NextResponse.json({ error: "Error al enviar contribución. Intenta de nuevo." }, { status: 500 })
  }
}
