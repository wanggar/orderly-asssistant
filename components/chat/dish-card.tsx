'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/types";
import { ShoppingCart, Info } from "lucide-react";

interface DishCardProps {
  dish: MenuItem;
  onAddToCart: (dish: MenuItem) => void;
  onViewDetails: (dish: MenuItem) => void;
}

export function DishCard({ dish, onAddToCart, onViewDetails }: DishCardProps) {
  const spicyLevelText = dish.spicyLevel 
    ? dish.spicyLevel === 1 ? "微辣" 
    : dish.spicyLevel === 2 ? "中辣" 
    : "重辣"
    : "";

  return (
    <Card className="mb-4 border-none shadow-sm bg-white/50 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Dish Image */}
          <div className="w-20 h-20 bg-[#FFF5EB] rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="text-2xl">🍽️</div>
          </div>
          
          {/* Dish Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-[#333333] text-base">{dish.name}</h3>
              <span className="text-[#FF6B2D] font-semibold text-lg">¥{dish.price}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dish.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {spicyLevelText && (
                  <Badge variant="secondary" className="text-xs bg-red-50 text-red-600">
                    {spicyLevelText}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {dish.category}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(dish)}
                  className="h-8 px-3 text-xs"
                >
                  <Info className="w-3 h-3 mr-1" />
                  详情
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAddToCart(dish)}
                  className="h-8 px-3 text-xs bg-[#FF6B2D] hover:bg-[#FF6B2D]/90"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  加入
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {dish.recommendations && (
          <div className="mt-3 p-2 bg-[#FFF5EB] rounded-lg">
            <p className="text-xs text-gray-600">💡 {dish.recommendations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}