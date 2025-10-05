import { Language } from './i18n';
import { MenuItem } from '@/types';
import menuZh from '@/data/menu.zh.json';

// English menu with translations
const menuEn: MenuItem[] = [
  {
    id: "hongshaorou-quail-eggs",
    name: "Braised Pork with Quail Eggs",
    price: 19.9,
    description: "Slow-braised pork belly with quail eggs, rich in savory-sweet sauce.",
    category: "Hot Dishes",
    spicyLevel: 0,
    ingredients: ["Pork belly", "Quail eggs", "Light soy sauce", "Dark soy sauce", "Rock sugar", "Scallion, ginger, garlic"],
    nutrition: { calories: 520, carbs: 20, protein: 25, fat: 35 }
  },
  {
    id: "angus-beef",
    name: "Angus Beef",
    price: 19.9,
    description: "Tender Angus beef in flavorful broth, mildly spicy.",
    category: "Hot Dishes",
    spicyLevel: 1,
    ingredients: ["Angus beef slices", "Bell peppers", "Ginger & garlic", "Broth", "Sauce"],
    nutrition: { calories: 360, carbs: 8, protein: 24, fat: 24 }
  },
  {
    id: "stirfried-yellow-beef",
    name: "Stir-Fried Yellow Beef",
    price: 19.9,
    description: "Hunan-style quick-fried beef with garlic sprouts and chili.",
    category: "Stir-Fry",
    spicyLevel: 2,
    ingredients: ["Yellow beef", "Green chili", "Millet pepper", "Garlic sprouts", "Soy sauce"],
    nutrition: { calories: 410, carbs: 10, protein: 30, fat: 26 }
  },
  {
    id: "lajiao-chaorou",
    name: "Chili Fried Pork",
    price: 12.9,
    description: "Home-style Hunan dish with peppers and pork belly.",
    category: "Stir-Fry",
    spicyLevel: 2,
    ingredients: ["Pork belly", "Green chili", "Millet pepper", "Garlic", "Soy sauce"],
    nutrition: { calories: 380, carbs: 12, protein: 20, fat: 26 }
  },
  {
    id: "jintang-suancaiyu",
    name: "Golden Broth Pickled Fish",
    price: 14.9,
    description: "Tender fish in tangy golden broth, mildly spicy and numbing.",
    category: "Hot Dishes",
    spicyLevel: 1,
    ingredients: ["Grass carp", "Pickled cabbage", "Golden broth", "Sichuan peppercorn", "Millet pepper"],
    nutrition: { calories: 320, carbs: 9, protein: 28, fat: 18 }
  },
  {
    id: "meicai-kourou",
    name: "Steamed Pork with Preserved Vegetables",
    price: 12.9,
    description: "Hakka-style dish with preserved vegetables and pork belly.",
    category: "Hot Dishes",
    spicyLevel: 0,
    ingredients: ["Pork belly", "Preserved vegetables", "Light soy sauce", "Dark soy sauce", "Rock sugar"],
    nutrition: { calories: 560, carbs: 16, protein: 22, fat: 44 }
  },
  {
    id: "salted-egg-yolk-lionhead",
    name: "Salted Egg Yolk Lion's Head Meatball",
    price: 9.9,
    description: "Large meatball with salted egg yolk, steamed and braised.",
    category: "Hot Dishes",
    spicyLevel: 0,
    ingredients: ["Ground pork", "Salted egg yolk", "Scallion & ginger", "Starch", "Broth"],
    nutrition: { calories: 380, carbs: 14, protein: 22, fat: 26 }
  },
  {
    id: "steamed-minced-pork-egg",
    name: "Steamed Egg with Minced Pork",
    price: 9.9,
    description: "Home-style steamed dish with meat and silky eggs.",
    category: "Steamed Dishes",
    spicyLevel: 0,
    ingredients: ["Ground pork", "Eggs", "Soy sauce", "Scallion-ginger water"],
    nutrition: { calories: 230, carbs: 4, protein: 20, fat: 15 }
  },
  {
    id: "old-tofu-braised-pork",
    name: "Braised Tofu with Pork",
    price: 6.9,
    description: "Firm tofu braised with pork belly, mildly spicy.",
    category: "Hot Dishes",
    spicyLevel: 1,
    ingredients: ["Firm tofu", "Pork belly", "Bean paste", "Bell peppers", "Scallion, ginger, garlic"],
    nutrition: { calories: 300, carbs: 10, protein: 18, fat: 20 }
  },
  {
    id: "mala-tofu",
    name: "Spicy Mapo Tofu",
    price: 2.9,
    description: "Small portion Sichuan-style tofu with numbing spice.",
    category: "Side Dishes",
    spicyLevel: 2,
    ingredients: ["Soft tofu", "Bean paste", "Sichuan peppercorn", "Millet pepper", "Minced garlic"],
    nutrition: { calories: 150, carbs: 8, protein: 12, fat: 7 }
  },
  {
    id: "gongbao-chicken",
    name: "Kung Pao Chicken",
    price: 8.8,
    description: "Classic Sichuan dish with tender chicken and crispy peanuts.",
    category: "Stir-Fry",
    spicyLevel: 2,
    ingredients: ["Chicken breast", "Peanuts", "Dried chili", "Bell peppers", "Scallion, ginger, garlic"],
    nutrition: { calories: 380, carbs: 18, protein: 28, fat: 20 }
  },
  {
    id: "tomato-egg-stirfry",
    name: "Tomato & Egg Stir-Fry",
    price: 6.9,
    description: "Classic home-style dish with sweet-tart tomatoes and eggs.",
    category: "Stir-Fry",
    spicyLevel: 0,
    ingredients: ["Tomatoes", "Eggs", "Scallion", "Sugar", "Salt"],
    nutrition: { calories: 220, carbs: 10, protein: 12, fat: 14 }
  },
  {
    id: "suancai-duck-blood",
    name: "Pickled Cabbage with Duck Blood",
    price: 6.9,
    description: "Tangy and fresh small hot dish with tender duck blood.",
    category: "Hot Dishes",
    spicyLevel: 1,
    ingredients: ["Duck blood", "Pickled cabbage", "Broth", "Millet pepper", "Garlic sprouts"],
    nutrition: { calories: 160, carbs: 5, protein: 16, fat: 8 }
  },
  {
    id: "vinegar-cabbage",
    name: "Sweet & Sour Cabbage",
    price: 2.9,
    description: "Refreshing and crispy vegetable side dish.",
    category: "Side Dishes",
    spicyLevel: 0,
    ingredients: ["Napa cabbage", "Rice vinegar", "Sugar", "Minced garlic", "A pinch of dried chili"],
    nutrition: { calories: 90, carbs: 12, protein: 2, fat: 3 }
  },
  {
    id: "steamed-egg",
    name: "Silky Steamed Egg",
    price: 3.9,
    description: "Smooth steamed egg custard, light and delicate.",
    category: "Steamed Dishes",
    spicyLevel: 0,
    ingredients: ["Eggs", "Water/broth", "Salt", "Scallion"],
    nutrition: { calories: 140, carbs: 2, protein: 12, fat: 9 }
  },
  {
    id: "tomato-egg-soup",
    name: "Tomato & Egg Soup",
    price: 1.9,
    description: "Refreshing home-style soup, sweet and tart.",
    category: "Soups",
    spicyLevel: 0,
    ingredients: ["Tomatoes", "Eggs", "Broth/water", "Scallion"],
    nutrition: { calories: 60, carbs: 6, protein: 3, fat: 2 }
  },
  {
    id: "rice",
    name: "Steamed Rice",
    price: 2.0,
    description: "Freshly steamed white rice, about 150g per bowl.",
    category: "Staples",
    spicyLevel: 0,
    ingredients: ["Rice", "Water"],
    nutrition: { calories: 230, carbs: 50, protein: 4, fat: 0.5 }
  },
  {
    id: "liangpi",
    name: "Cold Wheat Noodles (Liangpi)",
    price: 9.0,
    description: "Shaanxi-style cold noodles with chili oil and vinegar.",
    category: "Staples",
    spicyLevel: 1,
    ingredients: ["Wheat noodles", "Cucumber", "Bean sprouts", "Chili oil", "Vinegar", "Garlic water", "Sesame"],
    nutrition: { calories: 420, carbs: 65, protein: 8, fat: 12 }
  },
  {
    id: "secret-liangpi",
    name: "Secret Recipe Cold Noodles",
    price: 11.0,
    description: "Signature cold noodles with extra chili oil and garlic.",
    category: "Staples",
    spicyLevel: 1,
    ingredients: ["Wheat noodles", "Cucumber", "Bean sprouts", "Secret chili oil", "Garlic paste", "Vinegar", "Sesame paste"],
    nutrition: { calories: 460, carbs: 66, protein: 9, fat: 15 }
  },
  {
    id: "suancai-rice-noodles",
    name: "Pickled Cabbage Rice Noodles",
    price: 12.0,
    description: "Tangy soup rice noodles with pickled cabbage.",
    category: "Staples",
    spicyLevel: 1,
    ingredients: ["Rice noodles", "Pickled cabbage", "Broth", "Millet pepper", "Wood ear", "Scallion & cilantro"],
    nutrition: { calories: 380, carbs: 60, protein: 10, fat: 8 }
  },
  {
    id: "sanxian-rice-noodles",
    name: "Three-Delicacy Rice Noodles",
    price: 12.0,
    description: "Fresh broth with shrimp, fish balls, and vegetables.",
    category: "Staples",
    spicyLevel: 0,
    ingredients: ["Rice noodles", "Shrimp", "Fish balls", "Tomato", "Wood ear", "Greens", "Chicken broth"],
    nutrition: { calories: 360, carbs: 55, protein: 16, fat: 8 }
  },
  {
    id: "mala-rice-noodles",
    name: "Spicy Mala Rice Noodles",
    price: 12.0,
    description: "Red spicy broth with Sichuan peppercorn and chili.",
    category: "Staples",
    spicyLevel: 2,
    ingredients: ["Rice noodles", "Spicy red broth", "Bean paste", "Sichuan peppercorn", "Dried chili", "Scallion & cilantro"],
    nutrition: { calories: 430, carbs: 58, protein: 12, fat: 14 }
  },
  {
    id: "tomato-fatty-beef-rice-noodles",
    name: "Tomato Beef Rice Noodles",
    price: 25.0,
    description: "Rich tomato broth with tender beef slices.",
    category: "Staples",
    spicyLevel: 0,
    ingredients: ["Rice noodles", "Beef slices", "Tomato", "Tomato sauce", "Onion", "Greens", "Chicken broth"],
    nutrition: { calories: 520, carbs: 56, protein: 22, fat: 18 }
  },
  {
    id: "roujiang-banfan",
    name: "Mixed Noodles with Meat Sauce",
    price: 9.0,
    description: "Hot mixed noodles with savory meat sauce and peanuts.",
    category: "Staples",
    spicyLevel: 1,
    ingredients: ["Rice noodles", "Meat sauce", "Crushed peanuts", "Scallion", "Cilantro", "Chili oil"],
    nutrition: { calories: 410, carbs: 62, protein: 14, fat: 12 }
  },
  {
    id: "sesame-liangpi",
    name: "Sesame Sauce Cold Noodles",
    price: 11.0,
    description: "Cold noodles mixed with sesame paste, rich and smooth.",
    category: "Staples",
    spicyLevel: 0,
    ingredients: ["Wheat noodles", "Cucumber", "Sesame paste", "Garlic water", "Soy sauce & vinegar"],
    nutrition: { calories: 480, carbs: 64, protein: 12, fat: 18 }
  },
  {
    id: "braised-diced-chicken-rice-noodles",
    name: "Braised Chicken Rice Noodles",
    price: 15.0,
    description: "Braised chicken with savory broth rice noodles.",
    category: "Staples",
    spicyLevel: 1,
    ingredients: ["Rice noodles", "Chicken breast", "Braised broth", "Wood ear", "Greens", "Cilantro"],
    nutrition: { calories: 470, carbs: 56, protein: 22, fat: 16 }
  },
  {
    id: "vine-pepper-beef-rice-noodles",
    name: "Green Peppercorn Beef Rice Noodles",
    price: 25.0,
    description: "Fragrant green peppercorn broth with tender beef.",
    category: "Staples",
    spicyLevel: 2,
    ingredients: ["Rice noodles", "Beef slices", "Green peppercorn oil", "Green Sichuan pepper", "Millet pepper", "Greens"],
    nutrition: { calories: 540, carbs: 54, protein: 24, fat: 20 }
  },
  {
    id: "mipi",
    name: "Cold Rice Noodles (Mipi)",
    price: 7.0,
    description: "Steamed rice noodles with chili oil, soft and springy.",
    category: "Staples",
    spicyLevel: 1,
    ingredients: ["Rice noodles", "Cucumber", "Chili oil", "Garlic water", "Vinegar"],
    nutrition: { calories: 360, carbs: 60, protein: 6, fat: 8 }
  },
  {
    id: "furong-banfan",
    name: "Light Mixed Noodles",
    price: 7.0,
    description: "Refreshing mixed noodles with vegetables, mild flavor.",
    category: "Staples",
    spicyLevel: 0,
    ingredients: ["Rice noodles", "Cilantro", "Carrot", "Cucumber", "Soy & vinegar", "Optional chili oil"],
    nutrition: { calories: 320, carbs: 52, protein: 8, fat: 7 }
  },
  {
    id: "classic-bear-burger",
    name: "XiaoMan Bear Classic Burger",
    price: 25.0,
    description: "Classic American beef and cheese burger with lettuce and pickles.",
    category: "Burgers",
    spicyLevel: 0,
    ingredients: ["Burger bun", "Beef patty", "Cheddar cheese", "Lettuce", "Tomato", "Onion", "Pickles", "Ketchup", "Mayo"],
    nutrition: { calories: 620, carbs: 45, protein: 32, fat: 32 }
  },
  {
    id: "angus-beef-burger",
    name: "Angus Beef Burger",
    price: 15.0,
    description: "Angus beef patty with cheese and lettuce, tender and juicy.",
    category: "Burgers",
    spicyLevel: 0,
    ingredients: ["Burger bun", "Angus beef patty", "Cheese", "Lettuce", "Onion", "Ketchup"],
    nutrition: { calories: 560, carbs: 40, protein: 30, fat: 28 }
  },
  {
    id: "truffle-beef-burger",
    name: "Truffle Beef Burger",
    price: 25.0,
    description: "Beef burger with truffle sauce, rich and aromatic.",
    category: "Burgers",
    spicyLevel: 0,
    ingredients: ["Burger bun", "Beef patty", "Black truffle sauce", "Cheese", "Lettuce", "Tomato"],
    nutrition: { calories: 640, carbs: 44, protein: 33, fat: 34 }
  },
  {
    id: "pineapple-shrimp-burger",
    name: "Pineapple Shrimp Burger",
    price: 15.0,
    description: "Crispy shrimp patty with grilled pineapple, sweet and tangy.",
    category: "Burgers",
    spicyLevel: 0,
    ingredients: ["Burger bun", "Fried shrimp patty", "Pineapple", "Lettuce", "Mayo"],
    nutrition: { calories: 520, carbs: 48, protein: 22, fat: 24 }
  },
  {
    id: "pineapple-beef-burger",
    name: "Pineapple Beef Burger",
    price: 25.0,
    description: "Beef patty with grilled pineapple and cheese, sweet-savory balance.",
    category: "Burgers",
    spicyLevel: 0,
    ingredients: ["Burger bun", "Beef patty", "Pineapple", "Cheese", "Lettuce", "Mayo"],
    nutrition: { calories: 610, carbs: 46, protein: 30, fat: 30 }
  },
  {
    id: "original-fried-chicken-burger",
    name: "Classic Fried Chicken Burger",
    price: 15.0,
    description: "Crispy fried chicken with pickles and lettuce.",
    category: "Burgers",
    spicyLevel: 0,
    ingredients: ["Burger bun", "Fried chicken", "Lettuce", "Tomato", "Pickles", "Mayo"],
    nutrition: { calories: 590, carbs: 49, protein: 26, fat: 28 }
  },
  {
    id: "fresh-corn-juice",
    name: "Fresh Corn Juice",
    price: 4.0,
    description: "Sweet fresh corn blended into smooth juice.",
    category: "Beverages",
    spicyLevel: 0,
    ingredients: ["Sweet corn", "Milk/water", "A bit of sugar"],
    nutrition: { calories: 160, carbs: 30, protein: 4, fat: 3 }
  },
  {
    id: "peanut-walnut-drink",
    name: "Peanut Walnut Drink",
    price: 6.0,
    description: "Ground peanuts and walnuts blended, rich and creamy.",
    category: "Beverages",
    spicyLevel: 0,
    ingredients: ["Peanuts", "Walnuts", "Milk/water", "Sugar"],
    nutrition: { calories: 220, carbs: 18, protein: 6, fat: 14 }
  },
  {
    id: "yam-red-date-drink",
    name: "Yam & Red Date Drink",
    price: 7.0,
    description: "Smooth yam with sweet red dates, nourishing.",
    category: "Beverages",
    spicyLevel: 0,
    ingredients: ["Yam", "Red dates", "Milk/water", "Rock sugar"],
    nutrition: { calories: 180, carbs: 35, protein: 3, fat: 2 }
  },
  {
    id: "yangzhiganlu",
    name: "Mango Pomelo Sago",
    price: 9.9,
    description: "Classic Hong Kong-style dessert drink with mango, pomelo, and sago.",
    category: "Beverages",
    spicyLevel: 0,
    ingredients: ["Mango", "Pomelo", "Sago", "Coconut milk", "Sugar"],
    nutrition: { calories: 230, carbs: 42, protein: 3, fat: 6 }
  },
  {
    id: "pear-lemon-tea",
    name: "Pear Lemon Tea",
    price: 9.9,
    description: "Sweet pear with refreshing lemon, iced and crisp.",
    category: "Beverages",
    spicyLevel: 0,
    ingredients: ["Pear", "Lemon", "Black tea", "Sugar"],
    nutrition: { calories: 110, carbs: 27, protein: 0, fat: 0 }
  },
  {
    id: "kumquat-passion",
    name: "Kumquat Passion Fruit",
    price: 9.9,
    description: "Kumquat and passion fruit blend, sweet-tart and refreshing.",
    category: "Beverages",
    spicyLevel: 0,
    ingredients: ["Kumquat", "Passion fruit", "Ice water", "Sugar"],
    nutrition: { calories: 120, carbs: 28, protein: 1, fat: 0 }
  },
  {
    id: "cola",
    name: "Cola",
    price: 6.0,
    description: "Iced carbonated drink.",
    category: "Beverages",
    spicyLevel: 0,
    ingredients: ["Carbonated water", "Sugar", "Caramel color"],
    nutrition: { calories: 140, carbs: 35, protein: 0, fat: 0 }
  },
  {
    id: "fries",
    name: "French Fries",
    price: 7.0,
    description: "Golden crispy fries, crunchy outside and fluffy inside.",
    category: "Snacks",
    spicyLevel: 0,
    ingredients: ["Potato", "Vegetable oil", "Salt"],
    nutrition: { calories: 320, carbs: 42, protein: 4, fat: 15 }
  },
  {
    id: "egg-tart",
    name: "Egg Tart",
    price: 4.0,
    description: "Single Portuguese-style egg tart, crispy and creamy.",
    category: "Desserts",
    spicyLevel: 0,
    ingredients: ["Puff pastry", "Eggs", "Milk", "Sugar"],
    nutrition: { calories: 180, carbs: 20, protein: 3, fat: 10 }
  },
  {
    id: "egg-tart-3",
    name: "Egg Tarts (3 pcs)",
    price: 10.0,
    description: "Three-piece set, better value.",
    category: "Desserts",
    spicyLevel: 0,
    ingredients: ["Puff pastry", "Eggs", "Milk", "Sugar"],
    nutrition: { calories: 540, carbs: 60, protein: 9, fat: 30 }
  },
  {
    id: "ice-cream-single",
    name: "Ice Cream (Single)",
    price: 7.0,
    description: "Single scoop cone, choose your flavor.",
    category: "Desserts",
    spicyLevel: 0,
    ingredients: ["Milk", "Cream", "Sugar"],
    nutrition: { calories: 180, carbs: 22, protein: 3, fat: 9 }
  },
  {
    id: "ice-cream-double",
    name: "Ice Cream (Double)",
    price: 9.0,
    description: "Double scoop cone, choose two flavors.",
    category: "Desserts",
    spicyLevel: 0,
    ingredients: ["Milk", "Cream", "Sugar"],
    nutrition: { calories: 320, carbs: 38, protein: 5, fat: 16 }
  },
  {
    id: "squid-ink-bun-upgrade",
    name: "Squid Ink Bun Upgrade",
    price: 1.0,
    description: "+¥1 to upgrade burger bun to black squid ink bun.",
    category: "Upgrades",
    spicyLevel: 0,
    ingredients: ["Burger bun", "Squid ink"],
    nutrition: { calories: 20, carbs: 3, protein: 1, fat: 0 }
  },
  {
    id: "vanilla-butter-sirloin-steak",
    name: "Vanilla Butter Sirloin Steak",
    price: 49.0,
    description: "Sirloin steak with vanilla butter, crispy outside and tender inside, with potato wedges and salad.",
    category: "Steaks",
    spicyLevel: 0,
    ingredients: ["Sirloin steak", "Vanilla butter", "Black pepper sauce", "Potato wedges", "Salad"],
    nutrition: { calories: 720, carbs: 28, protein: 42, fat: 46 }
  },
  {
    id: "black-pepper-steak-secret",
    name: "Secret Black Pepper Steak",
    price: 49.0,
    description: "Steak with secret black pepper sauce, rich flavor, with potato wedges and vegetables.",
    category: "Steaks",
    spicyLevel: 1,
    ingredients: ["Steak", "Black pepper sauce", "Butter", "Potato wedges", "Salad"],
    nutrition: { calories: 760, carbs: 29, protein: 44, fat: 48 }
  },
  {
    id: "chicken-breast-salad",
    name: "Chicken Breast Salad",
    price: 32.0,
    description: "Low-fat chicken breast with seasonal vegetables and nuts.",
    category: "Salads",
    spicyLevel: 0,
    ingredients: ["Chicken breast", "Lettuce", "Avocado", "Cherry tomatoes", "Corn", "Nuts", "Dressing"],
    nutrition: { calories: 360, carbs: 18, protein: 30, fat: 16 }
  },
  {
    id: "tuna-salad",
    name: "Tuna Salad",
    price: 32.0,
    description: "Tuna with vegetables and eggs, fresh and light.",
    category: "Salads",
    spicyLevel: 0,
    ingredients: ["Tuna", "Lettuce", "Cucumber", "Corn", "Eggs", "Dressing"],
    nutrition: { calories: 330, carbs: 16, protein: 28, fat: 14 }
  },
  {
    id: "xiaoman-bear-salad",
    name: "XiaoMan Bear Salad",
    price: 32.0,
    description: "Signature mixed salad with nuts and eggs, nutritionally balanced.",
    category: "Salads",
    spicyLevel: 0,
    ingredients: ["Lettuce", "Eggs", "Nuts", "Purple cabbage", "Corn", "Dressing"],
    nutrition: { calories: 340, carbs: 20, protein: 16, fat: 18 }
  },
  {
    id: "classic-durian-pizza",
    name: "Classic Durian Pizza",
    price: 38.0,
    description: "Durian and cheese baked together, rich and creamy.",
    category: "Pizza",
    spicyLevel: 0,
    ingredients: ["Pizza dough", "Durian", "Mozzarella", "Light cream"],
    nutrition: { calories: 860, carbs: 90, protein: 28, fat: 40 }
  },
  {
    id: "beef-mushroom-pizza",
    name: "Beef Mushroom Pizza",
    price: 38.0,
    description: "Beef and mushrooms with bell peppers, savory and delicious.",
    category: "Pizza",
    spicyLevel: 1,
    ingredients: ["Pizza dough", "Beef", "Mushrooms", "Bell peppers", "Mozzarella"],
    nutrition: { calories: 820, carbs: 86, protein: 32, fat: 34 }
  },
  {
    id: "orleans-chicken-pizza",
    name: "Orleans Chicken Pizza",
    price: 38.0,
    description: "Orleans-marinated chicken with sweet peppers and cheese.",
    category: "Pizza",
    spicyLevel: 1,
    ingredients: ["Pizza dough", "Orleans chicken", "Bell peppers", "Mozzarella"],
    nutrition: { calories: 800, carbs: 85, protein: 30, fat: 32 }
  },
  {
    id: "black-pepper-beef-noodle",
    name: "Black Pepper Beef Pasta",
    price: 22.0,
    description: "Black pepper sauce stir-fried with beef and pasta.",
    category: "Pasta",
    spicyLevel: 1,
    ingredients: ["Pasta", "Beef", "Black pepper sauce", "Bell peppers", "Onion"],
    nutrition: { calories: 680, carbs: 92, protein: 22, fat: 24 }
  },
  {
    id: "italy-bolognese-pasta",
    name: "Italian Bolognese Pasta",
    price: 22.0,
    description: "Classic tomato beef sauce pasta, sweet and savory.",
    category: "Pasta",
    spicyLevel: 0,
    ingredients: ["Pasta", "Tomato meat sauce", "Onion", "Carrot", "Cheese"],
    nutrition: { calories: 640, carbs: 94, protein: 20, fat: 18 }
  },
  {
    id: "truffle-cream-mushroom-pasta",
    name: "Truffle Cream Mushroom Pasta",
    price: 22.0,
    description: "Truffle aroma with creamy mushroom sauce, rich and smooth.",
    category: "Pasta",
    spicyLevel: 0,
    ingredients: ["Pasta", "Black truffle flavor", "Mushrooms", "Cream", "Mozzarella"],
    nutrition: { calories: 700, carbs: 90, protein: 17, fat: 28 }
  },
  {
    id: "vienna-style-platter",
    name: "Vienna Style Platter",
    price: 35.0,
    description: "Mixed fried platter with popcorn chicken, corn sticks, fries, with two sauces.",
    category: "Snacks",
    spicyLevel: 0,
    ingredients: ["Popcorn chicken", "Corn sticks", "Fries", "Ketchup", "Mayo"],
    nutrition: { calories: 780, carbs: 78, protein: 24, fat: 42 }
  },
  {
    id: "seine-river-platter",
    name: "Seine River Platter",
    price: 30.0,
    description: "Onion rings, fries, crab sticks combo, perfect for sharing.",
    category: "Snacks",
    spicyLevel: 0,
    ingredients: ["Onion rings", "Fries", "Crab sticks", "Ketchup", "Mayo"],
    nutrition: { calories: 720, carbs: 76, protein: 16, fat: 40 }
  },
  {
    id: "black-gold-chicken-nuggets",
    name: "Black Gold Chicken Nuggets",
    price: 13.0,
    description: "Charcoal-coated fried chicken nuggets, crispy outside and tender inside.",
    category: "Snacks",
    spicyLevel: 1,
    ingredients: ["Chicken breast", "Breading", "Spices", "Deep fried"],
    nutrition: { calories: 320, carbs: 16, protein: 20, fat: 18 }
  },
  {
    id: "popcorn-chicken",
    name: "Popcorn Chicken",
    price: 12.0,
    description: "Classic fried chicken snack, small and juicy.",
    category: "Snacks",
    spicyLevel: 1,
    ingredients: ["Chicken breast", "Breading", "Pepper", "Deep fried"],
    nutrition: { calories: 300, carbs: 15, protein: 18, fat: 16 }
  },
  {
    id: "spicy-fried-squid",
    name: "Spicy Fried Squid",
    price: 28.0,
    description: "Signature spicy fried squid rings, crispy outside and chewy inside.",
    category: "Snacks",
    spicyLevel: 2,
    ingredients: ["Squid rings", "Breading", "Chili powder", "Deep fried"],
    nutrition: { calories: 380, carbs: 28, protein: 22, fat: 18 }
  },
  {
    id: "roast-chicken-wings",
    name: "Orleans Roasted Wings",
    price: 12.0,
    description: "Orleans-style roasted chicken wings, 2 pieces.",
    category: "Snacks",
    spicyLevel: 1,
    ingredients: ["Chicken wings", "Orleans marinade"],
    nutrition: { calories: 260, carbs: 6, protein: 18, fat: 18 }
  },
  {
    id: "spicy-chicken-wings",
    name: "Spicy Chicken Wings",
    price: 12.0,
    description: "Spicy fried chicken wings, 2 pieces.",
    category: "Snacks",
    spicyLevel: 2,
    ingredients: ["Chicken wings", "Chili powder", "Breading"],
    nutrition: { calories: 280, carbs: 8, protein: 19, fat: 18 }
  },
  {
    id: "hibiscus-crab-stick",
    name: "Hibiscus Crab Sticks",
    price: 10.0,
    description: "Three imitation crab sticks, crispy outside and tender inside.",
    category: "Snacks",
    spicyLevel: 0,
    ingredients: ["Crab sticks", "Breading", "Deep fried"],
    nutrition: { calories: 210, carbs: 22, protein: 8, fat: 10 }
  }
];

export function getMenuByLanguage(language: Language): MenuItem[] {
  return language === 'zh' ? menuZh as MenuItem[] : menuEn;
}

