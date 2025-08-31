import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import menuData from '@/data/menu.json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Interface for AI response structure
interface AIResponse {
  message: string;
  recommendations?: {
    dishId: string;
  }[];
}

// Create a system prompt with menu information for JSON mode
const createMenuSystemPrompt = () => {
  const menuText = menuData.map(dish => 
    `${dish.id}: ${dish.name} (${dish.category}) - ¥${dish.price} - ${dish.description} - 辣度: ${dish.spicyLevel}/2 - 配料: ${dish.ingredients.join('、')}`
  ).join('\n');

  return `你是一位中餐厅的智能助手。根据客户需求推荐菜品，必须返回JSON格式。

菜单数据:
${menuText}

响应规则:
1. 根据客户需求推荐相关菜品
2. 回复要自然、口语化
3. 如果推荐菜品，在recommendations数组中包含菜品ID
4. 如果没有合适推荐，recommendations为空数组

JSON格式:
{
  "message": "自然语言回复内容",
  "recommendations": [
    {
      "dishId": "菜品ID(必须来自菜单)"
    }
  ]
}`;
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
      max_tokens: 400,
      response_format: { type: "json_object" } // Enable JSON mode
    });

    const responseContent = response.choices[0].message.content || "{}";
    
    try {
      const parsed: AIResponse = JSON.parse(responseContent);
      
      // Extract recommended dishes based on AI's structured response
      const recommendedDishes = parsed.recommendations 
        ? menuData.filter(dish => 
            parsed.recommendations!.some(rec => rec.dishId === dish.id)
          )
        : [];

      return NextResponse.json({
        message: parsed.message || "抱歉，我无法生成回复。",
        recommendedDishes: recommendedDishes.length > 0 ? recommendedDishes : undefined
      });
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', responseContent);
      
      // Fallback to original message if JSON parsing fails
      return NextResponse.json({
        message: responseContent || "抱歉，我遇到了一些问题。请重试。"
      });
    }

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { message: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}