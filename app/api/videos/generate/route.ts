import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

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

    // Save to Supabase videos table
    const supabase = await getSupabaseServerClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate a title from the message (first 60 chars)
    const title = message.length > 60 ? message.substring(0, 60) + "..." : message

    // Determine the URL based on the result type
    const videoUrl = result.type === "video" ? result.link : null
    const audioUrl = result.type === "audio" ? result.link : null

    const { data: video, error: dbError } = await supabase
      .from("videos")
      .insert({
        title,
        description: message,
        twitter_url: result.type === "video" ? result.link : "#",
        thumbnail_url: result.type === "audio" ? "/images/capictive-detective-poster.png" : null,
        video_url: videoUrl,
        audio_url: audioUrl,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      throw dbError
    }

    console.log("[v0] Video saved to database:", video)

    return NextResponse.json({ success: true, result, video })
  } catch (error) {
    console.error("[v0] Error generating video:", error)
    return NextResponse.json({ error: "Failed to generate video" }, { status: 500 })
  }
}
