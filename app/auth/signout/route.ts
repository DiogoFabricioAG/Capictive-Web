import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL("/", request.url))
}
