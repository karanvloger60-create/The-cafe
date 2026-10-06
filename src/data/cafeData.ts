export interface MenuItem {
  id: string;
  name: string;
  category: 'pizza' | 'burger' | 'drinks' | 'combos';
  price: number;
  description: string;
  isVeg: boolean;
  isBestSeller?: boolean;
  tag?: string;
  image?: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  favoriteItem?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
}

export const CAFE_INFO = {
  name: 'The Daily Cup Cafe',
  tagline: 'The Daily Dose of Happiness • Sip • Snap • Repeat',
  story: 'Nestled in the vibrant heart of Karawal Nagar, The Daily Cup Cafe is your cozy neighborhood sanctuary. Born from a passion for handcrafted coffee, freshly pulled wood-fired style pizzas, and unforgettable conversations, we have created a warm space where every sip brings a smile and every visit feels like home.',
  phone: '9958120122',
  phoneFormatted: '+91 99581 20122',
  address: 'Karawal Nagar, Near Sardar Patel School, Delhi',
  landmark: 'Near Sardar Patel School',
  city: 'Delhi - 110094',
  instagramHandle: '@the_dailycup2026',
  instagramUrl: 'https://instagram.com/the_dailycup2026',
  hours: 'Open Daily: 10:30 AM – 11:00 PM',
  whatsappBaseUrl: 'https://wa.me/919958120122',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Sardar+Patel+School+Karawal+Nagar+Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Sardar+Patel+School+Karawal+Nagar+Delhi',
};

