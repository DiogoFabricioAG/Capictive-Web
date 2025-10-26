import { type NextRequest, NextResponse } from "next/server"
import { queryCapictiveBot } from "@/lib/capictive-bot"
import { getSupabaseAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Call the bot with "detailed" style to generate newsletter content
    const botResponse = await queryCapictiveBot(topic, "detailed")

    // Extract title from first line (remove markdown heading symbols)
    const lines = botResponse.response.split("\n").filter((line) => line.trim())
    const firstLine = lines[0] || "Newsletter sin título"
    const title = firstLine.replace(/^#+\s*/, "").trim()

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    // Extract summary (first paragraph after title)
    const contentWithoutTitle = lines.slice(1).join("\n")
    const paragraphs = contentWithoutTitle.split("\n\n").filter((p) => p.trim())
    const summary = paragraphs[0]?.substring(0, 200) || "Newsletter generado por Capictive"

    // Save to database using admin client to bypass RLS for publishing newsletters
    const supabase = getSupabaseAdminClient()
    // Generate a fun case number: YEAR-XXXX (4 random digits)
    const year = new Date().getFullYear()
    const random4 = Math.floor(1000 + Math.random() * 9000)
    const caseNumber = `${year}-${random4}`
    const { data, error } = await supabase
      .from("newsletters")
      .insert({
        title,
        slug,
        summary,
        content: botResponse.response,
        case_number: caseNumber,
        severity: "medium",
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      newsletter: data,
      message: "Newsletter generado exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error generating newsletter:", error)
    return NextResponse.json({ error: "Failed to generate newsletter" }, { status: 500 })
  }
}
