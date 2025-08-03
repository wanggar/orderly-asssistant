// Client-side service that calls our API routes

export interface MenuRecommendation {
  id: string;
  name: string;
  english_name: string;
  price: string;
  category: string;
  reason: string;
}

export interface ChatRequest {
  budget: string;
  preferences: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export async function getChatResponse(request: ChatRequest): Promise<{
  message: string;
  recommendations?: MenuRecommendation[];
}> {
  try {
    console.log('Making API request with:', request);
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        budget: request.budget,
        preferences: request.preferences,
        conversationHistory: request.conversationHistory || []
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    return data;
  } catch (error) {
    console.error('API error:', error);
    return {
      message: "抱歉，系统遇到了问题。请稍后重试。"
    };
  }
}

export async function getGeneralChatResponse(message: string, conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []): Promise<{
  message: string;
  recommendations?: MenuRecommendation[];
}> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      message: data.message || "抱歉，我现在无法回答您的问题。请重试。",
      recommendations: data.recommendations
    };
  } catch (error) {
    console.error('API error:', error);
    return {
      message: "抱歉，系统遇到了问题。请稍后重试。"
    };
  }
}