export const MENU_ITEMS: MenuItem[] = [
  // Special Featured Combo
  {
    id: 'combo-special-249',
    name: 'Meal Combo - Pizza + Burger + Drink',
    category: 'combos',
    price: 249,
    description: '1 Freshly Baked 7" Pizza + 1 Crispy Patty Burger + 1 Chilled Beverage. Our most-loved blockbuster deal!',
    isVeg: true,
    isBestSeller: true,
    tag: 'Popular Offer',
    image: '/src/assets/images/combo_special_meal_1791111839918.jpg',
  },
  {
    id: 'combo-snack-buddy',
    name: 'Snack Buddy Duo: 2 Burgers + Peri Fries',
    category: 'combos',
    price: 219,
    description: '2 Crispy Aloo Tikki Burgers, golden seasoned peri-peri fries, and 2 dip sauces.',
    isVeg: true,
    tag: 'Sharing Deal',
    image: '/src/assets/images/menu_peri_fries_1791112629827.jpg',
  },
  {
    id: 'combo-coffee-brownie',
    name: 'Brew & Bake: Cappuccino + Warm Brownie',
    category: 'combos',
    price: 159,
    description: 'Steaming hot artisanal espresso cappuccino paired with a rich walnut chocolate brownie.',
    isVeg: true,
    tag: 'Sweet Pairing',
    image: '/src/assets/images/cafe_coffee_art_1791111869325.jpg',
  },
  {
    id: 'combo-pizza-mojito',
    name: 'Pizza & Chill: Farmhouse + Virgin Mojito',
    category: 'combos',
    price: 199,
    description: 'Medium Farmhouse loaded veggie pizza paired with an icy cold crushed mint lemon mojito.',
    isVeg: true,
    tag: 'Best Value',
    image: '/src/assets/images/menu_farmhouse_pizza_1791112590761.jpg',
  },

  // Pizzas
  {
    id: 'pizza-farmhouse',
    name: 'Farmhouse Supreme Pizza',
    category: 'pizza',
    price: 169,
    description: 'Golden sweet corn, crunchy capsicum, red onions, diced mushrooms, and rich gooey mozzarella.',
    isVeg: true,
    isBestSeller: true,
    tag: 'Must Try',
    image: '/src/assets/images/menu_farmhouse_pizza_1791112590761.jpg',
  },
  {
    id: 'pizza-paneer-tikka',
    name: 'Tandoori Paneer Tikka Pizza',
    category: 'pizza',
    price: 189,
    description: 'Smoky marinated cottage cheese cubes, roasted red paprika, green capsicum, and tandoori drizzle.',
    isVeg: true,
    tag: 'Chef Special',
    image: '/src/assets/images/menu_farmhouse_pizza_1791112590761.jpg',
  },
  {
    id: 'pizza-margherita',
    name: 'Classic Margherita Deluxe',
    category: 'pizza',
    price: 139,
    description: 'Authentic herb-infused San Marzano tomato sauce, double melted mozzarella, and fresh basil leaves.',
    isVeg: true,
    image: '/src/assets/images/menu_farmhouse_pizza_1791112590761.jpg',
  },
  {
    id: 'pizza-peri-peri',
    name: 'Fiery Peri-Peri Loaded Pizza',
    category: 'pizza',
    price: 179,
    description: 'Zesty peri-peri infused sauce, spicy jalapenos, red paprika, crunchy onions, and cheddar drizzle.',
    isVeg: true,
    tag: 'Spicy 🌶️',
    image: '/src/assets/images/menu_farmhouse_pizza_1791112590761.jpg',
  },

  // Burgers
  {
    id: 'burger-paneer-deluxe',
    name: 'Crispy Paneer Deluxe Burger',
    category: 'burger',
    price: 99,
    description: 'Golden spiced crumb-fried cottage cheese steak, fresh lettuce, sliced tomatoes, and garlic herb spread.',
    isVeg: true,
    isBestSeller: true,
    image: '/src/assets/images/menu_crispy_burger_1791112604329.jpg',
  },
  {
    id: 'burger-classic-crunch',
    name: 'Classic Aloo Crunch Burger',
    category: 'burger',
    price: 59,
    description: 'Crispy spiced potato & pea patty, signature mint mayo, crunchy pickled onion, and toasted sesame bun.',
    isVeg: true,
    image: '/src/assets/images/menu_crispy_burger_1791112604329.jpg',
  },
  {
    id: 'burger-daily-loaded',
    name: 'The Daily Double Cheese Burger',
    category: 'burger',
    price: 119,
    description: 'Double grilled spiced vegetable patties, double slice English cheddar cheese, and caramelized onions.',
    isVeg: true,
    tag: 'Cheesy Hit',
    image: '/src/assets/images/menu_crispy_burger_1791112604329.jpg',
  },
  {
    id: 'burger-spicy-jalapeno',
    name: 'Spicy Corn & Jalapeno Burger',
    category: 'burger',
    price: 89,
    description: 'Golden sweet corn patty with spicy Mexican jalapeno relish, crunchy coleslaw, and smoky chipotle sauce.',
    isVeg: true,
    image: '/src/assets/images/menu_crispy_burger_1791112604329.jpg',
  },

  // Coffee & Drinks
  {
    id: 'drink-caramel-frappe',
    name: 'Signature Caramel Frappuccino',
    category: 'drinks',
    price: 129,
    description: 'Freshly pulled espresso blended with creamy milk, vanilla bean, whipped cream, and golden butterscotch drizzle.',
    isVeg: true,
    isBestSeller: true,
    image: '/src/assets/images/cafe_coffee_art_1791111869325.jpg',
  },
  {
    id: 'drink-hazelnut-latte',
    name: 'Artisan Hazelnut Iced Latte',
    category: 'drinks',
    price: 119,
    description: 'Double shot rich espresso over chilled milk, roasted Italian hazelnut notes, served over clear ice blocks.',
    isVeg: true,
    image: '/src/assets/images/cafe_coffee_art_1791111869325.jpg',
  },
  {
    id: 'drink-blue-lagoon',
    name: 'Blue Lagoon Sparkling Mocktail',
    category: 'drinks',
    price: 99,
    description: 'Vibrant blue curacao citrus cordial, chilled bubbly soda, fresh mint leaves, and fresh lime squeeze.',
    isVeg: true,
    tag: 'Super Cooler',
    image: '/src/assets/images/menu_blue_lagoon_1791112616861.jpg',
  },
  {
    id: 'drink-classic-cappuccino',
    name: 'Velvety Hot Cappuccino',
    category: 'drinks',
    price: 89,
    description: 'Rich dark roast espresso with dense silky microfoam and fine cocoa powder dusting.',
    isVeg: true,
    image: '/src/assets/images/cafe_coffee_art_1791111869325.jpg',
  },
  {
    id: 'drink-belgian-chocolate',
    name: 'Rich Belgian Hot Chocolate',
    category: 'drinks',
    price: 109,
    description: 'Decadent 60% dark chocolate ganache melted into steamed milk, topped with mini marshmallows.',
    isVeg: true,
    image: '/src/assets/images/cafe_coffee_art_1791111869325.jpg',
  },
  {
    id: 'drink-peach-iced-tea',
    name: 'Sun-Brewed Peach Iced Tea',
    category: 'drinks',
    price: 79,
    description: 'Refreshing Assam black tea cold-steeped with natural juicy peach extract and citrus wheels.',
    isVeg: true,
    image: '/src/assets/images/menu_blue_lagoon_1791112616861.jpg',
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Aarav Sharma',
    role: 'Local Resident, Karawal Nagar',
    rating: 5,
    date: '2 days ago',
    comment: 'Best cafe vibe in Karawal Nagar! The ₹249 Meal Combo is unmatched value. The pizza crust was crispy and the burger was super fresh.',
    favoriteItem: 'Meal Combo - Pizza + Burger + Drink',
  },
  {
    id: 'rev-2',
    name: 'Sneha Gupta',
    role: 'Coffee Enthusiast',
    rating: 5,
    date: 'Last week',
    comment: 'The aesthetic lighting and comfortable wooden seating make it the perfect spot to hang out or get work done. Their Hazelnut Latte is divine!',
    favoriteItem: 'Artisan Hazelnut Iced Latte',
  },
  {
    id: 'rev-3',
    name: 'Priyansh Verma',
    role: 'College Student',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Finally a modern, warm cafe near Sardar Patel School. Great music, clean ambiance, and the WhatsApp ordering is super quick!',
    favoriteItem: 'Tandoori Paneer Tikka Pizza',
  },
  {
    id: 'rev-4',
    name: 'Ananya Malik',
    role: 'Frequent Patron',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Sip, snap, repeat is totally true here! Every corner has photogenic lighting. Loved the loaded burger and caramel frappe.',
    favoriteItem: 'Signature Caramel Frappuccino',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Warm Amber Ambiance',
    subtitle: 'Golden pendant filament lighting & dark charcoal acoustic walls',
    image: '/src/assets/images/hero_cafe_ambience_1791111821760.jpg',
    tag: 'Interior',
  },
  {
    id: 'gal-2',
    title: 'Cozy Reading & Hangout Nook',
    subtitle: 'Plush velvet armchairs, natural wood finishes & books',
    image: '/src/assets/images/cafe_interior_seating_1791111855104.jpg',
    tag: 'Seating',
  },
  {
    id: 'gal-3',
    title: 'Artisanal Barista Crafts',
    subtitle: 'Freshly roasted beans with velvety poured microfoam art',
    image: '/src/assets/images/cafe_coffee_art_1791111869325.jpg',
    tag: 'Espresso Bar',
  },
  {
    id: 'gal-4',
    title: 'Signature Feast Moments',
    subtitle: 'Fresh oven-baked pizzas, loaded burgers, and chilled mocktails',
    image: '/src/assets/images/combo_special_meal_1791111839918.jpg',
    tag: 'Cafe Bites',
  },
];
