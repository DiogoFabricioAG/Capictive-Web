import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Insert subscription
    const { data, error } = await supabase
      .from("user_subscriptions")
      .insert({
        email,
        user_id: user?.id || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      // Check if already subscribed
      if (error.code === "23505") {
        return NextResponse.json({ error: "Este email ya está suscrito" }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Error al suscribirse. Intenta de nuevo." }, { status: 500 })
  }
}
