import OpenAI from 'openai'
import type { Message, ModelId } from '../types'

export function createClient(apiKey: string) {
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
}

export async function streamChat(
  apiKey: string,
  model: ModelId,
  messages: Message[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
) {
  const client = createClient(apiKey)

  try {
    const stream = await client.chat.completions.create({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) onChunk(delta)
    }

    onDone()
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)))
  }
}
