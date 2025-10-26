import { type NextRequest, NextResponse } from "next/server"
import { queryCapictiveBot } from "@/lib/capictive-bot"
import { getSupabaseAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { title, topic } = await request.json()

    if (!title || !topic) {
      return NextResponse.json({ error: "Title and topic are required" }, { status: 400 })
    }

    console.log("[v0] Generating podcast:", { title, topic })

    const botResponse = await queryCapictiveBot(topic, "podcast")

    if (!botResponse.response) {
      return NextResponse.json({ error: "Failed to generate podcast content" }, { status: 500 })
    }

    const supabase = getSupabaseAdminClient()

    // Get the next episode number
    const { data: existingPodcasts } = await supabase
      .from("podcasts")
      .select("episode_number")
      .order("episode_number", { ascending: false })
      .limit(1)

    const nextEpisodeNumber = existingPodcasts && existingPodcasts[0] ? existingPodcasts[0].episode_number + 1 : 1

    const description = botResponse.response.substring(0, 200).trim() + "..."

    console.log("[v0] Saving podcast to database:", { title, episode: nextEpisodeNumber })

    const { data: podcast, error } = await supabase
      .from("podcasts")
      .insert({
        title,
        description,
        audio_url: botResponse.audio?.url || null,
        episode_number: nextEpisodeNumber,
        duration: "Por determinar",
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json(
        {
          error: "Failed to save podcast",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Podcast saved successfully:", podcast.id)

    return NextResponse.json({
      success: true,
      podcast,
    })
  } catch (error) {
    console.error("[v0] Error generating podcast:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
