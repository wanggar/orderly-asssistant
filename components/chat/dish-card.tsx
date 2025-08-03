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
    <Card className="border-none shadow-sm bg-white/50 hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        {/* Dish Image */}
        <div className="w-full h-16 bg-[#FFF5EB] rounded-lg flex items-center justify-center mb-3">
          <div className="text-xl">🍽️</div>
        </div>
        
        {/* Dish Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-[#333333] text-sm leading-tight">{dish.name}</h3>
            <span className="text-[#FF6B2D] font-semibold text-sm">¥{dish.price}</span>
          </div>
          
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{dish.description}</p>
          
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
            <Button
              size="sm"
              onClick={() => onAddToCart(dish)}
              className="h-7 px-2 text-xs flex-1 bg-[#FF6B2D] hover:bg-[#FF6B2D]/90"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              加入
            </Button>
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