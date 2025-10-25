import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MessageSquare, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default async function ConversationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: conversations } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-wood-dark mb-6">Mis Conversaciones</h1>

        {!conversations || conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-wood/30 mx-auto mb-4" />
            <p className="text-wood text-lg mb-4">No tienes conversaciones aún</p>
            <Link
              href="/dashboard"
              className="inline-block bg-mustard hover:bg-mustard/90 text-wood-dark px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Iniciar nueva conversación
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/dashboard?conversation=${conversation.id}`}
                className="block bg-white border border-wood/20 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-wood-dark mb-1">{conversation.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-wood">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(conversation.updated_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>
                  <MessageSquare className="w-5 h-5 text-wood/50" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
