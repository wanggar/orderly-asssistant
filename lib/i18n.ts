export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // Header
    'header.title': '小满熊汉堡',
    'header.subtitle': '可爱小熊为您服务',
    'header.cart': '购物车',
    'header.clearHistory': '清空记录',
    
    // Welcome Screen
    'welcome.title': '🐻 小满熊点菜助手',
    'welcome.subtitle': '让点菜变得简单有趣',
    'welcome.peopleCount': '请问有几位用餐呢？',
    'welcome.people': '人',
    'welcome.peoplePlus': '人+',
    'welcome.hint': '选择人数后，小熊会为您推荐最合适的菜品组合～',
    
    // Chat Interface
    'chat.inputPlaceholder': '和小熊说说您想吃什么...',
    'chat.typingBear': '小熊正在输入...',
    'chat.thinking': '小熊正在想...',
    
    // Cart Dialog
    'cart.title': '购物车',
    'cart.items': '件',
    'cart.empty': '购物车是空的',
    'cart.emptyHint': '快去选择你喜欢的菜品吧！',
    'cart.total': '总计：',
    'cart.itemCount': '件商品',
    'cart.clear': '清空购物车',
    'cart.checkout': '去结算',
    'cart.confirmClear': '确定要清空和小熊的聊天记录吗？购物车内容也会一并清空哦~',
    
    // Dish Card
    'dish.addToCart': '加入购物车',
    'dish.viewDetails': '查看详情',
    'dish.spicyLevel': '辣度',
    'dish.calories': '卡路里',
    
    // Menu Sidebar
    'menu.title': '完整菜单',
    'menu.header': '美味菜单',
    'menu.subtitle': '精选美食等你来',
    'menu.dishCount': '道',
    'menu.searchPlaceholder': '搜索菜品...',
    'menu.allCategories': '全部分类',
    'menu.close': '收起菜单',
    'menu.add': '加入',
    'menu.details': '详情',
    'menu.selected': '已选择',
    'menu.subtotal': '小计',
    'menu.quickQuestions': '快速提问',
    
    // Dish Details Panel
    'details.title': '菜品详情',
    'details.description': '菜品描述',
    'details.price': '价格',
    'details.category': '分类',
    'details.spicyLevel': '辣度',
    'details.ingredients': '主要食材',
    'details.nutrition': '营养信息',
    'details.calories': '卡路里',
    'details.protein': '蛋白质',
    'details.carbs': '碳水化合物',
    'details.fat': '脂肪',
    'details.addToCart': '加入购物车',
    'details.reviews': '用户评价',
    'details.recommendedPairings': '推荐菜品搭配',
    'details.quickQuestions': '快速提问',
    'details.selected': '已选择',
    'details.subtotal': '小计',
    
    // Spicy Levels
    'spicy.0': '不辣',
    'spicy.1': '微辣',
    'spicy.2': '中辣',
    
    // Categories (will be overridden by menu translations)
    'category.热菜': '热菜',
    'category.小炒': '小炒',
    'category.蒸菜': '蒸菜',
    'category.配菜': '配菜',
    'category.汤品': '汤品',
    'category.主食': '主食',
    'category.汉堡': '汉堡',
    'category.饮品': '饮品',
    'category.小食': '小食',
    'category.甜品': '甜品',
    'category.加价升级': '加价升级',
    'category.牛排': '牛排',
    'category.沙拉': '沙拉',
    'category.披萨': '披萨',
    'category.意面': '意面',
    
    // Language
    'lang.chinese': '中文',
    'lang.english': 'English',
    
    // AI Messages
    'ai.busy': '小熊暂时有点忙，请稍后再试试哦~ 🐻',
    'ai.confused': '小熊有点懵了，可以再说一遍吗？🤔',
    'ai.error': '小熊暂时有点忙，请稍后再来找我哦~ 🐻💕',
    
    // Quick Questions
    'question.isSpicy': '这道菜辣不辣？',
    'question.forWomen': '适合女生吃吗？',
    'question.isOily': '这个菜油腻吗？',
    'question.specialty': '有什么特色？',
    'question.pairing': '配什么饮料好？',
    'question.servings': '适合几个人吃？',
  },
  en: {
    // Header
    'header.title': 'XiaoMan Bear Burger',
    'header.subtitle': 'Cute Bear at Your Service',
    'header.cart': 'Cart',
    'header.clearHistory': 'Clear History',
    
    // Welcome Screen
    'welcome.title': '🐻 XiaoMan Bear Ordering Assistant',
    'welcome.subtitle': 'Making Ordering Simple and Fun',
    'welcome.peopleCount': 'How many people are dining?',
    'welcome.people': '',
    'welcome.peoplePlus': '+',
    'welcome.hint': 'After selecting the number of people, the Bear will recommend the most suitable dishes for you~',
    
    // Chat Interface
    'chat.inputPlaceholder': 'Tell the Bear what you want to eat...',
    'chat.typingBear': 'Bear is typing...',
    'chat.thinking': 'Bear is thinking...',
    
    // Cart Dialog
    'cart.title': 'Shopping Cart',
    'cart.items': 'items',
    'cart.empty': 'Your cart is empty',
    'cart.emptyHint': 'Go pick your favorite dishes!',
    'cart.total': 'Total:',
    'cart.itemCount': 'items',
    'cart.clear': 'Clear Cart',
    'cart.checkout': 'Checkout',
    'cart.confirmClear': 'Are you sure you want to clear the chat history? The cart will also be cleared~',
    
    // Dish Card
    'dish.addToCart': 'Add to Cart',
    'dish.viewDetails': 'View Details',
    'dish.spicyLevel': 'Spicy',
    'dish.calories': 'Calories',
    
    // Menu Sidebar
    'menu.title': 'Full Menu',
    'menu.header': 'Delicious Menu',
    'menu.subtitle': 'Discover our curated dishes',
    'menu.dishCount': 'dishes',
    'menu.searchPlaceholder': 'Search dishes...',
    'menu.allCategories': 'All Categories',
    'menu.close': 'Close Menu',
    'menu.add': 'Add',
    'menu.details': 'Details',
    'menu.selected': 'Selected',
    'menu.subtotal': 'Subtotal',
    'menu.quickQuestions': 'Quick Questions',
    
    // Dish Details Panel
    'details.title': 'Dish Details',
    'details.description': 'Description',
    'details.price': 'Price',
    'details.category': 'Category',
    'details.spicyLevel': 'Spicy Level',
    'details.ingredients': 'Main Ingredients',
    'details.nutrition': 'Nutrition Info',
    'details.calories': 'Calories',
    'details.protein': 'Protein',
    'details.carbs': 'Carbs',
    'details.fat': 'Fat',
    'details.addToCart': 'Add to Cart',
    'details.reviews': 'Customer Reviews',
    'details.recommendedPairings': 'Recommended Pairings',
    'details.quickQuestions': 'Quick Questions',
    'details.selected': 'Selected',
    'details.subtotal': 'Subtotal',
    
    // Spicy Levels
    'spicy.0': 'Not Spicy',
    'spicy.1': 'Mild',
    'spicy.2': 'Medium Spicy',
    
    // Categories
    'category.热菜': 'Hot Dishes',
    'category.小炒': 'Stir-Fry',
    'category.蒸菜': 'Steamed Dishes',
    'category.配菜': 'Side Dishes',
    'category.汤品': 'Soups',
    'category.主食': 'Staples',
    'category.汉堡': 'Burgers',
    'category.饮品': 'Beverages',
    'category.小食': 'Snacks',
    'category.甜品': 'Desserts',
    'category.加价升级': 'Upgrades',
    'category.牛排': 'Steaks',
    'category.沙拉': 'Salads',
    'category.披萨': 'Pizza',
    'category.意面': 'Pasta',
    
    // Language
    'lang.chinese': '中文',
    'lang.english': 'English',
    
    // AI Messages
    'ai.busy': 'The Bear is a bit busy, please try again later~ 🐻',
    'ai.confused': 'The Bear is a bit confused, could you say that again? 🤔',
    'ai.error': 'The Bear is temporarily busy, please come back later~ 🐻💕',
    
    // Quick Questions
    'question.isSpicy': 'Is this dish spicy?',
    'question.forWomen': 'Is this suitable for women?',
    'question.isOily': 'Is this dish oily?',
    'question.specialty': 'What makes it special?',
    'question.pairing': 'What drinks go well with it?',
    'question.servings': 'How many people is it suitable for?',
  }
} as const;

export type TranslationKey = keyof typeof translations.zh;

