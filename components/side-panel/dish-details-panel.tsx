'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MenuItem } from "@/types";
import { ShoppingCart, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DishDetailsPanelProps {
  dish: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: MenuItem) => void;
  onAskQuestion: (question: string) => void;
}

export function DishDetailsPanel({ 
  dish, 
  isOpen, 
  onClose, 
  onAddToCart,
  onAskQuestion 
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
    "有什么特色？"
  ];

  return (
    <div className={cn(
      "bg-[#FFFBF5] border-l border-[#DDDDDD] flex flex-col h-full transition-all duration-300 ease-in-out",
      isOpen ? "w-80" : "w-0 overflow-hidden"
    )}>
      {/* Header */}
      {isOpen && (
        <div className="flex items-center justify-between p-4 border-b border-[#DDDDDD]">
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

      {/* Content */}
      {isOpen && dish && (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
          {/* Dish Image */}
          <div className="w-full h-48 bg-[#FFF5EB] rounded-lg flex items-center justify-center">
            <div className="text-6xl">🍽️</div>
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
          
          {/* Mock Reviews */}
          {dish.reviews && dish.reviews.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 text-[#333333]">用户评价</h3>
              <div className="space-y-2">
                {dish.reviews.slice(0, 2).map((review) => (
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
          
          {/* Quick Questions */}
          <div>
            <h3 className="font-medium mb-2 text-[#333333]">快速提问</h3>
            <div className="grid grid-cols-2 gap-2">
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
          
            {/* Add to Cart Button */}
            <Button
              onClick={() => onAddToCart(dish)}
              className="w-full bg-[#FF6B2D] hover:bg-[#FF6B2D]/90 font-medium"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              加入购物车 - ¥{dish.price}
            </Button>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}