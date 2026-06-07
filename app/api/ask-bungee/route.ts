import { streamText, convertToModelMessages } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { BUNGEE_SYSTEM_PROMPT, ADDITIONAL_KNOWLEDGE } from '@/lib/bungee-knowledge'

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json()

  const supabase = await createClient()

  // Get or create chat session
  let chatId: string
  const { data: existingChat } = await supabase
    .from('bungee_chats')
    .select('id')
    .eq('session_id', sessionId)
    .single()

  if (existingChat) {
    chatId = existingChat.id
  } else {
    const { data: newChat } = await supabase
      .from('bungee_chats')
      .insert({ session_id: sessionId })
      .select('id')
      .single()
    chatId = newChat?.id
  }

  // Fetch any uploaded knowledge from the database
  const { data: knowledgeData } = await supabase
    .from('bungee_knowledge')
    .select('name, content')
    .order('created_at', { ascending: true })

  // Build additional context from uploaded knowledge
  let uploadedKnowledge = ''
  if (knowledgeData && knowledgeData.length > 0) {
    uploadedKnowledge = '\n\n## Additional Knowledge Base\n'
    for (const doc of knowledgeData) {
      uploadedKnowledge += `\n### ${doc.name}\n${doc.content}\n`
    }
  }

  // Combine system prompt with all knowledge
  const fullSystemPrompt = BUNGEE_SYSTEM_PROMPT + ADDITIONAL_KNOWLEDGE + uploadedKnowledge

  // Save the user's latest message
  const lastUserMessage = messages[messages.length - 1]
  if (lastUserMessage && lastUserMessage.role === 'user') {
    const content = lastUserMessage.parts
      ?.filter((p: { type: string }) => p.type === 'text')
      .map((p: { text: string }) => p.text)
      .join('') || lastUserMessage.content || ''
    
    if (chatId && content) {
      await supabase
        .from('bungee_chat_messages')
        .insert({ chat_id: chatId, role: 'user', content })
    }
  }

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: fullSystemPrompt,
    messages: await convertToModelMessages(messages),
    onFinish: async ({ text }) => {
      // Save the assistant's response
      if (chatId && text) {
        await supabase
          .from('bungee_chat_messages')
          .insert({ chat_id: chatId, role: 'assistant', content: text })
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
