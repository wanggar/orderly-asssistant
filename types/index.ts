// Core types for the AI ordering assistant

export interface UserProfile {
  budget?: string;
  preferences?: string[];
  restrictions?: string[];
  mood?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spicyLevel?: number;
  ingredients: string[];
  recommendations?: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  options?: string[];
  menuItems?: MenuItem[];
  component?: 'menu-recommendations' | 'options-selector' | 'dish-details';
}

export interface ChatState {
  messages: Message[];
  currentStep: 'welcome' | 'people-count' | 'preferences' | 'recommendations' | 'chat' | 'confirmation';
  userProfile: UserProfile;
  cart: CartItem[];
  selectedDish?: MenuItem;
  sidePanelOpen: boolean;
}