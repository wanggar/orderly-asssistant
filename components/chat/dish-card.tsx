'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/types";
import { ShoppingCart, Info, Plus, Minus } from "lucide-react";

interface DishCardProps {
  dish: MenuItem;
  quantity: number;
  onAddToCart: (dish: MenuItem) => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onViewDetails: (dish: MenuItem) => void;
}

export function DishCard({ dish, quantity, onAddToCart, onUpdateQuantity, onViewDetails }: DishCardProps) {
  const spicyLevelText = dish.spicyLevel 
    ? dish.spicyLevel === 1 ? "微辣" 
    : dish.spicyLevel === 2 ? "中辣" 
    : "重辣"
    : "";

  const handleAddToCart = () => {
    onAddToCart(dish);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    onUpdateQuantity(dish.id, Math.max(0, newQuantity));
  };

  return (
    <Card className="border-none shadow-sm bg-white/50 hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        {/* Dish Image */}
        <div className="w-full h-30 bg-[#FFF5EB] rounded-lg overflow-hidden mb-3">
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
            <div className="text-xl">🍽️</div>
          </div>
        </div>
        
        {/* Dish Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-[#333333] text-sm leading-tight">{dish.name}</h3>
            <span className="text-[#FF6B2D] font-semibold text-sm">¥{dish.price}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {spicyLevelText && (
              <Badge variant="secondary" className="text-xs bg-red-50 text-red-600 px-2 py-0">
                {spicyLevelText}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {dish.category}
            </Badge>
          </div>
          
          <div className="flex gap-1 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(dish)}
              className="h-7 px-2 text-xs flex-1"
            >
              <Info className="w-3 h-3 mr-1" />
              详情
            </Button>
            
            {/* 数量选择器 */}
            {quantity === 0 ? (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="h-7 px-2 text-xs flex-1 bg-[#FF6B2D] hover:bg-[#FF6B2D]/90"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                加入
              </Button>
            ) : (
              <div className="flex items-center gap-1 flex-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                  className="h-7 w-7 px-0 text-xs"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-sm font-medium text-[#FF6B2D]">{quantity}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                  className="h-7 w-7 px-0 text-xs bg-[#FF6B2D] hover:bg-[#FF6B2D]/90"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {dish.recommendations && (
          <div className="mt-2 p-2 bg-[#FFF5EB] rounded-lg">
            <p className="text-xs text-gray-600">💡 {dish.recommendations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}