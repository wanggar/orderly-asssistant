'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { DishCard } from './dish-card';
import { OptionsSelector } from './options-selector';
import { CartDialog } from '@/components/cart/cart-dialog';
import { Send, RotateCcw, ShoppingCart } from 'lucide-react';
import { MenuItem, CartItem } from '@/types';

// StrictMode 下首次挂载会触发两次 effect，这里用 sessionStorage 作为一次性保护
const WELCOME_SHOWN_KEY = 'welcome-shown-v1';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  recommendedDishes?: MenuItem[];
  options?: string[];
  onOptionSelect?: (option: string) => void;
}

// 对话状态
type ConversationStep = 'welcome' | 'people_count' | 'dining_scenario' | 'chatting';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [conversationStep, setConversationStep] = useState<ConversationStep>('welcome');
  const [peopleCount, setPeopleCount] = useState<string>('');
  const [diningScenario, setDiningScenario] = useState<string>('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 人数选项
  const peopleOptions = ['1人', '2人', '3-4人', '5-6人', '7人以上'];
  
  // 根据人数获取对应的就餐场景选项
  const getScenarioOptions = (peopleCount: string) => {
    switch (peopleCount) {
      case '1人':
        return [
          '工作日午餐',
          '下班犒劳自己', 
          '深夜觅食',
          '周末独享'
        ];
      case '2人':
        return [
          '情侣约会',
          '朋友叙旧',
          '同事聚餐'
        ];
      case '3-4人':
        return [
          '朋友聚会',
          '小型家庭聚餐',
          '室友聚餐'
        ];
      case '5-6人':
        return [
          '周末家庭聚餐',
          '朋友聚会',
          '庆祝聚餐'
        ];
      case '7人以上':
        return [
          '大家庭聚餐',
          '朋友大聚会',
          '特殊庆祝'
        ];
      default:
        return ['朋友聚会'];
    }
  };



  // Load messages from localStorage on mount and rehydrate option handlers
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    const savedStep = localStorage.getItem('conversation-step');
    const savedPeopleCount = localStorage.getItem('people-count');
    const savedDiningScenario = localStorage.getItem('dining-scenario');
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const restored = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));

        // 回填 options 的点击处理函数（localStorage 不保存函数）
        for (let i = restored.length - 1; i >= 0; i--) {
          const msg = restored[i];
          if (msg.type === 'ai' && Array.isArray(msg.options) && !msg.onOptionSelect) {
            const step = (savedStep as ConversationStep) || 'people_count';
            if (step === 'people_count') {
              msg.onOptionSelect = handlePeopleCountSelect;
            } else if (step === 'dining_scenario') {
              msg.onOptionSelect = handleScenarioSelect;
            }
            break;
          }
        }

        setMessages(restored);
      } catch (error) {
        console.error('Error loading messages from localStorage:', error);
      }
    }
    
    if (savedStep) {
      setConversationStep(savedStep as ConversationStep);
    }
    if (savedPeopleCount) {
      setPeopleCount(savedPeopleCount);
    }
    if (savedDiningScenario) {
      setDiningScenario(savedDiningScenario);
    }
  }, []);

  // Save conversation state to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
    localStorage.setItem('conversation-step', conversationStep);
    localStorage.setItem('people-count', peopleCount);
    localStorage.setItem('dining-scenario', diningScenario);
  }, [messages, conversationStep, peopleCount, diningScenario]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const addMessage = (message: Omit<Message, 'timestamp'>) => {
    setMessages(prev => [...prev, { ...message, timestamp: new Date() }]);
  };

  // 处理场景选择
  const handleScenarioSelect = useCallback((scenario: string) => {
    setDiningScenario(scenario);
    addMessage({
      id: 'user-scenario-' + Date.now(),
      type: 'user',
      content: scenario
    });

    setIsTyping(true);
    setConversationStep('chatting');

    // 发送到API获取基于场景的推荐
    setTimeout(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `我们是${peopleCount}，${scenario}，请为我们推荐合适的菜品`,
            conversationHistory: [],
            peopleCount,
            diningScenario: scenario,
            isInitialRecommendation: true
          }),
        });

        const data = await response.json();
        
        setIsTyping(false);
        addMessage({
          id: 'recommendation-' + Date.now(),
          type: 'ai',
          content: data.message,
          recommendedDishes: data.recommendedDishes
        });
      } catch (error) {
        setIsTyping(false);
        addMessage({
          id: 'error-' + Date.now(),
          type: 'ai',
          content: '小熊暂时有点忙，请稍后再试试哦~ 🐻'
        });
      }
    }, 1000);
  }, [peopleCount]);

  // 处理人数选择
  const handlePeopleCountSelect = useCallback((count: string) => {
    setPeopleCount(count);
    addMessage({
      id: 'user-people-' + Date.now(),
      type: 'user',
      content: count
    });

    setTimeout(() => {
      const scenarioOptions = getScenarioOptions(count);
      addMessage({
        id: 'scenario-' + Date.now(),
        type: 'ai',
        content: `好的，${count}用餐！🍽️ 请问今天是什么场合呢？我会根据不同的就餐场景为您推荐最合适的菜品组合哦~`,
        options: scenarioOptions,
        onOptionSelect: handleScenarioSelect
      });
      setConversationStep('dining_scenario');
    }, 800);
  }, [handleScenarioSelect]);

  // 显示欢迎消息（防止重复）
  const showWelcomeMessage = useCallback(() => {
    const alreadyAskPeople = messages.some(m => m.type === 'ai' && Array.isArray(m.options));
    if (alreadyAskPeople) return;

    addMessage({
      id: 'welcome-' + Date.now(),
      type: 'ai',
      content: '你好呀！欢迎来到小满熊汉堡！🐻✨ 我是店里的可爱小熊，很高兴为您服务~ 请问今天有几位用餐呢？',
      options: peopleOptions,
      onOptionSelect: handlePeopleCountSelect
    });
    setConversationStep('people_count');
  }, [messages, peopleOptions, handlePeopleCountSelect]);

  // Initialize welcome message once (StrictMode safe)
  useEffect(() => {
    const alreadyInserted = typeof window !== 'undefined'
      ? sessionStorage.getItem(WELCOME_SHOWN_KEY)
      : '1';

    if (!alreadyInserted && messages.length === 0 && conversationStep === 'welcome') {
      sessionStorage.setItem(WELCOME_SHOWN_KEY, '1');
      setTimeout(() => {
        showWelcomeMessage();
      }, 300);
    }
  }, [showWelcomeMessage, messages.length, conversationStep]);



  // Helper function to build conversation history for API calls
  const buildConversationHistory = () => {
    return messages
      .filter(msg => msg.type === 'user' || msg.type === 'ai')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
  };

  // Cart management functions
  const addToCart = (dish: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === dish.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const updateCartQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== dishId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === dishId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getCartQuantity = (dishId: string) => {
    return cart.find(item => item.id === dishId)?.quantity || 0;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: userMessage
    });

    setInputValue('');
    setIsTyping(true);

    try {
      const conversationHistory = buildConversationHistory();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
          peopleCount,
          diningScenario
        }),
      });

      const data = await response.json();
      
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.message,
        recommendedDishes: data.recommendedDishes
      });
    } catch (error) {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '小熊暂时有点忙，请稍后再试试哦~ 🐻'
      });
    }
  };

  const clearConversationHistory = () => {
    if (confirm('确定要重新开始和小熊的对话吗？')) {
      localStorage.removeItem('chat-messages');
      localStorage.removeItem('conversation-step');
      localStorage.removeItem('people-count');
      localStorage.removeItem('dining-scenario');
      // 清除一次性欢迎消息的插入标志
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(WELCOME_SHOWN_KEY);
      }
      setMessages([]);
      setConversationStep('welcome');
      setPeopleCount('');
      setDiningScenario('');
      setTimeout(() => {
        showWelcomeMessage();
      }, 500);
    }
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-screen bg-[#FFFBF5]">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-[#DDDDDD] px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🐻</div>
              <div>
                <h1 className="text-lg font-semibold text-[#333333]">小满熊汉堡</h1>
                <p className="text-xs text-gray-500">
                  {peopleCount && diningScenario 
                    ? `${peopleCount} · ${diningScenario}` 
                    : '可爱小熊为您服务'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCartOpen(true)}
                  className="relative"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  购物车
                  {totalCartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FF6B2D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalCartItems}
                    </span>
                  )}
                </Button>
              )}
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearConversationHistory}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  重新开始
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 flex flex-col">
          <ScrollArea className="flex-1 px-4 py-4 h-full overflow-hidden" ref={scrollAreaRef}>
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <div className="text-6xl mb-4">🐻</div>
                  <h2 className="text-xl font-semibold mb-2">欢迎来到小满熊汉堡！</h2>
                  <p className="text-gray-400">我是店里的小熊，很高兴为您推荐美味的中式料理~</p>
                  <p className="text-sm text-gray-400 mt-2">正在准备为您服务...</p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div key={message.id} className="animate-fade-in space-y-3">
                      <MessageBubble message={message} isUser={message.type === 'user'} />
                      
                      {/* Render options selector for AI messages with options */}
                      {message.type === 'ai' && message.options && message.onOptionSelect && (
                        <div className="flex justify-start">
                          <div className="max-w-[75%]">
                            <OptionsSelector
                              options={message.options}
                              onSelect={message.onOptionSelect}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Render dish cards if AI recommended dishes */}
                      {message.type === 'ai' && message.recommendedDishes && message.recommendedDishes.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                          {message.recommendedDishes.map((dish) => (
                            <DishCard
                              key={dish.id}
                              dish={dish}
                              quantity={getCartQuantity(dish.id)}
                              onAddToCart={addToCart}
                              onUpdateQuantity={updateCartQuantity}
                              onViewDetails={(dish) => {
                                console.log('View details for:', dish.name);
                              }}
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

          {/* Input Area */}
          <div className="bg-white border-t border-[#DDDDDD] p-4 flex-shrink-0">
            <div className="max-w-2xl mx-auto flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  conversationStep === 'chatting' 
                    ? "和小熊说说您想吃什么..." 
                    : "小熊正在等待您的选择..."
                }
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
                disabled={isTyping || conversationStep !== 'chatting'}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-[#FF6B2D] hover:bg-[#FF6B2D]/90"
                size="icon"
                disabled={isTyping || conversationStep !== 'chatting'}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Dialog */}
      <CartDialog
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={(itemId) => updateCartQuantity(itemId, 0)}
        onClearCart={() => setCart([])}
        onCheckout={() => {
          console.log('Checkout with items:', cart);
        }}
      />
    </div>
  );
}