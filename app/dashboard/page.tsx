import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { getChatMessages } from "@/lib/supabase/queries"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { conversation?: string }
}) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let conversationId: string | null = null
  let initialMessages: any[] = []

  if (searchParams.conversation) {
    conversationId = searchParams.conversation
    try {
      initialMessages = await getChatMessages(conversationId)
    } catch (error) {
      console.error("[v0] Error loading conversation:", error)
    }
  }

  return <DashboardLayout user={user} conversationId={conversationId} initialMessages={initialMessages} />
}
