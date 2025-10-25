import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: `Eres Capictive, un asistente de IA especializado en análisis político y seguimiento gubernamental. 
    Tu objetivo es ayudar a los usuarios a:
    - Analizar campañas políticas y estrategias electorales
    - Verificar información sobre promesas y acciones gubernamentales
    - Proporcionar datos objetivos sobre procesos electorales
    - Responder preguntas sobre política y gobierno de manera imparcial
    
    Siempre mantén un tono profesional, objetivo y educativo. Proporciona fuentes cuando sea posible y admite cuando no tienes información suficiente.`,
    prompt,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("[v0] Chat aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
