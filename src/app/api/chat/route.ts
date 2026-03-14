import { NextRequest, NextResponse } from 'next/server'
import { chat, ChatMessage } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    const response = await chat(messages)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}