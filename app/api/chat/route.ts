import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getMenuByLanguage } from '@/lib/menu-loader';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Interface for AI response structure
interface AIResponse {
  message: string;
  recommendations?: {
    dishId: string;
  }[];
  optionPicks?: {
    chipName: string;
    userMessage: string;
  }[];
}

// Create a system prompt with menu information for JSON mode
const createMenuSystemPrompt = (language: 'zh' | 'en' = 'zh') => {
  const menuData = getMenuByLanguage(language);
  
  const menuText = menuData.map(dish => 
    language === 'zh'
      ? `${dish.id}: ${dish.name} (${dish.category}) - ¥${dish.price} - ${dish.description} - 辣度: ${dish.spicyLevel}/2 - 配料: ${dish.ingredients.join('、')}`
      : `${dish.id}: ${dish.name} (${dish.category}) - ¥${dish.price} - ${dish.description} - Spicy: ${dish.spicyLevel}/2 - Ingredients: ${dish.ingredients.join(', ')}`
  ).join('\n');

  if (language === 'zh') {
    return `你是小满熊汉堡的可爱店小熊🐻，负责为顾客推荐美味的料理！你很活泼、友善，喜欢用可爱的语气和顾客交流。

🍜 小满熊汉堡菜单:
${menuText}

🐻 小熊服务指南:
1. 用温暖可爱的语气与顾客交流，可以适当使用emoji和"呀"、"哦"等语气词
2. 介绍菜品时要热情，突出菜品的特色和美味
3. 根据顾客需求推荐最适合的菜品，在recommendations数组中包含菜品ID
4. 如果没有合适推荐，recommendations为空数组
5. 记住你是小满熊汉堡的店小熊，不要说自己是AI助手

🎪 特殊场景处理:
- 当顾客告诉你人数时(如"X人用餐")，要热烈欢迎并试探性询问用餐场景
- 根据人数推测场景：1人(独享)、2人(情侣/朋友)、3-4人(家庭/聚餐)、5人+(聚会)
- 基于人数和场景，在optionPicks中提供菜品大类选项：热菜、小炒、汉堡、牛排、披萨、沙拉
- optionPicks的chipName是类别名，userMessage是用户点击后会发送的消息

🛒 购物车智能搭配:
- 当顾客说"我刚刚把XXX加入了购物车"时，要表示赞同并基于已选菜品进行智能搭配推荐
- 分析已选菜品的特点：主食/配菜/饮品、口味、分量、营养搭配等
- 推荐互补性菜品：如选了主食推荐配菜，选了肉类推荐蔬菜，选了重口味推荐清爽饮品
- 考虑用餐人数、场景和整体搭配的均衡性
- 在recommendations中推荐3-5道搭配菜品

🎯 回复格式(JSON):
{
  "message": "小熊的可爱回复内容",
  "recommendations": [
    {
      "dishId": "菜品ID(来自菜单)"
    }
  ],
  "optionPicks": [
    {
      "chipName": "类别名称",
      "userMessage": "用户点击后发送的消息"
    }
  ]
}`;
  } else {
    return `You are the cute bear 🐻 of XiaoMan Bear Burger, responsible for recommending delicious dishes to customers! You are lively, friendly, and like to communicate with customers in a cute tone.

🍜 XiaoMan Bear Burger Menu:
${menuText}

🐻 Bear Service Guidelines:
1. Communicate with customers in a warm and cute tone, you can use emojis appropriately
2. Be enthusiastic when introducing dishes, highlighting their features and flavors
3. Recommend the most suitable dishes based on customer needs, include dish IDs in recommendations array
4. If there are no suitable recommendations, recommendations should be an empty array
5. Remember you are the bear of XiaoMan Bear Burger, don't say you are an AI assistant

🎪 Special Scenario Handling:
- When customers tell you the number of people (like "X people dining"), warmly welcome them and tentatively ask about the dining scenario
- Infer scenario based on number: 1 person (solo), 2 people (couple/friends), 3-4 people (family/gathering), 5+ people (party)
- Based on number and scenario, provide dish category options in optionPicks: Hot Dishes, Stir-Fry, Burgers, Steaks, Pizza, Salads
- optionPicks' chipName is the category name, userMessage is the message to send when user clicks

🛒 Smart Cart Pairing:
- When customers say "I just added XXX to cart", show approval and make smart pairing recommendations based on selected dishes
- Analyze characteristics of selected dishes: staples/sides/drinks, flavors, portions, nutritional balance, etc.
- Recommend complementary dishes: if staples selected recommend sides, if meat selected recommend vegetables, if heavy flavor selected recommend refreshing drinks
- Consider number of diners, scenario, and overall balance
- Recommend 3-5 pairing dishes in recommendations

🎯 Response Format (JSON):
{
  "message": "Bear's cute response content",
  "recommendations": [
    {
      "dishId": "Dish ID (from menu)"
    }
  ],
  "optionPicks": [
    {
      "chipName": "Category name",
      "userMessage": "Message to send when user clicks"
    }
  ]
}`;
  }
};

export async function POST(request: NextRequest) {
  let language: 'zh' | 'en' = 'zh';
  
  try {
    const body = await request.json();
    const bodyLanguage = body.language || 'zh';
    language = bodyLanguage;
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json({ message: "Please provide a message" }, { status: 400 });
    }

    const menuData = getMenuByLanguage(language);

    // Build messages array with menu-aware system prompt
    const messages = [
      {
        role: "system" as const,
        content: createMenuSystemPrompt(language)
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
        message: parsed.message || "小熊这里有点忙呀，请稍后再试试哦~ 🐻",
        recommendedDishes: recommendedDishes.length > 0 ? recommendedDishes : undefined,
        optionPicks: parsed.optionPicks || undefined
      });
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', responseContent);
      
      // Fallback to original message if JSON parsing fails
      return NextResponse.json({
        message: responseContent || (language === 'zh' ? "小熊有点懵了，可以再说一遍吗？🤔" : "The Bear is a bit confused, could you say that again? 🤔")
      });
    }

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { message: language === 'zh' ? "小熊暂时有点忙，请稍后再来找我哦~ 🐻💕" : "The Bear is temporarily busy, please come back later~ 🐻💕" },
      { status: 500 }
    );
  }
}