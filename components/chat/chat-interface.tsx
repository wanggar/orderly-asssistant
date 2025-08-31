'use client';

import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { DishCard } from './dish-card';
import { MenuSidebar } from './menu-sidebar';
import { WelcomeScreen } from './welcome-screen';
import { OptionChips } from './option-chips';
import { CartDialog } from '@/components/cart/cart-dialog';

import { Send, RotateCcw, ShoppingCart } from 'lucide-react';
import { MenuItem, CartItem } from '@/types';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  recommendedDishes?: MenuItem[];
  optionPicks?: {
    chipName: string;
    userMessage: string;
  }[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuSidebarOpen, setMenuSidebarOpen] = useState(true);
  const [navigationDish, setNavigationDish] = useState<MenuItem | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastCartMessageTime = useRef<number>(0);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages.map((msg: Omit<Message, 'timestamp'> & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (_error) {
        console.error('Error loading messages from localStorage:', _error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

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

  // Helper function to build conversation history for API calls
  const buildConversationHistory = () => {
    return messages
      .filter(msg => msg.type === 'user' || msg.type === 'ai')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
  };

  // Helper function to send cart update message to AI
  const sendCartUpdateMessage = async (dish: MenuItem, action: 'added' | 'increased', newQuantity: number) => {
    // Debounce: prevent sending too many messages in quick succession
    const now = Date.now();
    if (now - lastCartMessageTime.current < 2000) { // 2 second debounce
      return;
    }
    lastCartMessageTime.current = now;

    const message = action === 'added' 
      ? `把${dish.name}加入购物车。`
      : `把${dish.name}的数量增加到${newQuantity}份。`;
    
    // Create user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };
    
    // Add user message
    addMessage(userMessage);

    setIsTyping(true);

    try {
      // Build conversation history including the new message
      const conversationHistory = [
        ...buildConversationHistory(),
        { role: 'user' as const, content: message }
      ];
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory
        }),
      });

      const data = await response.json();
      
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.message,
        recommendedDishes: data.recommendedDishes,
        optionPicks: data.optionPicks
      });
    } catch (_error) {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '小熊暂时有点忙，请稍后再试试哦~ 🐻'
      });
    }
  };

  // Cart management functions
  const addToCart = (dish: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === dish.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        // Send message about quantity increase
        sendCartUpdateMessage(dish, 'increased', newQuantity);
        return prev.map(item =>
          item.id === dish.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Send message about adding new item
        sendCartUpdateMessage(dish, 'added', 1);
        return [...prev, { ...dish, quantity: 1 }];
      }
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

  const handleNavigateToMenuDetails = (dish: MenuItem) => {
    // 确保菜单侧边栏打开
    if (!menuSidebarOpen) {
      setMenuSidebarOpen(true);
    }
    
    // 设置导航菜品并清空之前的导航状态
    setNavigationDish(null);
    setTimeout(() => {
      setNavigationDish(dish);
    }, 100);
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
          conversationHistory
        }),
      });

      const data = await response.json();
      
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.message,
        recommendedDishes: data.recommendedDishes,
        optionPicks: data.optionPicks
      });
    } catch (_error) {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '小熊暂时有点忙，请稍后再试试哦~ 🐻'
      });
    }
  };

  const clearConversationHistory = () => {
    if (confirm('确定要清空和小熊的聊天记录吗？购物车内容也会一并清空哦~')) {
      localStorage.removeItem('chat-messages');
      setMessages([]);
      setCart([]); // 同时清空购物车
    }
  };

  const handlePeopleCountSelect = async (count: number) => {
    const message = count >= 5 ? `${count}人以上用餐。` : `${count}人用餐。`;
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: message
    });

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: []
        }),
      });

      const data = await response.json();
      
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.message,
        recommendedDishes: data.recommendedDishes,
        optionPicks: data.optionPicks
      });
    } catch (_error) {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '小熊暂时有点忙，请稍后再试试哦~ 🐻'
      });
    }
  };

  const handleOptionSelect = async (userMessage: string) => {
    // Add user message
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
          conversationHistory
        }),
      });

      const data = await response.json();
      
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.message,
        recommendedDishes: data.recommendedDishes,
        optionPicks: data.optionPicks
      });
    } catch (_error) {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '小熊暂时有点忙，请稍后再试试哦~ 🐻'
      });
    }
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-screen bg-[#FFFBF5]">
      {/* Chat Interface - Always full width */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-[#DDDDDD] px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🐻</div>
              <div>
                <h1 className="text-lg font-semibold text-[#333333]">小满熊汉堡</h1>
                <p className="text-xs text-gray-500">可爱小熊为您服务</p>
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
                  清空记录
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
                <WelcomeScreen 
                  onStartChat={() => {}} 
                  onSelectPeopleCount={handlePeopleCountSelect}
                />
              ) : (
                <>
                  {messages.map((message) => (
                    <div key={message.id} className="animate-fade-in space-y-3">
                      <MessageBubble message={message} isUser={message.type === 'user'} />
                      
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
                              onViewDetails={handleNavigateToMenuDetails}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* Render option chips if AI provided options */}
                      {message.type === 'ai' && message.optionPicks && message.optionPicks.length > 0 && (
                        <OptionChips
                          options={message.optionPicks}
                          onSelect={handleOptionSelect}
                        />
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
                placeholder="和小熊说说您想吃什么..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-[#FF6B2D] hover:bg-[#FF6B2D]/90"
                size="icon"
                disabled={isTyping}
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

      {/* Menu Sidebar - Floating overlay */}
      <MenuSidebar
        onAddToCart={addToCart}
        onUpdateQuantity={updateCartQuantity}
        getCartQuantity={getCartQuantity}
        onViewDetails={() => {}}
        isOpen={menuSidebarOpen}
        onToggle={() => setMenuSidebarOpen(!menuSidebarOpen)}
        navigationDish={navigationDish}
      />


    </div>
  );
}