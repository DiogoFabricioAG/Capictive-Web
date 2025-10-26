import { type NextRequest, NextResponse } from "next/server"
import { queryCapictiveBot } from "@/lib/capictive-bot"
import { getSupabaseAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const botResponse = await queryCapictiveBot(topic, "podcast")

    if (!botResponse.response) {
      return NextResponse.json({ error: "Failed to generate podcast content" }, { status: 500 })
    }

    const lines = botResponse.response.split("\n").filter((line) => line.trim())
    const titleLine = lines[0] || "Podcast sin título"
    const title = titleLine.replace(/^#+\s*/, "").trim()

    const supabase = getSupabaseAdminClient()
    const { data: existingPodcasts } = await supabase
      .from("podcasts")
      .select("episode_number")
      .order("episode_number", { ascending: false })
      .limit(1)

    const nextEpisodeNumber = existingPodcasts && existingPodcasts[0] ? existingPodcasts[0].episode_number + 1 : 1

    const contentWithoutTitle = lines.slice(1).join("\n")
    const description = contentWithoutTitle.substring(0, 200).trim() + "..."

    const { data: podcast, error } = await supabase
      .from("podcasts")
      .insert({
        title,
        description,
        audio_url: botResponse.audio?.url || null,
        episode_number: nextEpisodeNumber,
        duration: "Por determinar", // Could be calculated from audio file
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving podcast:", error)
      return NextResponse.json({ error: "Failed to save podcast" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      podcast,
    })
  } catch (error) {
    console.error("[v0] Error generating podcast:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
