'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

interface ShoppingCartBarProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export function ShoppingCartBar({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckout 
}: ShoppingCartBarProps) {
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#FF6B2D]/90 backdrop-blur-sm border-t border-orange-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4 text-white" />
            <Badge className="bg-white text-[#FF6B2D] font-semibold">
              {totalItems}
            </Badge>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1 text-white text-xs whitespace-nowrap"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center gap-1 ml-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40"
                    >
                      <Minus className="w-2 h-2" />
                    </button>
                    <span className="w-4 text-center text-xs font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40"
                    >
                      <Plus className="w-2 h-2" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center hover:bg-red-400 ml-1"
                    >
                      <Trash2 className="w-2 h-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-white font-semibold">
            ¥{totalPrice.toFixed(2)}
          </div>
          <Button
            onClick={onCheckout}
            className="bg-white text-[#FF6B2D] hover:bg-gray-100 font-medium"
            size="sm"
          >
            去结算
          </Button>
        </div>
      </div>
    </div>
  );
}