// Simple client-side service for chat API

export async function getChatResponse(message: string, conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []): Promise<{
  message: string;
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
      message: data.message || "Sorry, I couldn't generate a response. Please try again."
    };
  } catch (error) {
    console.error('API error:', error);
    return {
      message: "Sorry, something went wrong. Please try again."
    };
  }
}