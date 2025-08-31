'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MenuItem } from "@/types";
import { ShoppingCart, Star, X, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DishDetailsPanelProps {
  dish: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: MenuItem) => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onAskQuestion: (question: string) => void;
  onViewDetails: (dish: MenuItem) => void;
  quantity: number;
}

export function DishDetailsPanel({ 
  dish, 
  isOpen, 
  onClose, 
  onAddToCart,
  onUpdateQuantity,
  onAskQuestion,
  onViewDetails,
  quantity
}: DishDetailsPanelProps) {

  const spicyLevelText = dish?.spicyLevel 
    ? dish.spicyLevel === 1 ? "微辣 🌶️" 
    : dish.spicyLevel === 2 ? "中辣 🌶️🌶️" 
    : "重辣 🌶️🌶️🌶️"
    : "不辣";

  const commonQuestions = [
    "这道菜辣不辣？",
    "适合女生吃吗？", 
    "这个菜油腻吗？",
    "有什么特色？",
    "配什么饮料好？",
    "适合几个人吃？"
  ];

  // 营养信息示例
  const nutritionInfo = [
    { label: "热量", value: "约 350 kcal" },
    { label: "蛋白质", value: "18g" },
    { label: "脂肪", value: "12g" },
    { label: "碳水化合物", value: "35g" }
  ];

  return (
    <div className={cn(
      "bg-[#FFFBF5] border-l border-[#DDDDDD] flex flex-col h-full transition-all duration-300 ease-in-out relative",
      isOpen ? "w-80" : "w-0 overflow-hidden"
    )}>
      {/* Fixed Header */}
      {isOpen && (
        <div className="flex items-center justify-between p-4 border-b border-[#DDDDDD] bg-[#FFFBF5] relative z-10">
          <h2 className="text-lg font-semibold text-[#333333]">
            {dish ? dish.name : "菜品详情"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Scrollable Content */}
      {isOpen && dish && (
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6 pb-8">
            {/* Dish Image */}
            <div className="w-full h-48 bg-[#FFF5EB] rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`/menu_photos/${dish.id}.jpeg`}
                alt={dish.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallbackDiv) {
                    fallbackDiv.style.display = 'flex';
                  }
                }}
              />
              <div className="w-full h-full bg-[#FFF5EB] rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                <div className="text-6xl">🍽️</div>
              </div>
            </div>
            
            {/* Price and Basic Info */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#FF6B2D]">¥{dish.price}</span>
              <div className="flex gap-2">
                <Badge variant="secondary">{dish.category}</Badge>
                <Badge variant="secondary" className="bg-red-50 text-red-600">
                  {spicyLevelText}
                </Badge>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="font-medium mb-2 text-[#333333]">菜品描述</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{dish.description}</p>
            </div>
            
            {/* Ingredients */}
            <div>
              <h3 className="font-medium mb-2 text-[#333333]">主要食材</h3>
              <div className="flex flex-wrap gap-1">
                {dish.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Nutrition Info */}
            <div>
              <h3 className="font-medium mb-2 text-[#333333]">营养信息</h3>
              <div className="bg-white rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2">
                  {nutritionInfo.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-xs text-gray-600">{item.label}:</span>
                      <span className="text-xs font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            
            {/* Mock Reviews */}
            {dish.reviews && dish.reviews.length > 0 && (
              <div>
                <h3 className="font-medium mb-2 text-[#333333]">用户评价</h3>
                <div className="space-y-2">
                  {dish.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{review.author}</span>
                      </div>
                      <p className="text-xs text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Pairings */}
            <div>
              <h3 className="font-medium mb-2 text-[#333333]">推荐菜品搭配</h3>
              <div className="space-y-2">
                <div 
                  className="bg-white p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onViewDetails({
                    id: 'rec-1',
                    name: '红烧肉',
                    description: '经典家常菜，口感香甜，肥而不腻，色泽红亮',
                    price: 38,
                    image: '🥘',
                    category: '热菜',
                    spicyLevel: 0,
                    ingredients: ['五花肉', '冰糖', '生抽', '老抽', '料酒', '八角'],
                    recommendations: '建议搭配米饭食用，口感更佳',
                    reviews: [{
                      id: '1',
                      rating: 5,
                      comment: '传统做法，味道正宗，肉质软烂',
                      author: '美食爱好者'
                    }]
                  })}
                >
                  <div className="w-12 h-12 bg-[#FFF5EB] rounded-lg flex items-center justify-center">
                    <div className="text-lg">🥘</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">红烧肉</p>
                    <p className="text-xs text-gray-500">经典家常菜，口感香甜</p>
                  </div>
                  <span className="text-sm font-semibold text-[#FF6B2D]">¥38</span>
                </div>
                <div 
                  className="bg-white p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onViewDetails({
                    id: 'rec-2',
                    name: '糖醋排骨',
                    description: '酸甜可口，老少皆宜，色泽红亮，口感嫩滑',
                    price: 42,
                    image: '🍖',
                    category: '热菜',
                    spicyLevel: 0,
                    ingredients: ['排骨', '番茄酱', '白糖', '醋', '生抽', '料酒'],
                    recommendations: '适合作为宴席菜品，老少皆宜',
                    reviews: [{
                      id: '2',
                      rating: 5,
                      comment: '酸甜适中，排骨软烂，小朋友很喜欢',
                      author: '家庭主妇'
                    }]
                  })}
                >
                  <div className="w-12 h-12 bg-[#FFF5EB] rounded-lg flex items-center justify-center">
                    <div className="text-lg">🍖</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">糖醋排骨</p>
                    <p className="text-xs text-gray-500">酸甜可口，老少皆宜</p>
                  </div>
                  <span className="text-sm font-semibold text-[#FF6B2D]">¥42</span>
                </div>
              </div>
            </div>
            
            {/* Quick Questions */}
            <div>
              <h3 className="font-medium mb-2 text-[#333333]">快速提问</h3>
              <div className="grid grid-cols-1 gap-2">
                {commonQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onAskQuestion(question)}
                    className="text-xs h-8 text-left justify-start"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      )}

      {/* Fixed Bottom Button */}
      {isOpen && dish && (
        <div className="p-4 border-t border-[#DDDDDD] bg-[#FFFBF5]">
          {quantity === 0 ? (
            <Button
              onClick={() => onAddToCart(dish)}
              className="w-full bg-[#FF6B2D] hover:bg-[#FF6B2D]/90 font-medium"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              加入购物车 - ¥{dish.price}
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              {/* 数量选择器 */}
              <div className="flex items-center gap-3 flex-1">
                <Button
                  onClick={() => onUpdateQuantity(dish.id, Math.max(0, quantity - 1))}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  variant="outline"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-lg font-bold text-[#FF6B2D]">{quantity}</div>
                  <div className="text-xs text-gray-500">已选择</div>
                </div>
                <Button
                  onClick={() => onUpdateQuantity(dish.id, quantity + 1)}
                  className="w-12 h-12 bg-[#FF6B2D] hover:bg-[#FF6B2D]/90 text-white"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              
              {/* 总价显示 */}
              <div className="text-right">
                <div className="text-xs text-gray-500">小计</div>
                <div className="text-lg font-bold text-[#FF6B2D]">¥{(dish.price * quantity).toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}