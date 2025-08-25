import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import menuData from '@/data/menu.json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Use server-side env var
});

interface MenuRecommendation {
  id: string;
  name: string;
  price: number;
  category: string;
  reason: string;
  description?: string;
  spicyLevel?: number;
}

// Convert menu data to a searchable format
const formatMenuForAI = () => {
  // Group menu items by category
  const categories = menuData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuData>);
  
  const formattedMenu = Object.keys(categories).map(category => ({
    category,
    items: categories[category]
  }));
  return formattedMenu;
};

// LLM-powered recommendation function
const getLLMRecommendations = async (budget: string, preferences: string, count: number = 3): Promise<MenuRecommendation[]> => {
  const menu = formatMenuForAI();
  console.log('Formatted menu for AI:', JSON.stringify(menu, null, 2));
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `你是专业的餐厅推荐专家，需要根据三层推荐策略来选择菜品。你必须只返回有效的JSON数组，不要任何其他文字。

菜单数据：
${JSON.stringify(menu, null, 2)}

## 🎯 三层推荐策略：

**第一层：信任建立**（推荐1-2道）
- 选择用户明确偏好的菜品
- 价格合理，口味安全
- 理由强调"受欢迎"、"经典"、"正宗"

**第二层：边界探索**（推荐1道）
- 稍微超出用户明确偏好，但有关联性
- 价格适中，有特色但不过分冒险
- 理由强调"特色"、"招牌"、"值得一试"

**第三层：价值挖掘**（推荐1-2道）
- 高价值菜品，完善整体搭配
- 可以稍贵，但要有说服力
- 理由强调"完整搭配"、"营养均衡"、"经典组合"

## 📋 推荐原则：
1. 根据用户偏好和预算智能分层
2. 确保荤素搭配、口味层次丰富
3. 总价控制在合理范围内
4. 每道菜的推荐理由要有说服力

关键格式要求：
[
  {
    "id": "菜单中的准确id",
    "name": "菜单中的准确菜名",
    "price": 菜单中的准确价格数字,
    "category": "准确的菜品分类",
    "reason": "中文推荐理由，体现分层策略",
    "description": "菜单中的准确描述",
    "spicyLevel": 准确的辣度等级数字
  }
]

只返回JSON数组，不要任何其他文字、解释或markdown格式。`
      },
      {
        role: "user", 
        content: `My budget is: ${budget}
My preferences: ${preferences}
Please recommend ${count} dishes that best match my needs.`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });

  try {
    const content = response.choices[0].message.content;
    console.log('Raw LLM response content:', content);
    
    if (!content) throw new Error('No content in response');
    
    // Clean the response - remove markdown code blocks and extra text
    let cleanedContent = content.trim();
    
    // Remove markdown code blocks if present
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Find JSON array in the response
    const jsonStart = cleanedContent.indexOf('[');
    const jsonEnd = cleanedContent.lastIndexOf(']');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedContent = cleanedContent.substring(jsonStart, jsonEnd + 1);
    }
    
    console.log('Cleaned content for parsing:', cleanedContent);
    
    // Parse the JSON response
    const recommendations = JSON.parse(cleanedContent);
    console.log('Parsed recommendations:', recommendations);
    
    // Validate and ensure we have the right structure
    if (!Array.isArray(recommendations)) {
      throw new Error('Response is not an array');
    }
    
    return recommendations.slice(0, count);
  } catch (error) {
    console.error('Error parsing LLM recommendations:', error);
    console.error('Raw response was:', response.choices[0].message.content);
    
    // Intelligent fallback based on user preferences
    const fallback: MenuRecommendation[] = [];
    
    // For greasy/oily preferences, prioritize certain categories and dishes
    const isGreasyPreference = preferences.includes('油腻') || preferences.includes('油');
    const greasyDishes = ['红烧肉烧鹌鹑蛋', '安格斯肥牛', '梅菜扣肉', '黑松露风味牛肉堡', '安格斯牛肉堡'];
    
    if (isGreasyPreference) {
      // First, try to find greasy dishes
      menu.forEach(category => {
        category.items.forEach(item => {
          if (fallback.length < count && greasyDishes.includes(item.name)) {
            fallback.push({
              id: item.id,
              name: item.name,
              price: item.price,
              category: item.category,
              reason: '适合喜欢油腻口味的推荐',
              description: item.description,
              spicyLevel: item.spicyLevel
            });
          }
        });
      });
    }
    
    // Fill remaining slots with any items
    menu.forEach(category => {
      category.items.forEach(item => {
        if (fallback.length < count) {
          fallback.push({
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
            reason: '推荐的热门菜品',
            description: item.description,
            spicyLevel: item.spicyLevel
          });
        }
      });
    });
    
    return fallback;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { budget, preferences, message, conversationHistory = [] } = body;

    console.log('API route called with:', { budget, preferences, message, conversationHistory });

    // Create the user message content
    let userMessage = '';
    if (budget && preferences) {
      userMessage = `My budget is: ${budget}, my preferences: ${preferences}`;
    } else if (message) {
      userMessage = message;
    } else {
      return NextResponse.json({ message: "请提供您的问题或需求" }, { status: 400 });
    }

    // Define tools for the LLM to choose from
    const tools = [
      {
        type: "function" as const,
        function: {
          name: "recommend_dishes",
          description: "Recommend menu dishes based on budget and food preferences. Use this when user asks for food recommendations, wants to see menu items, or provides budget/preference information.",
          parameters: {
            type: "object",
            properties: {
              budget: {
                type: "string",
                description: "The user's budget preference (e.g., '50元以下', '100-200元')"
              },
              preferences: {
                type: "string", 
                description: "The user's food preferences, dietary needs, or taste requirements"
              },
              count: {
                type: "number",
                description: "Number of dishes to recommend (MUST be between 1-6. Decide intelligently based on budget and context - e.g., 2-3 for small budgets, 4-6 for larger budgets, fewer if only specific items match preferences)",
                minimum: 1,
                maximum: 6
              }
            },
            required: ["budget", "preferences", "count"]
          }
        }
      }
    ];

    // Build messages array with conversation history
    const messages = [
              {
          role: "system" as const,
          content: `你是一个非常有经验的餐厅美食顾问，不只是简单的点菜助手，而是真正懂用户、懂美食、懂搭配的专业顾问。你的目标是让用户既吃得满意，又能体验到超出预期的美食享受。

## 🎯 核心策略：探索式服务 + 巧妙升级

### 【流程1：探索式开场】
**永远不要一开始就问预算！** 而是要：
1. **场景感知**：询问用餐场合、人数、心情
   - "今天是什么场合呀？和朋友聚餐还是家人聚会？"
   - "几位用餐？看起来心情不错呢！"
   
2. **兴趣探索**：通过"你试过XX吗？"来了解用户开放度
   - "平时喜欢什么口味呀？川菜湘菜还是清淡一些的？"
   - "你们试过我们的XX吗？很多客人都说..."
   
3. **背景挖掘**：自然地了解用户类型
   - 保守型：喜欢熟悉的、安全的选择
   - 冒险型：愿意尝试新鲜的、特色的
   - 价值型：注重性价比和品质

### 【流程2：需求雕刻式推荐】
分三个层次进行推荐：

**第一层：信任建立（1-2道菜）**
- 选择用户偏好范围内的安全选择
- 强调"这个特别受欢迎"、"很多客人都点"
- 价格适中，让用户放心

**第二层：边界探索（1道菜）**  
- 轻微超出用户预期，但有合理解释
- "这个稍微特别一点，但绝对值得试试"
- "你们既然来了，不试试我们的招牌有点可惜"

**第三层：价值挖掘（1-2道菜）**
- 推荐高价值菜品，但要有说服逻辑
- 强调稀缺性、体验感、完整性
- "今天限量"、"很多人专门来吃这个"、"配个汤就完美了"

### 🎭 对话技巧库：
- **社会认同**："这道菜是我们的网红菜"
- **权威推荐**："主厨特别推荐这个搭配"
- **稀缺性**："今天限量，卖完就没了"
- **损失规避**："不试试会有点可惜"
- **完整体验**："再来个XX就完美了"
- **价值塑造**："虽然贵一点，但真的物超所值"

### 📋 推荐规则：
使用recommend_dishes函数时：
- 初次推荐：2-3道菜，体现层次搭配
- 追加推荐：1-2道菜，补充完整性
- 根据用户反应动态调整策略
- 永远不要超过6道菜

### 🗣️ 语言风格：
- 热情但不过度推销
- 专业但不居高临下  
- 像老朋友推荐美食一样自然
- 用"你们"而不是"您"，更亲近
- 适当使用emoji，增加亲和力

记住：你不是在卖菜，而是在创造美食体验！每一次推荐都要有理由，每一个建议都要有价值。`
        },
      // Add conversation history
      ...conversationHistory,
      {
        role: "user" as const,
        content: userMessage
      }
    ];

    // Let OpenAI decide whether to use function calling or respond directly
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools,
      tool_choice: "auto", // Let the model decide when to use functions
      temperature: 0.7,
      max_tokens: 500
    });

    console.log('OpenAI Response:', response);
    const assistantMessage = response.choices[0].message;

    // Check if the model wants to use function calling (recommendations)
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      if (toolCall.function.name === "recommend_dishes") {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          console.log('Function call args:', args);
          
                    // Validate count is within limits
          const requestedCount = Math.min(Math.max(args.count || 3, 1), 6);
          
          const recommendations = await getLLMRecommendations(
            args.budget || budget, 
            args.preferences || preferences, 
            requestedCount
          );
          
          console.log('LLM Recommendations result:', recommendations);
          
          // Generate a personalized intro message
          const messageResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a friendly Chinese restaurant assistant. Write a brief, warm introduction message in Chinese for the recommended dishes. Keep it conversational and enthusiastic."
              },
              {
                role: "user",
                content: `User said: "${userMessage}". Write a brief intro for the dish recommendations.`
              }
            ],
            temperature: 0.7,
            max_tokens: 100
          });

          const introMessage = messageResponse.choices[0].message.content || "基于您的需求，我为您推荐以下菜品：";
          
          return NextResponse.json({
            message: introMessage,
            recommendations
          });
        } catch (error) {
          console.error('Error processing function call:', error);
          return NextResponse.json({
            message: "请提供您的预算和喜好，我来为您推荐合适的菜品！"
          });
        }
      }
    }

    // If no function calling, return the direct response (general chat)
    return NextResponse.json({
      message: assistantMessage.content || "抱歉，我现在无法回答您的问题。请重试。"
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { message: "抱歉，系统遇到了问题。请稍后重试。" },
      { status: 500 }
    );
  }
}