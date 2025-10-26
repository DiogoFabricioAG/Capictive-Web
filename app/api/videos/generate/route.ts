import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"

const VIDEO_URLS: Record<string, string> = {
  video1: "https://pub-d080c9e6f19a459ca925c3351abec237.r2.dev/Videos/Futuro%20con%20Jeannette%20Jaram.mp4",
  video2: "https://pub-d080c9e6f19a459ca925c3351abec237.r2.dev/Videos/Debate%20Presidencial%20Chile.mp4",
}

export async function POST(request: NextRequest) {
  try {
    const { message, videoOption } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Determine the url_video based on the selected option
    const url_video = videoOption === "defecto" ? "" : VIDEO_URLS[videoOption] || ""

    console.log("[v0] Calling n8n webhook with:", { message, url_video })

    // Call the n8n webhook
    const webhookResponse = await fetch("https://capictive.app.n8n.cloud/webhook-test/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, url_video }),
    })

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed with status ${webhookResponse.status}`)
    }

    const result = await webhookResponse.json()
    console.log("[v0] Webhook response:", result)

    const supabase = getSupabaseAdminClient()

    // Generate a title from the message (first 60 chars)
    const title = message.length > 60 ? message.substring(0, 60) + "..." : message

    console.log("[v0] Saving video to database:", { title, type: result.type })

    const { data: video, error: dbError } = await supabase
      .from("videos")
      .insert({
        title,
        description: message,
        youtube_url: result.type === "video" ? result.link : null, // Use youtube_url instead of video_url
        twitter_url: result.type === "video" ? result.link : "#", // Keep twitter_url for social sharing
        thumbnail_url: result.type === "audio" ? "/images/capictive-detective-poster.png" : "/images/capictive-real-life.png",
        duration: "Por determinar",
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json(
        {
          error: "Failed to save video",
          details: dbError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Video saved successfully:", video.id)

    return NextResponse.json({ success: true, result, video })
  } catch (error) {
    console.error("[v0] Error generating video:", error)
    return NextResponse.json(
      {
        error: "Failed to generate video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
