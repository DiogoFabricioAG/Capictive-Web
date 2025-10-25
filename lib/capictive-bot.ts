import { marked } from "marked"

const WORKER_URL = "https://capictive-brain.diogofabricio17.workers.dev"

export interface BotResponse {
  response: string
}

export async function queryCapictiveBot(query: string): Promise<string> {
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`Bot request failed: ${response.statusText}`)
    }

    const data: BotResponse = await response.json()
    return data.response
  } catch (error) {
    console.error("[v0] Error querying Capictive bot:", error)
    throw error
  }
}

export function formatMarkdownResponse(markdown: string): string {
  try {
    const html = marked.parse(markdown, {
      breaks: true,
      gfm: true,
    })
    return html as string
  } catch (error) {
    console.error("[v0] Error formatting markdown:", error)
    return markdown
  }
}
