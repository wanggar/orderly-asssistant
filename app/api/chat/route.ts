import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json({ message: "Please provide a message" }, { status: 400 });
    }

    // Build messages array with conversation history
    const messages = [
      {
        role: "system" as const,
        content: "You are a helpful assistant."
      },
      // Add conversation history
      ...conversationHistory,
      {
        role: "user" as const,
        content: message
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 1,
      max_tokens: 100
    });

    const assistantMessage = response.choices[0].message;

    return NextResponse.json({
      message: assistantMessage.content || "I'm sorry, I couldn't generate a response."
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { message: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}