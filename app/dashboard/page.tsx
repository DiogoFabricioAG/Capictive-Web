import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { getChatMessages } from "@/lib/supabase/queries"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>
}) {
  const params = await searchParams

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let conversationId: string | null = null
  let initialMessages: any[] = []

  if (params.conversation) {
    conversationId = params.conversation
    console.log("[v0] Loading conversation:", conversationId)
    try {
      initialMessages = await getChatMessages(conversationId)
      console.log("[v0] Loaded messages:", initialMessages.length)
      console.log("[v0] Messages:", JSON.stringify(initialMessages, null, 2))
    } catch (error) {
      console.error("[v0] Error loading conversation:", error)
    }
  }

  return <DashboardLayout user={user} conversationId={conversationId} initialMessages={initialMessages} />
}
