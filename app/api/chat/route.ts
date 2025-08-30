import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import menuData from '@/data/menu.json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create a system prompt with menu information
const createMenuSystemPrompt = () => {
  const menuText = menuData.map(dish => 
    `${dish.name} (${dish.category}) - ¥${dish.price} - ${dish.description} - 辣度: ${dish.spicyLevel}/2 - 配料: ${dish.ingredients.join('、')}`
  ).join('\n');

  return `你是一位中餐厅的智能助手。你可以根据客户的喜好为推荐菜单上的美食。

我们的菜单:
${menuText}

当顾客询问菜品时:
- 根据顾客需求推荐相关菜品
- 说菜品
- 口语化

如果顾客询问菜单上没有的菜品,请礼貌告知。`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json({ message: "Please provide a message" }, { status: 400 });
    }

    // Build messages array with menu-aware system prompt
    const messages = [
      {
        role: "system" as const,
        content: createMenuSystemPrompt()
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
      temperature: 0.7,
      max_tokens: 300
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