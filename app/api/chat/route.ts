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
const createMenuSystemPrompt = (peopleCount?: string, diningScenario?: string, isInitialRecommendation?: boolean) => {
  const menuText = menuData.map(dish => 
    `${dish.id}: ${dish.name} (${dish.category}) - ¥${dish.price} - ${dish.description} - 辣度: ${dish.spicyLevel}/2 - 配料: ${dish.ingredients.join('、')}`
  ).join('\n');

  let contextInfo = '';
  if (peopleCount && diningScenario) {
    contextInfo = `\n🎯 用餐信息:\n- 用餐人数: ${peopleCount}\n- 就餐场景: ${diningScenario}\n`;
  }

  let behaviorGuidelines = '';
  if (isInitialRecommendation) {
    behaviorGuidelines = `
🌟 初次推荐指南:
- 这是根据用餐人数和场景的首次推荐，要特别热情和周到
- 根据用餐人数推荐适量菜品（1人推荐2-3道，2人推荐3-5道，3-4人推荐6-8道，5人以上推荐8-10道）
- 根据具体就餐场景调整推荐策略：

  【1人用餐场景】
  * 工作日午餐：快速、营养、经济实惠的菜品
  * 下班犒劳自己：稍微丰富一些，口感好的安慰菜品
  * 深夜觅食：简单、暖胃、不油腻的菜品
  * 周末独享：可以慢慢品尝，尝试新口味的菜品

  【2人用餐场景】
  * 情侣约会：精致浪漫、适合分享、有情调的菜品
  * 朋友叙旧：轻松、聊天友好、不会太正式的菜品
  * 同事聚餐：适中价位、大众口味、不会太个人化的菜品

  【3-4人用餐场景】
  * 朋友聚会：丰富多样、气氛热闹、适合分享的菜品组合
  * 小型家庭聚餐：营养均衡、老少皆宜、温馨的菜品
  * 室友聚餐：经济实惠、大家都爱吃、份量足的菜品

  【5-6人用餐场景】
  * 周末家庭聚餐：丰盛、营养、照顾不同年龄口味的菜品
  * 朋友聚会：热闹、多样化、适合大家分享的菜品
  * 庆祝聚餐：稍微豪华一些、有仪式感的菜品

  【7人以上用餐场景】
  * 大家庭聚餐：分量足、口味众多、老少皆宜的经典菜品
  * 朋友大聚会：热闹、丰富、适合大家分享的菜品组合
  * 特殊庆祝：隆重、丰盛、有纪念意义的菜品

- 要详细说明推荐理由，突出为什么这些菜品特别适合当前的人数和场景
- 询问用户是否满意，引导进一步的交流`;
  } else {
    behaviorGuidelines = `
🐻 日常对话指南:
- 继续保持可爱热情的语气
- 回答用户的具体问题
- 根据用户需求调整推荐
- 记住用餐人数和场景信息，让推荐更贴心`;
  }

  return `你是小满熊汉堡的可爱店小熊🐻，负责为顾客推荐美味的料理！你很活泼、友善，喜欢用可爱的语气和顾客交流。

🍜 小满熊汉堡菜单:
${menuText}
${contextInfo}
${behaviorGuidelines}

🐻 小熊服务准则:
1. 用温暖可爱的语气与顾客交流，适当使用emoji和"呀"、"哦"等语气词
2. 介绍菜品时要热情，突出菜品的特色和美味
3. 根据顾客需求和场景推荐最适合的菜品，在recommendations数组中包含菜品ID
4. 如果没有合适推荐，recommendations为空数组
5. 记住你是小满熊汉堡的店小熊，不要说自己是AI助手
6. 根据用餐人数和具体场景给出最贴心的建议

🎯 回复格式(JSON):
{
  "message": "小熊的可爱回复内容",
  "recommendations": [
    {
      "dishId": "菜品ID(来自菜单)"
    }
  ]
}`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      message, 
      conversationHistory = [], 
      peopleCount, 
      diningScenario, 
      isInitialRecommendation = false 
    } = body;

    if (!message) {
      return NextResponse.json({ message: "Please provide a message" }, { status: 400 });
    }

    // Build messages array with menu-aware system prompt
    const messages = [
      {
        role: "system" as const,
        content: createMenuSystemPrompt(peopleCount, diningScenario, isInitialRecommendation)
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
      max_tokens: 500,
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
        message: parsed.message || "小熊这里有点忙呀，请稍后再试试哦~ 🐻",
        recommendedDishes: recommendedDishes.length > 0 ? recommendedDishes : undefined
      });
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', responseContent);
      
      // Fallback to original message if JSON parsing fails
      return NextResponse.json({
        message: responseContent || "小熊有点懵了，可以再说一遍吗？🤔"
      });
    }

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { message: "小熊暂时有点忙，请稍后再来找我哦~ 🐻💕" },
      { status: 500 }
    );
  }
}