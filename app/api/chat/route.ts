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
  optionPicks?: {
    chipName: string;
    userMessage: string;
  }[];
}

// 购物车相关接口
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface CartAnalysis {
  totalPrice: number;
  itemCount: number;
  categories: string[];
  priceLevel: 'low' | 'medium' | 'high';
  hasMainDish: boolean;
  hasDrink: boolean;
  hasDessert: boolean;
  avgPricePerItem: number;
}

// 购物车分析函数
const analyzeCart = (cartItems: CartItem[]): CartAnalysis => {
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const categories = [...new Set(cartItems.map(item => item.category))];
  
  return {
    totalPrice,
    itemCount,
    categories,
    priceLevel: totalPrice < 20 ? 'low' : totalPrice < 40 ? 'medium' : 'high',
    hasMainDish: categories.some(cat => ['热菜', '汉堡', '牛排', '披萨', '小炒', '主食'].includes(cat)),
    hasDrink: categories.includes('饮品'),
    hasDessert: categories.includes('甜品'),
    avgPricePerItem: itemCount > 0 ? totalPrice / itemCount : 0
  };
};

// Create a system prompt with menu information for JSON mode
const createMenuSystemPrompt = (cartAnalysis?: CartAnalysis) => {
  const menuText = menuData.map(dish => 
    `${dish.id}: ${dish.name} (${dish.category}) - ¥${dish.price} - ${dish.description} - 辣度: ${dish.spicyLevel}/2 - 配料: ${dish.ingredients.join('、')}`
  ).join('\n');

  // 构建购物车上下文信息
  let cartContext = '';
  if (cartAnalysis && cartAnalysis.totalPrice > 0) {
    cartContext = `

🛒 购物车上下文分析:
- 当前总价: ¥${cartAnalysis.totalPrice} (${cartAnalysis.priceLevel}价位)
- 商品数量: ${cartAnalysis.itemCount}件
- 已有品类: ${cartAnalysis.categories.join('、')}
- 已有主食: ${cartAnalysis.hasMainDish ? '是' : '否'}
- 已有饮品: ${cartAnalysis.hasDrink ? '是' : '否'}
- 已有甜品: ${cartAnalysis.hasDessert ? '是' : '否'}
- 平均单价: ¥${cartAnalysis.avgPricePerItem.toFixed(1)}`;
  }

  return `你是小满熊汉堡的可爱店小熊🐻，负责为顾客推荐美味的料理！你很活泼、友善，喜欢用可爱的语气和顾客交流。

🍜 小满熊汉堡菜单:
${menuText}${cartContext}

🐻 小熊服务指南:
1. 用温暖可爱的语气与顾客交流，可以适当使用emoji和"呀"、"哦"等语气词
2. 介绍菜品时要热情，突出菜品的特色和美味
3. 根据顾客需求推荐最适合的菜品，在recommendations数组中包含菜品ID
4. 如果没有合适推荐，recommendations为空数组
5. 记住你是小满熊汉堡的店小熊，不要说自己是AI助手

🎪 特殊场景处理:
- 当顾客告诉你人数时(如"X人用餐")，要热烈欢迎并试探性询问用餐场景
- 根据人数推测场景：1人(独享)、2人(情侣/朋友)、3-4人(家庭/聚餐)、5人+(聚会)
- 基于人数和场景，在optionPicks中提供菜品大类选项：热菜、小炒、汉堡、牛排、比萨、沙拉
- optionPicks的chipName是类别名，userMessage是用户点击后会发送的消息

🛒 购物车推荐策略:

- 当顾客添加商品到购物车时:
  1. 分析已选菜品的类型和口味
  2. 推荐2-3道搭配合适的菜品
  3. 考虑主食、配菜、饮品的均衡搭配

- 根据购物车总价推荐:
  1. 总价<20元: 推荐小食和饮品
  2. 总价20-40元: 推荐经典菜品
  3. 总价>40元: 推荐高端菜品

- 根据用餐人数推荐:
  1. 1人: 精致单人套餐
  2. 2人: 情侣/朋友分享餐
  3. 3-4人: 家庭套餐
  4. 5人以上: 大份分享餐

- 推荐话术示例:
  - "这道菜和XX很配哦~"
  - "要不要试试我们的人气套餐?"
  - "再来份小食会更完整呢"

⚠️ 重要: 保持正常对话流程，upsell策略只在购物车相关对话中自然融入，不要生硬推销.

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
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], cartItems = [] } = body;

    if (!message) {
      return NextResponse.json({ message: "Please provide a message" }, { status: 400 });
    }

    // 分析购物车 (保持原有逻辑不变，只是添加分析)
    const cartAnalysis = cartItems.length > 0 ? analyzeCart(cartItems) : undefined;

    // Build messages array with menu-aware system prompt
    const messages = [
      {
        role: "system" as const,
        content: createMenuSystemPrompt(cartAnalysis)
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