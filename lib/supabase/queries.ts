import { createClient as createServerClient } from "@/lib/supabase/server"

// Videos
export async function getVideos() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("videos").select("*").order("published_at", { ascending: false })

  if (error) throw error
  return data
}

// Podcasts
export async function getPodcasts() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("podcasts").select("*").order("published_at", { ascending: false })

  if (error) throw error
  return data
}

// Newsletters
export async function getNewsletters() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("newsletters").select("*").order("published_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getNewsletterBySlug(slug: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("newsletters")
    .select(`
      *,
      newsletter_findings(*),
      newsletter_stats(*)
    `)
    .eq("slug", slug)
    .single()

  if (error) throw error
  return data
}

// Government Initiatives
export async function getGovernmentInitiatives() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("government_initiatives")
    .select(`
      *,
      initiative_connections(
        connected_initiative_id,
        relationship_type
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Information Sources
export async function getInformationSources() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("information_sources").select("*").order("category", { ascending: true })

  if (error) throw error
  return data
}

// Chat
export async function getChatConversations(userId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getChatMessages(conversationId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data
}

export async function createChatConversation(userId: string, title: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("chat_conversations").insert({ user_id: userId, title }).select().single()

  if (error) throw error
  return data
}

export async function saveChatMessage(conversationId: string, role: "user" | "assistant", content: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single()

  if (error) throw error
  return data
}

// User Contributions
export async function submitContribution(
  userId: string,
  contribution: {
    type: "document" | "url"
    category: string
    title: string
    description: string
    url?: string
    document_url?: string
  },
) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("user_contributions")
    .insert({
      user_id: userId,
      ...contribution,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Newsletter Subscription
export async function subscribeToNewsletter(email: string, userId?: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("user_subscriptions")
    .insert({
      email,
      user_id: userId || null,
      is_active: true,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
