'use client';

import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageBubble } from './message-bubble';
import { OptionsSelector } from './options-selector';
import { DishCard } from './dish-card';
import { TypingIndicator } from './typing-indicator';
import { WelcomeScreen } from './welcome-screen';
import { ShoppingCartBar } from '../cart/shopping-cart-bar';
import { CartDialog } from '../cart/cart-dialog';
import { DishDetailsPanel } from '../side-panel/dish-details-panel';
import { Message, ChatState, MenuItem, CartItem } from '@/types';
import { Send, Mic, RotateCcw } from 'lucide-react';
import { getChatResponse, getGeneralChatResponse, MenuRecommendation } from '@/lib/openai-service';
import menuData from '@/data/data.json';

export function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    currentStep: 'welcome',
    userProfile: {},
    cart: [],
    selectedDish: null,
    sidePanelOpen: false,
  });

  // Load chat state from localStorage on mount
  useEffect(() => {
    const savedChatState = localStorage.getItem('orderly-chat-state');
    if (savedChatState) {
      try {
        const parsedState = JSON.parse(savedChatState);
        setChatState(prev => ({
          ...prev,
          ...parsedState,
          // Convert timestamp strings back to Date objects
          messages: parsedState.messages?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })) || []
        }));
        // If we have messages, don't show welcome screen
        if (parsedState.messages?.length > 0) {
          setShowWelcome(false);
        }
      } catch (error) {
        console.error('Error loading chat state from localStorage:', error);
      }
    }
  }, []);

  // Save chat state to localStorage whenever it changes
  useEffect(() => {
    // Only save if we have messages (avoid saving initial empty state)
    if (chatState.messages.length > 0) {
      localStorage.setItem('orderly-chat-state', JSON.stringify({
        messages: chatState.messages,
        currentStep: chatState.currentStep,
        userProfile: chatState.userProfile,
        cart: chatState.cart
      }));
    }
  }, [chatState]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock dish data
  const mockDishes: MenuItem[] = [
    {
      id: '1',
      name: '宫保鸡丁',
      description: '经典川菜，鸡肉嫩滑，花生酥脆，酸甜微辣，口感丰富',
      price: 42,
      image: '/dishes/gongbao.jpg',
      category: '川菜',
      spicyLevel: 2,
      ingredients: ['鸡胸肉', '花生米', '青椒', '红椒', '葱'],
      recommendations: '最近挺火的，适合重口味的你～',
      reviews: [
        { id: '1', rating: 5, comment: '味道很正宗，辣度刚好！', author: '美食达人' },
        { id: '2', rating: 4, comment: '鸡肉很嫩，花生很香脆', author: '吃货小王' }
      ]
    },
    {
      id: '2',
      name: '番茄牛腩汤',
      description: '清香番茄配嫩滑牛腩，汤汁浓郁，营养丰富，老少皆宜',
      price: 38,
      image: '/dishes/tomato-beef.jpg',
      category: '汤品',
      spicyLevel: 0,
      ingredients: ['牛腩', '番茄', '洋葱', '胡萝卜', '土豆'],
      recommendations: '暖胃又营养，女生特别喜欢',
      reviews: [
        { id: '3', rating: 5, comment: '汤很鲜美，牛肉炖得很烂', author: '汤品爱好者' }
      ]
    },
    {
      id: '3',
      name: '清蒸鲈鱼',
      description: '新鲜鲈鱼清蒸制作，肉质鲜嫩，清淡健康，保持原味',
      price: 58,
      image: '/dishes/steamed-fish.jpg',
      category: '海鲜',
      spicyLevel: 0,
      ingredients: ['鲈鱼', '蒸鱼豉油', '葱丝', '姜丝'],
      recommendations: '健康清淡，适合养生',
      reviews: [
        { id: '4', rating: 5, comment: '鱼很新鲜，做法简单但味道很棒', author: '健康生活者' }
      ]
    }
  ];

  const startChat = () => {
    setShowWelcome(false);
    addMessage({
      id: '1',
      type: 'ai',
      content: '你好！我是你的AI点菜助手 🍽️ 让我来帮您推荐合适的菜品。首先，请告诉我您的预算范围：',
      options: ['50元以下', '50-100元', '100-200元', '200元以上'],
      component: 'options-selector'
    });
    setChatState(prev => ({ ...prev, currentStep: 'budget' }));
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && scrollAreaRef.current) {
      // Use scrollTop instead of scrollIntoView to prevent layout shifts
      const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatState.messages]);

  const addMessage = (message: Omit<Message, 'timestamp'>) => {
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, { ...message, timestamp: new Date() }]
    }));
  };

  const handleBudgetSelection = (budget: string) => {
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: `我的预算是：${budget}`
    });

    // Update user profile with budget
    setChatState(prev => ({ 
      ...prev, 
      userProfile: { ...prev.userProfile, budget },
      currentStep: 'preferences'
    }));

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '很好！现在请告诉我您的口味偏好，比如：喜欢辣的、清淡的、肉类、素食等等 😊',
      });
    }, 1500);
  };





  // Generic option selection handler that routes to the appropriate function
  const handleOptionSelection = (option: string) => {
    switch (chatState.currentStep) {
      case 'budget':
        handleBudgetSelection(option);
        break;
      default:
        break;
    }
  };

  // Helper function to build conversation history for API calls
  const buildConversationHistory = () => {
    return chatState.messages
      .filter(msg => msg.type === 'user' || msg.type === 'ai')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
  };

  // Helper function to convert recommendations to MenuItem format
  const convertRecommendationsToMenuItems = (recommendations: MenuRecommendation[]): MenuItem[] => {
    return recommendations.map((rec: MenuRecommendation) => ({
      id: rec.id,
      name: rec.name,
      description: rec.reason,
      price: parseInt(rec.price.replace(/[^\d]/g, '')),
      image: '/dishes/default.jpg',
      category: rec.category,
      ingredients: [],
      recommendations: rec.reason
    }));
  };

  const handlePreferencesInput = async () => {
    if (!inputValue.trim()) return;

    const preferences = inputValue;
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: preferences
    });

    setInputValue('');
    setIsTyping(true);

    try {
      const conversationHistory = buildConversationHistory();
      const response = await getChatResponse({
        budget: chatState.userProfile.budget || '100元以下',
        preferences: preferences,
        conversationHistory
      });

      // Convert menu recommendations to MenuItem format
      const menuItems: MenuItem[] = (response.recommendations || []).map((rec: MenuRecommendation, index: number) => ({
        id: rec.id,
        name: rec.name,
        description: rec.reason,
        price: parseInt(rec.price.replace(/[^\d]/g, '')),
        image: '/dishes/default.jpg',
        category: rec.category,
        ingredients: [],
        recommendations: rec.reason
      }));

      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.message,
        menuItems: menuItems,
        component: 'menu-recommendations'
      });
      setChatState(prev => ({ ...prev, currentStep: 'recommendations' }));
    } catch (error) {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，推荐系统遇到了问题。让我为您推荐一些热门菜品：',
        menuItems: mockDishes,
        component: 'menu-recommendations'
      });
      setChatState(prev => ({ ...prev, currentStep: 'recommendations' }));
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    if (chatState.currentStep === 'preferences') {
      handlePreferencesInput();
      return;
    }

    const userMessage = inputValue;
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: userMessage
    });

    setInputValue('');

    // Get AI response
    setIsTyping(true);
    try {
      const aiResponse = await getAIResponse(userMessage);
      setIsTyping(false);
      
      // Convert recommendations to MenuItem format if they exist
      let menuItems: MenuItem[] | undefined;
      if (aiResponse.recommendations) {
        menuItems = convertRecommendationsToMenuItems(aiResponse.recommendations);
      }
      
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.message,
        menuItems: menuItems,
        component: menuItems ? 'menu-recommendations' : undefined
      });
    } catch (error) {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，我现在无法回答您的问题。请稍后重试。'
      });
    }
  };

  const getAIResponse = async (userInput: string): Promise<{
    message: string;
    recommendations?: MenuRecommendation[];
  }> => {
    try {
      const conversationHistory = buildConversationHistory();
      const response = await getGeneralChatResponse(userInput, conversationHistory);
      return response;
    } catch (error) {
      return {
        message: '我理解你的意思！还有什么想了解的可以继续问我哦～ 或者你可以点击菜品卡片查看更多详情 😊'
      };
    }
  };

  const handleAddToCart = (dish: MenuItem) => {
    setChatState(prev => {
      const existingItem = prev.cart.find(item => item.id === dish.id);
      const newCart = existingItem
        ? prev.cart.map(item => 
            item.id === dish.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev.cart, { ...dish, quantity: 1 }];
      
      return { ...prev, cart: newCart };
    });

    addMessage({
      id: Date.now().toString(),
      type: 'system',
      content: `${dish.name} 已添加到购物车`
    });
  };

  const handleViewDetails = (dish: MenuItem) => {
    setChatState(prev => ({
      ...prev,
      selectedDish: dish,
      sidePanelOpen: true
    }));
  };

  const handleAskQuestion = async (question: string) => {
    // Keep the side panel open when asking questions
    
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: question
    });

    setIsTyping(true);
    try {
      const aiResponse = await getAIResponse(question);
      setIsTyping(false);
      
      // Convert recommendations to MenuItem format if they exist
      let menuItems: MenuItem[] | undefined;
      if (aiResponse.recommendations) {
        menuItems = convertRecommendationsToMenuItems(aiResponse.recommendations);
      }
      
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.message,
        menuItems: menuItems,
        component: menuItems ? 'menu-recommendations' : undefined
      });
    } catch (error) {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，我现在无法回答您的问题。请稍后重试。'
      });
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setChatState(prev => ({
      ...prev,
      cart: quantity === 0 
        ? prev.cart.filter(item => item.id !== itemId)
        : prev.cart.map(item => 
            item.id === itemId ? { ...item, quantity } : item
          )
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setChatState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.id !== itemId)
    }));
  };

  const handleClearCart = () => {
    setChatState(prev => ({ ...prev, cart: [] }));
  };

  const handleCheckout = () => {
    addMessage({
      id: Date.now().toString(),
      type: 'ai',
      content: '太棒了！你的菜单已经准备好了，马上就可以下单了 🎉 祝你用餐愉快！'
    });
  };

  const clearConversationHistory = () => {
    if (confirm('确定要清除所有聊天记录和购物车吗？此操作无法撤销。')) {
      localStorage.removeItem('orderly-chat-state');
      setChatState({
        messages: [],
        currentStep: 'welcome',
        userProfile: {},
        cart: [],
        selectedDish: null,
        sidePanelOpen: false,
      });
      setShowWelcome(true);
    }
  };

  const handleOpenCart = () => {
    setCartDialogOpen(true);
  };

  // 获取菜品在购物车中的数量
  const getDishQuantity = (dishId: string): number => {
    const cartItem = chatState.cart.find(item => item.id === dishId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="flex h-screen bg-[#FFFBF5]">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-[#DDDDDD] px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-[#333333]">AI 点菜助手</h1>
            {!showWelcome && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearConversationHistory}
                className="text-gray-600 hover:text-gray-800"
                title="清除聊天记录"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                清除记录
              </Button>
            )}
          </div>
        </div>

        {/* Chat Messages - Now properly constrained */}
        <div className="flex-1 min-h-0 flex flex-col">
          <ScrollArea className="flex-1 px-4 py-4 h-full overflow-hidden" ref={scrollAreaRef}>
            <div className="max-w-2xl mx-auto space-y-4">
              {showWelcome ? (
                <WelcomeScreen onStartChat={startChat} />
              ) : (
                <>
                  {chatState.messages.map((message, index) => (
                    <div key={message.id} className="animate-fade-in">
                      <MessageBubble message={message} isUser={message.type === 'user'} />
                      
                      {/* Render interactive components */}
                      {message.component === 'options-selector' && message.options && (
                        <OptionsSelector
                          options={message.options}
                          onSelect={handleOptionSelection}
                        />
                      )}
                      
                      {message.component === 'menu-recommendations' && message.menuItems && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {message.menuItems.map(dish => (
                            <DishCard
                              key={dish.id}
                              dish={dish}
                              quantity={getDishQuantity(dish.id)}
                              onAddToCart={handleAddToCart}
                              onUpdateQuantity={handleUpdateQuantity}
                              onViewDetails={handleViewDetails}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </ScrollArea>

          {/* Shopping Cart Bar - Fixed position */}
          <div className="flex-shrink-0">
            <ShoppingCartBar
              items={chatState.cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
              onOpenCart={handleOpenCart}
            />
          </div>

          {/* Input Area - Fixed at bottom */}
          {!showWelcome && (
            <div className="bg-white border-t border-[#DDDDDD] p-4 flex-shrink-0">
              <div className="max-w-2xl mx-auto flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="输入你的问题或偏好..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#FF6B2D] hover:bg-[#FF6B2D]/90"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dish Details Side Panel */}
      <DishDetailsPanel
        dish={chatState.selectedDish}
        isOpen={chatState.sidePanelOpen}
        onClose={() => setChatState(prev => ({ ...prev, sidePanelOpen: false, selectedDish: null }))}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onAskQuestion={handleAskQuestion}
        onViewDetails={handleViewDetails}
        quantity={chatState.selectedDish ? getDishQuantity(chatState.selectedDish.id) : 0}
      />

      {/* Cart Dialog */}
      <CartDialog
        isOpen={cartDialogOpen}
        onClose={() => setCartDialogOpen(false)}
        items={chatState.cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}