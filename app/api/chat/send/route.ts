import { NextResponse } from "next/server"
import { queryCapictiveBot } from "@/lib/capictive-bot"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { message, conversationId, userId } = await req.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    const supabase = await createClient()

    let currentConversationId = conversationId
    if (!currentConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from("chat_conversations")
        .insert({
          user_id: userId,
          title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
        })
        .select()
        .single()

      if (convError) throw convError
      currentConversationId = newConversation.id
    }

    const { error: userMsgError } = await supabase.from("chat_messages").insert({
      conversation_id: currentConversationId,
      role: "user",
      content: message,
    })

    if (userMsgError) throw userMsgError

    const botResponse = await queryCapictiveBot(message)

    const { error: assistantMsgError } = await supabase.from("chat_messages").insert({
      conversation_id: currentConversationId,
      role: "assistant",
      content: botResponse,
    })

    if (assistantMsgError) throw assistantMsgError

    await supabase
      .from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", currentConversationId)

    return NextResponse.json({
      response: botResponse,
      conversationId: currentConversationId,
    })
  } catch (error) {
    console.error("[v0] Error in chat send:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
