'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/types";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface CartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export function CartDialog({ 
  isOpen,
  onClose,
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckout 
}: CartDialogProps) {
  const { t } = useLanguage();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5 text-[#FF6B2D]" />
            {t('cart.title')}
            <Badge className="bg-[#FF6B2D] text-white text-xs">
              {totalItems}{t('cart.items')}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t('cart.empty')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('cart.emptyHint')}</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-80 overflow-y-auto">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {/* 菜品图片 */}
                    <div className="w-12 h-12 bg-[#FFF5EB] rounded-lg overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`/menu_photos/${item.id}.jpeg`}
                        alt={item.name}
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
                    
                    {/* 菜品信息 */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[#FF6B2D] font-semibold text-sm">¥{item.price}</span>
                        <div className="flex items-center gap-2">
                          {/* 数量控制 */}
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          {/* 删除按钮 */}
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors ml-2"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* 底部操作区域 */}
            <div className="border-t pt-4">
              {/* 总价 */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">{t('cart.total')}</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#FF6B2D]">¥{totalPrice.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{totalItems}{t('cart.itemCount')}</div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClearCart}
                  className="flex-1 text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  {t('cart.clear')}
                </Button>
                <Button
                  onClick={() => {
                    onCheckout();
                    onClose();
                  }}
                  className="flex-1 bg-[#FF6B2D] hover:bg-[#FF6B2D]/90 text-white"
                >
                  {t('cart.checkout')} (¥{totalPrice.toFixed(2)})
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 