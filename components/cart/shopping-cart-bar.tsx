'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types";
import { ShoppingCart } from "lucide-react";

interface ShoppingCartBarProps {
  items: CartItem[];
  onCheckout: () => void;
  onOpenCart: () => void;
}

export function ShoppingCartBar({ 
  items, 
  onCheckout,
  onOpenCart
}: ShoppingCartBarProps) {
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#FF6B2D]/90 backdrop-blur-sm border-t border-orange-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* 购物车图标和数量 */}
        <button 
          onClick={onOpenCart}
          className="flex items-center gap-3 hover:bg-white/10 rounded-lg p-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-white" />
              <Badge className="absolute -top-2 -right-2 bg-white text-[#FF6B2D] font-semibold text-xs min-w-[18px] h-[18px] flex items-center justify-center">
                {totalItems}
              </Badge>
            </div>
            <div className="text-white">
              <div className="text-sm font-medium">购物车</div>
              <div className="text-xs opacity-80">{totalItems}件商品</div>
            </div>
          </div>
        </button>
        
        {/* 总价和结算按钮 */}
        <div className="flex items-center gap-3">
          <div className="text-white text-right">
            <div className="text-xs opacity-80">合计</div>
            <div className="text-lg font-bold">¥{totalPrice.toFixed(2)}</div>
          </div>
          <Button
            onClick={onCheckout}
            className="bg-white text-[#FF6B2D] hover:bg-gray-100 font-medium px-6"
            size="lg"
          >
            去结算
          </Button>
        </div>
      </div>
    </div>
  );
}