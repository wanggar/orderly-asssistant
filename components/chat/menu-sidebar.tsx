'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight, Plus, Minus, Menu, X, ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { MenuItem } from '@/types';
import menuData from '@/data/menu.json';

interface MenuSidebarProps {
  onAddToCart: (dish: MenuItem) => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  getCartQuantity: (dishId: string) => number;
  onViewDetails: (dish: MenuItem) => void;
  isOpen: boolean;
  onToggle: () => void;
  navigationDish?: MenuItem | null;
}

const spicyLevelColors = {
  0: 'bg-green-50 text-green-700 border-green-200',
  1: 'bg-orange-50 text-orange-700 border-orange-200', 
  2: 'bg-red-50 text-red-700 border-red-200'
};

const spicyLevelText = {
  0: '不辣',
  1: '微辣',
  2: '中辣'
};

export function MenuSidebar({ onAddToCart, onUpdateQuantity, getCartQuantity, onViewDetails: _, isOpen, onToggle, navigationDish }: MenuSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['热菜', '主食']));
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);

  // No auto-close behavior - let users manually control the menu

  // Handle external navigation to dish details
  useEffect(() => {
    if (navigationDish) {
      setSelectedDish(navigationDish);
      setIsDetailView(true);
    }
  }, [navigationDish]);

  const handleDishClick = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsDetailView(true);
  };

  const handleBackToMenu = () => {
    setIsDetailView(false);
    setSelectedDish(null);
  };

  const handleAskQuestion = (question: string) => {
    // 这里可以调用父组件的函数来处理问题
    console.log('Ask question:', question);
    // 如果需要，可以添加一个prop来处理问题
  };

  // Group dishes by category
  const categorizedMenu = menuData.reduce((acc, dish) => {
    const category = dish.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(dish);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Define category order for better display
  const categoryOrder = ['热菜', '小炒', '主食', '汉堡', '牛排', '沙拉', '披萨', '意面', '小食', '蒸菜', '配菜', '汤品', '饮品', '甜品', '加价升级'];
  
  const sortedCategories = categoryOrder.filter(cat => categorizedMenu[cat]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const formatPrice = (price: number) => `¥${price.toFixed(1)}`;

  if (!isOpen) {
    return (
      <div className="fixed left-4 top-24 z-40">
        <Button
          onClick={onToggle}
          className="bg-gradient-to-r from-[#FF6B2D] to-[#FF8533] hover:from-[#FF6B2D]/90 hover:to-[#FF8533]/90 text-white shadow-2xl hover:shadow-[#FF6B2D]/50 rounded-full px-5 py-3 font-bold transition-all duration-300 hover:scale-105"
          size="sm"
        >
          <Menu className="w-4 h-4 mr-2" />
          🍽️ 菜单
        </Button>
      </div>
    );
  }

  // 详情视图的渲染函数
  const renderDetailView = () => {
    if (!selectedDish) return null;

    const spicyLevelText = selectedDish.spicyLevel 
      ? selectedDish.spicyLevel === 1 ? "微辣 🌶️" 
      : selectedDish.spicyLevel === 2 ? "中辣 🌶️🌶️" 
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

    const nutritionInfo = [
      { label: "热量", value: "约 350 kcal" },
      { label: "蛋白质", value: "18g" },
      { label: "脂肪", value: "12g" },
      { label: "碳水化合物", value: "35g" }
    ];

    const quantity = getCartQuantity(selectedDish.id);

    return (
      <div className="h-full flex flex-col">
        {/* Header with back button */}
        <div className="p-4 border-b border-[#FFE5CC] bg-gradient-to-r from-[#FF6B2D]/5 to-[#FF6B2D]/10 flex items-center gap-3 rounded-t-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToMenu}
            className="h-8 w-8 p-0 hover:bg-[#FF6B2D]/10"
          >
            <ArrowLeft className="h-4 w-4 text-[#FF6B2D]" />
          </Button>
          <div>
            <h2 className="font-bold text-[#FF6B2D] text-lg">{selectedDish.name}</h2>
            <p className="text-xs text-[#8B4513] opacity-80">菜品详情</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Dish Image */}
            <div className="w-full h-32 bg-[#FFF5EB] rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`/menu_photos/${selectedDish.id}.jpeg`}
                alt={selectedDish.name}
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
                <div className="text-4xl">🍽️</div>
              </div>
            </div>
            
            {/* Price and Basic Info */}
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-[#FF6B2D]">{formatPrice(selectedDish.price)}</span>
              <div className="flex gap-1">
                <Badge variant="secondary" className="text-xs">{selectedDish.category}</Badge>
                <Badge variant="secondary" className="text-xs bg-red-50 text-red-600">
                  {spicyLevelText}
                </Badge>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="font-medium mb-2 text-[#333333] text-sm">菜品描述</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{selectedDish.description}</p>
            </div>
            
            {/* Ingredients */}
            <div>
              <h3 className="font-medium mb-2 text-[#333333] text-sm">主要食材</h3>
              <div className="flex flex-wrap gap-1">
                {selectedDish.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Nutrition Info */}
            <div>
              <h3 className="font-medium mb-2 text-[#333333] text-sm">营养信息</h3>
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

            {/* Reviews */}
            {selectedDish.reviews && selectedDish.reviews.length > 0 && (
              <div>
                <h3 className="font-medium mb-2 text-[#333333] text-sm">用户评价</h3>
                <div className="space-y-2">
                  {selectedDish.reviews.map((review) => (
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
              <h3 className="font-medium mb-2 text-[#333333] text-sm">快速提问</h3>
              <div className="grid grid-cols-1 gap-1">
                {commonQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAskQuestion(question)}
                    className="text-xs h-7 text-left justify-start"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Bottom Button */}
        <div className="p-4 border-t border-[#FFE5CC] bg-[#FFFBF5]">
          {quantity === 0 ? (
            <Button
              onClick={() => onAddToCart(selectedDish)}
              className="w-full bg-[#FF6B2D] hover:bg-[#FF6B2D]/90 font-medium text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              加入购物车 - {formatPrice(selectedDish.price)}
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Button
                  onClick={() => onUpdateQuantity(selectedDish.id, Math.max(0, quantity - 1))}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
                  variant="outline"
                  size="sm"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-sm font-bold text-[#FF6B2D]">{quantity}</div>
                  <div className="text-xs text-gray-500">已选择</div>
                </div>
                <Button
                  onClick={() => onUpdateQuantity(selectedDish.id, quantity + 1)}
                  className="w-8 h-8 bg-[#FF6B2D] hover:bg-[#FF6B2D]/90 text-white text-sm"
                  size="sm"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">小计</div>
                <div className="text-sm font-bold text-[#FF6B2D]">{formatPrice(selectedDish.price * quantity)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Sidebar */}
      <div className="h-[calc(100%-200px)] fixed left-4 top-20 bottom-4 w-80 bg-gradient-to-b from-[#FFFBF5] to-[#FFF8F0] rounded-xl border border-[#FFE5CC] shadow-2xl z-40 transform transition-all duration-300 ease-in-out backdrop-blur-sm">
        {isDetailView ? renderDetailView() : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-[#FFE5CC] bg-gradient-to-r from-[#FF6B2D]/5 to-[#FF6B2D]/10 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🍽️</div>
                <div>
                  <h2 className="font-bold text-[#FF6B2D] text-lg">美味菜单</h2>
                  <p className="text-xs text-[#8B4513] opacity-80">精选美食等你来</p>
                </div>
              </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover:bg-[#FF6B2D]/10 text-[#FF6B2D]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Menu Content */}
        <ScrollArea className="h-[calc(100%-80px)]">
          <div className="p-4 space-y-3">
            {sortedCategories.map((category) => {
              const dishes = categorizedMenu[category];
              const isExpanded = expandedCategories.has(category);
              
              return (
                <div key={category} className="space-y-2">
                  {/* Category Header */}
                  <Button
                    variant="ghost"
                    onClick={() => toggleCategory(category)}
                    className="w-full justify-between p-3 h-auto text-left font-medium hover:bg-gradient-to-r hover:from-[#FF6B2D]/10 hover:to-[#FF6B2D]/5 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#D2691E] font-bold text-sm">{category}</span>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-[#FF6B2D]/15 text-[#FF6B2D] border-[#FF6B2D]/20"
                      >
                        {dishes.length}道
                      </Badge>
                    </div>
                    {isExpanded ? 
                      <ChevronDown className="w-4 h-4 text-[#FF6B2D]" /> : 
                      <ChevronRight className="w-4 h-4 text-[#FF6B2D]" />
                    }
                  </Button>

                  {/* Dishes List */}
                  {isExpanded && (
                    <div className="space-y-2 ml-2">
                      {dishes.map((dish) => {
                        const quantity = getCartQuantity(dish.id);
                        
                        return (
                          <Card 
                            key={dish.id} 
                            className="hover:shadow-lg hover:shadow-[#FF6B2D]/20 transition-all duration-200 border-[#FFE5CC] bg-gradient-to-br from-white to-[#FFFBF5] hover:scale-[1.02] cursor-pointer"
                            onClick={() => handleDishClick(dish)}
                          >
                            <CardContent className="p-3">
                              <div className="space-y-2">
                                {/* Dish Name and Price */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-[#8B4513] leading-tight">
                                      {dish.name}
                                    </h3>
                                    <p className="text-xs text-[#A0522D]/80 mt-1 line-clamp-2">
                                      {dish.description}
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="text-lg font-bold text-[#FF6B2D] bg-[#FF6B2D]/10 px-2 py-1 rounded-md">
                                      {formatPrice(dish.price)}
                                    </div>
                                  </div>
                                </div>

                                {/* Tags and Controls */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    {dish.spicyLevel && dish.spicyLevel > 0 && (
                                      <Badge 
                                        className={`text-xs border ${spicyLevelColors[dish.spicyLevel as keyof typeof spicyLevelColors]}`}
                                      >
                                        🌶️ {spicyLevelText[dish.spicyLevel as keyof typeof spicyLevelText]}
                                      </Badge>
                                    )}
                                    {/* <Badge 
                                      variant="outline" 
                                      className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                                    >
                                      ⚡ {dish.nutrition && dish.nutrition.calories}卡
                                    </Badge> */}
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-1">
                                    {quantity > 0 ? (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateQuantity(dish.id, quantity - 1);
                                          }}
                                          className="w-6 h-6 p-0 border-[#FF6B2D]/30 text-[#FF6B2D] hover:bg-[#FF6B2D]/10"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="w-6 text-center text-sm font-bold text-[#FF6B2D] bg-[#FF6B2D]/10 rounded px-1">
                                          {quantity}
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateQuantity(dish.id, quantity + 1);
                                          }}
                                          className="w-6 h-6 p-0 border-[#FF6B2D]/30 text-[#FF6B2D] hover:bg-[#FF6B2D]/10"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onAddToCart(dish);
                                        }}
                                        className="bg-gradient-to-r from-[#FF6B2D] to-[#FF8533] hover:from-[#FF6B2D]/90 hover:to-[#FF8533]/90 text-white h-6 px-3 text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        加入
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
          </>
        )}
      </div>
    </>
  );
}