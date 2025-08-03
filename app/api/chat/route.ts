import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import menuData from '@/data/data.json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Use server-side env var
});

interface MenuRecommendation {
  id: string;
  name: string;
  english_name: string;
  price: string;
  category: string;
  reason: string;
}

// Convert menu data to a searchable format
const formatMenuForAI = () => {
  const categories = Object.keys(menuData) as Array<keyof typeof menuData>;
  const formattedMenu = categories.map(category => ({
    category,
    items: menuData[category]
  }));
  return formattedMenu;
};

// LLM-powered recommendation function
const getLLMRecommendations = async (budget: string, preferences: string, count: number = 5): Promise<MenuRecommendation[]> => {
  const menu = formatMenuForAI();
  console.log('Formatted menu for AI:', JSON.stringify(menu, null, 2));
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an expert Chinese restaurant recommendation engine. You MUST respond with ONLY a valid JSON array, no other text.

MENU DATA:
${JSON.stringify(menu, null, 2)}

INSTRUCTIONS:
1. Analyze user budget and preferences
2. Select dishes from the menu that match their criteria
3. For budget ranges like "100-200元", select multiple dishes that total within that range
4. For preferences like "油腻的" (greasy/oily), choose rich, fried, or fatty dishes

CRITICAL: Your response must be ONLY a valid JSON array with this exact format:
[
  {
    "id": "category-dishname",
    "name": "exact dish name from menu",
    "english_name": "exact english name from menu",
    "price": "exact price string from menu",
    "category": "exact category name",
    "reason": "reason in Chinese why this matches their preference"
  }
]

DO NOT include any other text, explanations, or markdown. Only return the JSON array.`
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
              id: `${category.category}-${item.name}`,
              name: item.name,
              english_name: item.english_name,
              price: item.price,
              category: category.category,
              reason: '适合喜欢油腻口味的推荐'
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
            id: `${category.category}-${item.name}`,
            name: item.name,
            english_name: item.english_name,
            price: item.price,
            category: category.category,
            reason: '推荐的热门菜品'
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
                description: "Number of dishes to recommend",
                default: 5
              }
            },
            required: ["budget", "preferences"]
          }
        }
      }
    ];

    // Build messages array with conversation history
    const messages = [
      {
        role: "system" as const,
        content: `You are a helpful Chinese restaurant AI assistant. You can:

1. **Recommend dishes** - When users ask for food recommendations, provide their budget/preferences, or want to see menu options, use the recommend_dishes function.

2. **General chat** - For other questions about the restaurant, ingredients, cooking methods, or general conversation, respond directly in Chinese.

Always be friendly, helpful, and respond in Chinese (Simplified). If someone asks for recommendations but doesn't provide budget or preferences, ask them for that information first.

Our menu includes: burgers, drinks, hot dishes, and side dishes with various price ranges.`
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
      model: "gpt-3.5-turbo",
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
          
          const recommendations = await getLLMRecommendations(
            args.budget || budget, 
            args.preferences || preferences, 
            args.count || 5
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