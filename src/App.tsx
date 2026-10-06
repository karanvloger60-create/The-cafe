/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  Menu as MenuIcon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Calendar,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Link as LinkIcon,
  Sparkles,
  Utensils,
  Search,
} from 'lucide-react';
import {
  CAFE_INFO,
  MENU_ITEMS,
  MenuItem,
} from './data/cafeData';

// Checkerboard pattern helper component
function Checkerboard({
  rows = 2,
  cols = 5,
  darkColor = '#EBC758',
  lightColor = '#F6F1E8',
  className = '',
}: {
  rows?: number;
  cols?: number;
  darkColor?: string;
  lightColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-0 shrink-0 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const isDark = (row + col) % 2 === 0;
        return (
          <div
            key={idx}
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ backgroundColor: isDark ? darkColor : lightColor }}
          />
        );
      })}
    </div>
  );
}

// Full Width Checkerboard Ribbon
function FullWidthCheckerboard({
  darkColor = '#241711',
  lightColor = '#F6F1E8',
}: {
  darkColor?: string;
  lightColor?: string;
}) {
  return (
    <div className="w-full overflow-hidden flex flex-col">
      <div className="flex w-[200%]">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="h-4 sm:h-5 w-4 sm:w-5 shrink-0"
            style={{
              backgroundColor: i % 2 === 0 ? darkColor : lightColor,
            }}
          />
        ))}
      </div>
      <div className="flex w-[200%]">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="h-4 sm:h-5 w-4 sm:w-5 shrink-0"
            style={{
              backgroundColor: i % 2 !== 0 ? darkColor : lightColor,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  // Navigation & Interactive UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [menuFilter, setMenuFilter] = useState<'all' | 'pizza' | 'burger' | 'drinks' | 'combos'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Signature Drink Selector State (Matching Card 2 in reference)
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('M');
  const [tempType, setTempType] = useState<number>(4); // Hot (0) to Cold (5)
  const [currentDrinkSlide, setCurrentDrinkSlide] = useState(0);

  // Experience photo active dot
  const [activeExperienceStep, setActiveExperienceStep] = useState(0);

  // Craft Process Active Tab
  const [activeCraftTab, setActiveCraftTab] = useState(0);

  // Customer Reviews Carousel
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Cart State
  const [cart, setCart] = useState<Record<string, number>>({
    'drink-caramel-flavour': 1,
    'combo-special-249': 1,
  });
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeaway' | 'Delivery'>('Dine-in');
  const [orderNote, setOrderNote] = useState('');

  // Table Reservation State
  const [resDate, setResDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [resTime, setResTime] = useState('18:00');
  const [resGuests, setResGuests] = useState('2');
  const [resOccasion, setResOccasion] = useState('Casual Hangout');
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resSuccess, setResSuccess] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Cart Handlers
  const addToCart = (itemId: string, itemName: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    showToast(`Added "${itemName}" to cart`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, count]) => {
      // Find in MENU_ITEMS or signature drinks
      const item = MENU_ITEMS.find((m) => m.id === id);
      if (item) return sum + item.price * count;
      if (id === 'drink-classic-black') return sum + 129 * count;
      if (id === 'drink-caramel-flavour') return sum + 149 * count;
      if (id === 'drink-vanilla-flavour') return sum + 139 * count;
      if (id === 'drink-hazelnut-flavour') return sum + 139 * count;
      return sum;
    }, 0);
  }, [cart]);

  // WhatsApp Order Generator
  const generateWhatsAppOrderUrl = () => {
    const phone = CAFE_INFO.phone; // 9958120122
    if (cartItemCount === 0) {
      const text = `Hello The Daily Cup Cafe! I would like to inquire about today's brews, special offers, and table bookings at Karawal Nagar.`;
      return `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
    }

    let msg = `*☕ NEW CAFE ORDER - The Daily Cup Cafe*\n`;
    msg += `──────────────────\n`;
    msg += `*Customer:* ${customerName.trim() || 'Guest'}\n`;
    msg += `*Type:* ${orderType}\n`;
    if (orderNote.trim()) msg += `*Notes:* ${orderNote.trim()}\n`;
    msg += `──────────────────\n`;
    msg += `*Order Items:*\n`;

    Object.entries(cart).forEach(([id, count]) => {
      let name = id;
      let price = 149;
      const found = MENU_ITEMS.find((m) => m.id === id);
      if (found) {
        name = found.name;
        price = found.price;
      } else if (id === 'drink-classic-black') {
        name = 'Classic Black Iced Coffee';
        price = 129;
      } else if (id === 'drink-caramel-flavour') {
        name = `Caramel Flavour Frappe (${selectedSize})`;
        price = 149;
      } else if (id === 'drink-vanilla-flavour') {
        name = 'Vanilla Flavour Cold Foam';
        price = 139;
      } else if (id === 'drink-hazelnut-flavour') {
        name = 'Hazelnut Flavour Iced Latte';
        price = 139;
      }
      msg += `• ${count}x ${name} (₹${price * count})\n`;
    });

    msg += `──────────────────\n`;
    msg += `*Total Amount:* ₹${cartSubtotal}\n`;
    msg += `📍 *Karawal Nagar, Near Sardar Patel School, Delhi*\n`;
    msg += `Please confirm my order and share preparation time. Thank you!`;

    return `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;
  };

  // Table Reservation Submission
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName.trim() || !resPhone.trim()) return;

    let text = `*🪑 TABLE RESERVATION - The Daily Cup Cafe*\n`;
    text += `──────────────────\n`;
    text += `*Name:* ${resName}\n`;
    text += `*Contact:* ${resPhone}\n`;
    text += `*Date:* ${resDate}\n`;
    text += `*Time:* ${resTime}\n`;
    text += `*Guests:* ${resGuests} Person(s)\n`;
    text += `*Occasion:* ${resOccasion}\n`;
    text += `📍 *Branch:* Karawal Nagar, Delhi\n`;
    text += `Please confirm table availability. Thank you!`;

    setResSuccess(true);
    setTimeout(() => {
      window.open(
        `https://wa.me/91${CAFE_INFO.phone}?text=${encodeURIComponent(text)}`,
        '_blank'
      );
      setIsReservationOpen(false);
      setResSuccess(false);
      setResName('');
      setResPhone('');
    }, 1200);
  };

  // Signature drinks data matching reference
  const SIGNATURE_DRINKS = [
    {
      id: 'drink-classic-black',
      title: 'CLASSIC BLACK',
      price: '₹129',
      subtitle: 'Espresso • Dark Chocolate • Ice',
      tag: 'STARTING AT',
      bg: 'bg-[#FDFBF7]',
      isHero: false,
    },
    {
      id: 'drink-caramel-flavour',
      title: 'CARAMEL FLAVOUR',
      price: '₹149',
      subtitle: 'Espresso • Warm Milk • Cinnamon',
      tag: 'STARTING AT',
      bg: 'bg-[#EBC758]',
      isHero: true,
    },
    {
      id: 'drink-vanilla-flavour',
      title: 'VANILLA FLAVOUR',
      price: '₹139',
      subtitle: 'Espresso • Vanilla • Cold Foam',
      tag: 'STARTING AT',
      bg: 'bg-[#FDFBF7]',
      isHero: false,
    },
    {
      id: 'drink-hazelnut-flavour',
      title: 'HAZELNUT FLAVOUR',
      price: '₹139',
      subtitle: 'Espresso • Hazelnut • Silky Milk',
      tag: 'STARTING AT',
      bg: 'bg-[#FDFBF7]',
      isHero: false,
    },
  ];

  // Craft Process Steps
  const CRAFT_STEPS = [
    {
      step: '01',
      title: 'BEANS WORTH CHOOSING',
      tag: 'SELECT',
      desc: "We believe coffee doesn't need to be complicated. It just needs to be honest—beautifully sourced, carefully roasted, and brewed with intention.",
      image: '/src/assets/images/roasted_beans_craft_1791264133939.jpg',
    },
    {
      step: '02',
      title: 'GROUND FOR THE CUP',
      tag: 'GRIND',
      desc: 'Precision burr grinding calibrated fresh for every espresso shot and pour-over to release full aromatic richness.',
      image: '/src/assets/images/cafe_coffee_art_1791111869325.jpg',
    },
    {
      step: '03',
      title: 'CAREFULLY BREWED',
      tag: 'BREW',
      desc: 'Masterfully extracted at 9 bars of pressure with water heated to the exact degree for silky crema and sweetness.',
      image: '/src/assets/images/menu_blue_lagoon_1791112616861.jpg',
    },
    {
      step: '04',
      title: 'MADE WITH CARE',
      tag: 'SERVE',
      desc: 'Finished with latte art or poured over crystalline ice blocks, served with genuine warmth in Karawal Nagar.',
      image: '/src/assets/images/hero_iced_frappes_1791264105968.jpg',
    },
  ];

  // Reviews Data matching reference
  const REVIEWS_DATA = [
    {
      name: 'Olivia Carter',
      role: 'Regular customer',
      quote:
        '“THE COFFEE IS RICH, SMOOTH, AND FULL OF FLAVOR, WITH AN AROMA THAT MAKES EVERY MORNING FEEL SPECIAL. IT HAS QUICKLY BECOME MY FAVORITE PART OF THE DAY, AND I HONESTLY LOOK FORWARD TO EVERY CUP.”',
      image: '/src/assets/images/cafe_friends_lifestyle_1791264121709.jpg',
    },
    {
      name: 'Emily Carter',
      role: 'Regular customer',
      quote:
        '“EVERY SIP FEELS FRESH, BALANCED, AND BEAUTIFULLY CRAFTED, WITHOUT BEING TOO STRONG OR BITTER. IT IS THE PERFECT COFFEE TO ENJOY WHILE WORKING, RELAXING, OR SIMPLY SLOWING DOWN.”',
      image: '/src/assets/images/hero_cafe_ambience_1791111821760.jpg',
    },
    {
      name: 'Sophia Martin',
      role: 'Regular customer',
      quote:
        '“I ABSOLUTELY LOVE THE SMOOTH TASTE AND RICH AROMA OF THIS COFFEE—IT FEELS PREMIUM IN EVERY WAY. ONE CUP IS ENOUGH TO TURN AN ORDINARY MORNING INTO A MUCH BETTER ONE.”',
      image: '/src/assets/images/cafe_interior_seating_1791111855104.jpg',
    },
  ];

  // Filtered menu for full menu section
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCat = menuFilter === 'all' || item.category === menuFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#241711] selection:bg-[#EBC758] selection:text-[#241711] font-sans">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#241711] text-[#F6F1E8] text-xs font-semibold shadow-2xl animate-fade-in border border-[#EBC758]">
          <Sparkles className="w-3.5 h-3.5 text-[#EBC758]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOP HEADER                                               */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#F6F1E8]/95 backdrop-blur-md border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-[#4A3B32]">
            <a href="#about" className="hover:text-[#241711] transition-colors">
              Story
            </a>
            <a href="#signature" className="hover:text-[#241711] transition-colors">
              Blends
            </a>
            <a href="#offer" className="hover:text-[#241711] transition-colors">
              Offer
            </a>
          </nav>

          {/* Center Brand Wordmark */}
          <a href="#" className="flex flex-col items-center group">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#241711] leading-none group-hover:opacity-90 transition-opacity">
              THE DAILY CUP
            </span>
            <span className="text-[9px] font-bold tracking-[0.25em] text-[#8C6D4F] uppercase">
              CAFE & COFFEE ROASTERS
            </span>
          </a>

          {/* Right Nav & Cart */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold tracking-widest uppercase text-[#4A3B32]">
              <a href="#location" className="hover:text-[#241711] transition-colors">
                Contact
              </a>
              <button
                onClick={() => setShowFullMenu(!showFullMenu)}
                className="hover:text-[#241711] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Menu</span>
                <span className="text-[10px]">▼</span>
              </button>
            </nav>

            {/* Cart Icon Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-[#E8DFC8]/60 transition-colors cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#241711]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EBC758] border border-[#241711] text-[#241711] text-[10px] font-extrabold flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#241711]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F6F1E8] border-b border-[#E8DFC8] px-6 py-5 space-y-3 text-xs font-bold uppercase tracking-widest">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#EBC758]"
            >
              Story
            </a>
            <a
              href="#signature"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#EBC758]"
            >
              Blends & Signature Drinks
            </a>
            <a
              href="#offer"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#EBC758]"
            >
              Special Combo Offer
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#EBC758]"
            >
              Cafe Experience
            </a>
            <a
              href="#craft"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#EBC758]"
            >
              The Craft
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#EBC758]"
            >
              Customer Reviews
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#EBC758]"
            >
              Visit & Contact
            </a>
            <div className="pt-2 border-t border-[#E8DFC8] flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsReservationOpen(true);
                }}
                className="flex-1 py-2 rounded-full bg-[#241711] text-[#F6F1E8] text-[11px] font-bold uppercase"
              >
                Book Table
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowFullMenu(true);
                }}
                className="flex-1 py-2 rounded-full bg-[#EBC758] border border-[#241711] text-[#241711] text-[11px] font-bold uppercase"
              >
                Full Menu
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* 1. HERO SECTION ("GOOD COFFEE. BETTER MOMENTS")          */}
      {/* ======================================================== */}
      <section className="relative pt-6 pb-14 sm:pt-10 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Huge Headline & Checkerboard Accent */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl xl:text-[96px] font-extrabold uppercase tracking-tight text-[#241711] leading-[0.92]">
              GOOD COFFEE. <br />
              BETTER MOMENTS
            </h1>
            <Checkerboard rows={2} cols={5} darkColor="#EBC758" lightColor="#F6F1E8" className="mt-2" />
          </div>

          {/* Main Visual & Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6 lg:mt-2">
            {/* Left Content Column */}
            <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
              <p className="text-sm sm:text-base text-[#5D4A3D] leading-relaxed max-w-sm">
                Rich, smooth, and freshly roasted coffee, crafted from carefully selected beans to make every moment more enjoyable.
              </p>

              {/* Action Buttons with Pill link aesthetic */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#signature"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EBC758] text-[#241711] border-2 border-[#241711] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#241711] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
                >
                  <span>ORDER COFFEE</span>
                  <LinkIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>

                <a
                  href="#experience"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[#241711] font-bold text-xs uppercase tracking-wider hover:underline"
                >
                  <span>VISIT OUR CAFE</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Center Coffee Frappe Visual */}
            <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
              <div className="relative group max-w-sm sm:max-w-md w-full">
                <img
                  src="/src/assets/images/hero_iced_frappes_1791264105968.jpg"
                  alt="The Daily Cup Signature Iced Frappe and Cold Brew"
                  className="w-full h-auto rounded-3xl object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-102"
                />
              </div>
            </div>

            {/* Right Metric Stats Column */}
            <div className="lg:col-span-3 order-3 flex flex-row lg:flex-row items-center justify-between lg:justify-end gap-6 sm:gap-8 pt-4 lg:pt-0">
              <div className="text-center lg:text-left">
                <p className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#241711] leading-none">
                  22+
                </p>
                <p className="text-xs text-[#7B634E] font-medium mt-1">Flavours</p>
              </div>

              <div className="text-center lg:text-left">
                <p className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#241711] leading-none">
                  12K+
                </p>
                <p className="text-xs text-[#7B634E] font-medium mt-1">Customer</p>
              </div>

              <div className="text-center lg:text-left">
                <p className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#241711] leading-none">
                  75+
                </p>
                <p className="text-xs text-[#7B634E] font-medium mt-1">Products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PINK TICKER MARQUEE RIBBON                            */}
      {/* ======================================================== */}
      <div className="bg-[#F4A1B3] text-[#241711] py-3.5 border-y-2 border-[#241711] overflow-hidden whitespace-nowrap">
        <div className="animate-marquee font-heading text-2xl sm:text-3xl font-extrabold tracking-wider uppercase flex items-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <React.Fragment key={i}>
              <span className="mx-6">BEANS</span>
              <span className="text-lg">✱</span>
              <span className="mx-6">COFFEE</span>
              <span className="text-lg">✱</span>
              <span className="mx-6">LATTE</span>
              <span className="text-lg">✱</span>
              <span className="mx-6">CAPPUCCINO</span>
              <span className="text-lg">✱</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ABOUT US MANIFESTO SECTION                            */}
      {/* ======================================================== */}
      <section id="about" className="py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Top Right Floating Photo Accent */}
          <div className="hidden md:block absolute -top-8 right-2 w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-[#241711] rotate-6">
            <img
              src="/src/assets/images/cafe_coffee_art_1791111869325.jpg"
              alt="Artisan cup"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Left Floating Photo Accent */}
          <div className="hidden md:block absolute -bottom-6 left-2 w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-[#241711] -rotate-6">
            <img
              src="/src/assets/images/menu_blue_lagoon_1791112616861.jpg"
              alt="Refreshing drink"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-xs font-bold tracking-[0.25em] text-[#8C6D4F] uppercase mb-4">
            ABOUT US
          </p>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#241711] uppercase tracking-tight leading-[1.08] max-w-4xl mx-auto">
            WE BELIEVE GREAT COFFEE HAS THE POWER TO SLOW DOWN YOUR DAY, BRING PEOPLE TOGETHER, AND TURN EVERYDAY MOMENTS INTO SOMETHING SPECIAL.
          </h2>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setIsReservationOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EBC758] text-[#241711] border-2 border-[#241711] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#241711] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform cursor-pointer"
            >
              <span>LEARN ABOUT US</span>
              <LinkIcon className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SIGNATURE DRINKS SECTION (DARK CHOCOLATE ESPRESSO BG) */}
      {/* ======================================================== */}
      <section id="signature" className="py-20 lg:py-28 bg-[#241711] text-[#F6F1E8] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-[#EBC758] uppercase mb-2">
                SIGNATURE DRINKS
              </p>
              <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-[#FDFBF7] leading-none">
                A LITTLE DIFFERENT. <br />
                DELICIOUSLY SO.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 max-w-md">
              <Checkerboard rows={2} cols={5} darkColor="#EBC758" lightColor="#241711" />
              <p className="text-xs text-[#CDBEAA] leading-relaxed">
                We believe coffee doesn't need to be complicated. It just needs to be honest—beautifully sourced, carefully roasted, and brewed with intention.
              </p>
            </div>
          </div>

          {/* 4 Drink Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {SIGNATURE_DRINKS.map((drink, idx) => {
              const isCenterHero = drink.isHero;

              return (
                <div
                  key={drink.id}
                  className={`rounded-3xl p-6 flex flex-col justify-between text-[#241711] transition-all relative ${
                    isCenterHero
                      ? 'bg-[#EBC758] border-2 border-[#EBC758] lg:-translate-y-4 shadow-2xl min-h-[480px]'
                      : 'bg-[#FDFBF7] border-2 border-[#FDFBF7] min-h-[420px]'
                  }`}
                >
                  {/* Drink Image / Cup Mockup */}
                  <div className="relative w-full h-44 flex items-center justify-center">
                    <img
                      src="/src/assets/images/hero_iced_frappes_1791264105968.jpg"
                      alt={drink.title}
                      className="max-h-40 w-auto object-contain drop-shadow-md rounded-2xl"
                    />
                  </div>

                  {/* Starting Price Tag Pill */}
                  <div className="text-center my-3">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#F4A1B3] text-[#241711] border border-[#241711]">
                      {drink.tag} {drink.price}
                    </span>
                  </div>

                  {/* Drink Details */}
                  <div className="text-center space-y-1">
                    <h3 className="font-heading text-2xl font-extrabold text-[#241711] tracking-tight">
                      {drink.title}
                    </h3>
                    <p className="text-xs text-[#523F32] font-medium">
                      {drink.subtitle}
                    </p>
                  </div>

                  {/* Center Hero Card Extras: Size selector & Hot/Cold meter */}
                  {isCenterHero && (
                    <div className="space-y-3 pt-3 border-t border-[#241711]/20 mt-3">
                      {/* S M L Size pills */}
                      <div className="flex items-center justify-center gap-2">
                        {(['S', 'M', 'L'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold border border-[#241711] transition-all ${
                              selectedSize === s
                                ? 'bg-[#241711] text-[#F6F1E8]'
                                : 'bg-transparent text-[#241711] hover:bg-[#241711]/10'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      {/* Hot / Cold meter */}
                      <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#241711]">
                        <span>Hot</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              onClick={() => setTempType(level)}
                              className={`w-2.5 h-2.5 rounded-xs transition-colors ${
                                level <= tempType ? 'bg-[#241711]' : 'bg-[#241711]/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span>Cold</span>
                      </div>
                    </div>
                  )}

                  {/* Add To Cart Button */}
                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={() => addToCart(drink.id, drink.title)}
                      className="w-full py-2.5 px-4 rounded-full bg-transparent hover:bg-[#241711] text-[#241711] hover:text-[#F6F1E8] border-2 border-[#241711] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_#241711]"
                    >
                      <span>ADD TO CART</span>
                      <LinkIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setCurrentDrinkSlide((prev) => Math.max(0, prev - 1))}
              className="w-10 h-10 rounded-full bg-[#EBC758] text-[#241711] border-2 border-[#241711] flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Previous drink"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setCurrentDrinkSlide((prev) => prev + 1)}
              className="w-10 h-10 rounded-full bg-[#EBC758] text-[#241711] border-2 border-[#241711] flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Next drink"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. FULL-WIDTH CHECKERBOARD DIVIDER                       */}
      {/* ======================================================== */}
      <FullWidthCheckerboard darkColor="#241711" lightColor="#F6F1E8" />

      {/* ======================================================== */}
      {/* 6. SPECIAL MEAL COMBO BANNER (₹249 Highlight)            */}
      {/* ======================================================== */}
      <section id="offer" className="py-14 sm:py-20 bg-[#F6F1E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EBC758] border-3 border-[#241711] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[6px_6px_0px_#241711] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 relative">
                <img
                  src="/src/assets/images/combo_special_meal_1791111839918.jpg"
                  alt="Meal Combo Pizza Burger Drink"
                  className="rounded-2xl border-2 border-[#241711] w-full h-64 sm:h-72 object-cover shadow-[4px_4px_0px_#241711]"
                />
                <span className="absolute top-3 left-3 bg-[#241711] text-[#EBC758] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  POPULAR OFFER
                </span>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#241711] bg-[#F4A1B3] px-3 py-1 rounded-full border border-[#241711]">
                  Best Seller Offer
                </span>

                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-[#241711] leading-none">
                  MEAL COMBO - PIZZA + BURGER + DRINK @ ₹249
                </h2>

                <p className="text-sm text-[#463529] font-medium leading-relaxed">
                  The ultimate cafe blockbuster feast! Includes 1 freshly baked 7" Veg Pizza, 1 Crispy Patty Burger, and 1 Chilled Beverage of your choice.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <span className="font-heading text-4xl sm:text-5xl font-extrabold text-[#241711]">
                    ₹249
                  </span>
                  <span className="text-sm text-[#5D4A3D] line-through font-bold">
                    ₹327
                  </span>

                  <button
                    onClick={() =>
                      addToCart('combo-special-249', 'Meal Combo - Pizza + Burger + Drink')
                    }
                    className="px-6 py-3 rounded-full bg-[#241711] text-[#F6F1E8] font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#F4A1B3] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform flex items-center gap-2 cursor-pointer"
                  >
                    <span>ADD COMBO TO CART</span>
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FULL DIGITAL MENU ACCORDION/SECTION                      */}
      {/* ======================================================== */}
      {showFullMenu && (
        <section className="py-14 bg-[#EFE9DC] border-y-2 border-[#241711]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-[#8C6D4F] uppercase">
                  FULL DIGITAL MENU
                </p>
                <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#241711] uppercase">
                  PIZZAS, BURGERS, DRINKS & COMBOS
                </h2>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#FDFBF7] border-2 border-[#241711] text-xs font-semibold placeholder-[#8C6D4F] focus:outline-none focus:ring-2 focus:ring-[#EBC758]"
                />
                <Search className="w-4 h-4 text-[#8C6D4F] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {(
                [
                  { id: 'all', label: 'ALL ITEMS' },
                  { id: 'pizza', label: 'PIZZA' },
                  { id: 'burger', label: 'BURGER' },
                  { id: 'drinks', label: 'COFFEE & DRINKS' },
                  { id: 'combos', label: 'COMBOS' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMenuFilter(tab.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-[#241711] whitespace-nowrap transition-all cursor-pointer ${
                    menuFilter === tab.id
                      ? 'bg-[#241711] text-[#F6F1E8] shadow-[2px_2px_0px_#EBC758]'
                      : 'bg-[#FDFBF7] text-[#241711] hover:bg-[#EBC758]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FDFBF7] border-2 border-[#241711] rounded-2xl p-4 flex flex-col justify-between shadow-[3px_3px_0px_#241711] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-xl border border-[#241711] mb-3"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D4F]">
                        {item.category}
                      </span>
                      <span className="font-heading text-xl font-extrabold text-[#241711]">
                        ₹{item.price}
                      </span>
                    </div>
                    <h4 className="font-heading text-lg font-extrabold text-[#241711] leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#5D4A3D] line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-[#E8DFC8] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      100% PURE VEG
                    </span>
                    <button
                      onClick={() => addToCart(item.id, item.name)}
                      className="px-4 py-1.5 rounded-full bg-[#EBC758] text-[#241711] border border-[#241711] font-bold text-xs uppercase tracking-wider hover:bg-[#241711] hover:text-[#F6F1E8] transition-colors cursor-pointer"
                    >
                      + ADD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 7. THE CAFE EXPERIENCE ("COME FOR THE CUP STAY FOR...")  */}
      {/* ======================================================== */}
      <section id="experience" className="py-20 lg:py-28 bg-[#F6F1E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Top Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline & Tags */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs font-bold tracking-[0.25em] text-[#8C6D4F] uppercase">
                THE CAFÉ EXPERIENCE
              </p>

              <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-[#241711] leading-[0.95]">
                COME FOR THE CUP <br />
                STAY FOR THE MOMENT.
              </h2>

              <div>
                <button
                  onClick={() => setIsReservationOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EBC758] text-[#241711] border-2 border-[#241711] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#241711] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform cursor-pointer"
                >
                  <span>EXPLORE OUR CAFÉ</span>
                  <LinkIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {['COZY CORNERS', 'FRESHLY BREWED', 'WARM LIGHT'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border-2 border-[#241711] bg-[#FDFBF7] text-[#241711]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Large Image with 01 02 03 dots */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border-3 border-[#241711] shadow-[6px_6px_0px_#241711] group">
                <img
                  src="/src/assets/images/cafe_friends_lifestyle_1791264121709.jpg"
                  alt="Friends laughing at The Daily Cup Cafe"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-103 transition-transform duration-700"
                />

                {/* Overlaid number badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {['01', '02', '03'].map((num, i) => (
                    <button
                      key={num}
                      onClick={() => setActiveExperienceStep(i)}
                      className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ${
                        activeExperienceStep === i
                          ? 'bg-[#EBC758] text-[#241711] border-2 border-[#241711] scale-110 shadow'
                          : 'bg-[#241711]/60 text-white backdrop-blur-xs'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: 4 Square Gallery Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                img: '/src/assets/images/hero_cafe_ambience_1791111821760.jpg',
                label: 'Barista Pouring',
              },
              {
                img: '/src/assets/images/cafe_coffee_art_1791111869325.jpg',
                label: 'Latte Art Rosetta',
              },
              {
                img: '/src/assets/images/cafe_interior_seating_1791111855104.jpg',
                label: 'Warm Seating Corner',
              },
              {
                img: '/src/assets/images/hero_iced_frappes_1791264105968.jpg',
                label: 'Signature Cups',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border-2 border-[#241711] shadow-[3px_3px_0px_#241711] h-36 sm:h-44 group cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. THE CRAFT ("SIMPLE INGREDIENTS. CAREFUL HANDS.")      */}
      {/* ======================================================== */}
      <section id="craft" className="py-20 lg:py-28 bg-[#F6F1E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header with Checkerboard & Intro */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-[#8C6D4F] uppercase mb-2">
                THE CRAFT
              </p>
              <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-[#241711] leading-none">
                SIMPLE INGREDIENTS. <br />
                CAREFUL HANDS.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 max-w-md">
              <Checkerboard rows={2} cols={5} darkColor="#EBC758" lightColor="#F6F1E8" />
              <p className="text-xs text-[#5D4A3D] leading-relaxed">
                From carefully chosen beans to the final pour, every step is intentional—simple ingredients, thoughtful craft, and a little patience in every cup.
              </p>
            </div>
          </div>

          {/* Main Active Craft Card (Dark Espresso) */}
          <div className="bg-[#241711] text-[#FDFBF7] border-3 border-[#241711] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#241711]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-[#EBC758] text-[#241711] font-heading text-lg font-extrabold">
                  {CRAFT_STEPS[activeCraftTab].step}
                </div>

                <p className="text-xs font-bold tracking-widest text-[#EBC758] uppercase">
                  {CRAFT_STEPS[activeCraftTab].tag}
                </p>

                <h3 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#FDFBF7] uppercase tracking-tight">
                  {CRAFT_STEPS[activeCraftTab].title}
                </h3>

                <p className="text-sm text-[#CDBEAA] leading-relaxed max-w-md">
                  {CRAFT_STEPS[activeCraftTab].desc}
                </p>
              </div>

              {/* Right Image */}
              <div className="lg:col-span-6">
                <img
                  src={CRAFT_STEPS[activeCraftTab].image}
                  alt={CRAFT_STEPS[activeCraftTab].title}
                  className="rounded-2xl border-2 border-[#EBC758]/30 w-full h-64 sm:h-80 object-cover shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Bottom Tabs for the other steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CRAFT_STEPS.slice(1).map((step, idx) => {
              const actualIndex = idx + 1;
              const isActive = activeCraftTab === actualIndex;

              return (
                <button
                  key={step.step}
                  onClick={() => setActiveCraftTab(actualIndex)}
                  className={`p-5 rounded-2xl border-2 border-[#241711] flex items-center justify-between text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EBC758] shadow-[4px_4px_0px_#241711]'
                      : 'bg-[#FDFBF7] hover:bg-[#EBC758]/30 shadow-[2px_2px_0px_#241711]'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#5D4A3D]">
                      {step.tag}
                    </span>
                    <h4 className="font-heading text-lg font-extrabold text-[#241711] uppercase leading-tight">
                      {step.title}
                    </h4>
                  </div>
                  <span className="font-heading text-2xl font-extrabold text-[#241711]">
                    {step.step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. SUBTLE DIVIDER                                        */}
      {/* ======================================================== */}
      <FullWidthCheckerboard darkColor="#E8DFC8" lightColor="#F6F1E8" />

      {/* ======================================================== */}
      {/* 10. CUSTOMER REVIEWS ("A FEW WORDS FROM OUR PEOPLE.")    */}
      {/* ======================================================== */}
      <section id="reviews" className="py-20 lg:py-28 bg-[#F6F1E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-2">
            <p className="text-xs font-bold tracking-[0.25em] text-[#8C6D4F] uppercase">
              CUSTOMER REVIEWS
            </p>
            <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase text-[#241711] tracking-tight">
              A FEW WORDS FROM OUR PEOPLE.
            </h2>
          </div>

          {/* Big Featured Testimonial Card */}
          <div className="bg-[#FDFBF7] border-3 border-[#241711] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#241711]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Customer Photo */}
              <div className="lg:col-span-5">
                <img
                  src={REVIEWS_DATA[activeReviewIndex].image}
                  alt={REVIEWS_DATA[activeReviewIndex].name}
                  className="rounded-2xl border-2 border-[#241711] w-full h-72 sm:h-80 object-cover shadow-[4px_4px_0px_#241711]"
                />
              </div>

              {/* Review Content */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                {/* 5 Stars and Quote Marks */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#EBC758] text-lg">
                    {'★★★★★'}
                  </div>
                  <span className="text-5xl font-serif text-[#C4B7E5] leading-none select-none">
                    “
                  </span>
                </div>

                <p className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase text-[#241711] leading-tight">
                  {REVIEWS_DATA[activeReviewIndex].quote}
                </p>

                {/* Arrows and Author */}
                <div className="pt-4 flex items-center justify-between border-t border-[#E8DFC8]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setActiveReviewIndex((prev) =>
                          prev === 0 ? REVIEWS_DATA.length - 1 : prev - 1
                        )
                      }
                      className="w-9 h-9 rounded-full bg-[#EBC758] text-[#241711] border-2 border-[#241711] flex items-center justify-center hover:scale-105 transition-transform"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveReviewIndex((prev) => (prev + 1) % REVIEWS_DATA.length)
                      }
                      className="w-9 h-9 rounded-full bg-[#241711] text-[#F6F1E8] border-2 border-[#241711] flex items-center justify-center hover:scale-105 transition-transform"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-heading text-lg font-extrabold text-[#241711] uppercase">
                      {REVIEWS_DATA[activeReviewIndex].name}
                    </p>
                    <p className="text-xs text-[#8C6D4F]">
                      {REVIEWS_DATA[activeReviewIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3 Customer Snippets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {REVIEWS_DATA.map((rev, i) => (
              <div
                key={i}
                onClick={() => setActiveReviewIndex(i)}
                className="p-4 rounded-2xl border-2 border-[#241711] bg-[#FDFBF7] shadow-[2px_2px_0px_#241711] space-y-2 cursor-pointer hover:bg-[#EBC758]/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#EBC758] border border-[#241711] font-bold text-xs flex items-center justify-center text-[#241711]">
                    {rev.name[0]}
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-[#241711] uppercase leading-none">
                      {rev.name}
                    </p>
                    <p className="text-[10px] text-[#8C6D4F]">{rev.role}</p>
                  </div>
                </div>
                <p className="text-xs text-[#5D4A3D] line-clamp-3 italic">
                  {rev.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. YELLOW TICKER MARQUEE RIBBON                         */}
      {/* ======================================================== */}
      <div className="bg-[#EBC758] text-[#241711] py-3.5 border-y-2 border-[#241711] overflow-hidden whitespace-nowrap">
        <div className="animate-marquee font-heading text-2xl sm:text-3xl font-extrabold tracking-wider uppercase flex items-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <React.Fragment key={i}>
              <span className="mx-6">BEANS</span>
              <span className="text-lg">✱</span>
              <span className="mx-6">COFFEE</span>
              <span className="text-lg">✱</span>
              <span className="mx-6">LATTE</span>
              <span className="text-lg">✱</span>
              <span className="mx-6">CAPPUCCINO</span>
              <span className="text-lg">✱</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 12. FOOTER & LOCATION SECTION (DARK ESPRESSO CHOCOLATE)  */}
      {/* ======================================================== */}
      <footer id="location" className="bg-[#241711] text-[#F6F1E8] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Top Half: Floating Cup Visual & Location Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Coffee Visual */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <img
                src="/src/assets/images/hero_iced_frappes_1791264105968.jpg"
                alt="The Daily Cup Signature Drinks"
                className="max-h-64 sm:max-h-72 w-auto object-contain rounded-2xl drop-shadow-2xl"
              />
            </div>

            {/* Right Location & Hours Cards */}
            <div className="lg:col-span-7 space-y-4">
              {/* Address Card (Cream) */}
              <div className="bg-[#FDFBF7] text-[#241711] rounded-2xl p-6 border-2 border-[#241711] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[4px_4px_0px_#EBC758]">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-[#8C6D4F] uppercase tracking-wider">
                    THE DAILY CUP IS HERE
                  </p>
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#241711] uppercase leading-snug">
                    {CAFE_INFO.address}
                  </h3>
                  <p className="text-xs text-[#5D4A3D]">
                    Landmark: Near Sardar Patel School, Delhi • Ph: {CAFE_INFO.phone}
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <a
                    href={generateWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#241711] text-[#F6F1E8] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>SAY HELLO</span>
                  </a>
                  <a
                    href={CAFE_INFO.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-[#241711] text-[#241711] font-bold text-[11px] uppercase tracking-wider text-center hover:bg-[#EBC758] transition-colors"
                  >
                    Open Map
                  </a>
                </div>
              </div>

              {/* Hours Card (Butter Yellow) */}
              <div className="bg-[#EBC758] text-[#241711] rounded-2xl p-6 border-2 border-[#241711] flex items-center justify-between shadow-[4px_4px_0px_#241711]">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-[#241711]/70 uppercase tracking-wider">
                    SEE YOU THERE
                  </p>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#241711] uppercase leading-none">
                    MONDAY — SUNDAY <br />
                    10:30 AM — 11:00 PM
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#241711] bg-white flex items-center justify-center text-[#241711] shrink-0">
                  <Clock className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: Footer Links & Socials */}
          <div className="pt-10 border-t border-[#463529] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-xs text-[#CDBEAA]">
            {/* Logo and Tagline */}
            <div className="space-y-2 max-w-sm">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#FDFBF7] tracking-tight">
                THE DAILY CUP
              </span>
              <p className="text-xs text-[#CDBEAA]">
                Good coffee. Slow moments. A place worth coming back to in Karawal Nagar, Delhi.
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-8 text-xs font-bold uppercase tracking-wider text-[#FDFBF7]">
              <div className="space-y-2">
                <p className="text-[10px] text-[#EBC758] tracking-[0.2em]">QUICK LINK</p>
                <p><a href="#signature" className="hover:text-[#EBC758]">Menu</a></p>
                <p><a href="#about" className="hover:text-[#EBC758]">Our Story</a></p>
                <p><a href="#experience" className="hover:text-[#EBC758]">Cafe</a></p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-[#EBC758] tracking-[0.2em]">VISIT</p>
                <p><a href="#location" className="hover:text-[#EBC758]">Find Us</a></p>
                <p><a href="#location" className="hover:text-[#EBC758]">Opening Hours</a></p>
                <p><a href={`tel:${CAFE_INFO.phone}`} className="hover:text-[#EBC758]">{CAFE_INFO.phone}</a></p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#38281E] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C6D4F]">
            <p>© {new Date().getFullYear()} The Daily Cup Cafe. All rights reserved.</p>
            <p>Direct Inquiries & WhatsApp: +91 {CAFE_INFO.phone}</p>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* FLOATING WHATSAPP BUTTON (Pinned Bottom Right)           */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={generateWhatsAppOrderUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#EBC758] text-[#241711] border-2 border-[#241711] shadow-[3px_3px_0px_#241711] hover:scale-105 transition-transform cursor-pointer font-bold text-xs uppercase tracking-wider"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">Order WhatsApp</span>
          {cartItemCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#241711] text-[#EBC758] text-[10px] font-extrabold flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </a>
      </div>

      {/* ======================================================== */}
      {/* CART DRAWER SLIDE-OVER                                   */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#F6F1E8] border-l-3 border-[#241711] text-[#241711] flex flex-col shadow-2xl">
              {/* Drawer Header */}
              <div className="p-5 border-b-2 border-[#241711] flex items-center justify-between bg-[#EBC758]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#241711] flex items-center justify-center text-[#EBC758]">
                    <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-extrabold uppercase text-[#241711] leading-none">
                      YOUR CAFE ORDER
                    </h3>
                    <p className="text-[11px] font-bold text-[#5D4A3D]">
                      {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-black/10 text-[#241711]"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {cartItemCount === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <ShoppingBag className="w-12 h-12 text-[#8C6D4F] mx-auto stroke-[1.5]" />
                    <p className="font-heading text-2xl font-extrabold uppercase text-[#241711]">
                      YOUR ORDER IS EMPTY
                    </p>
                    <p className="text-xs text-[#5D4A3D] max-w-xs mx-auto">
                      Explore our handcrafted signature drinks, wood-fired styled pizzas, and combos!
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2.5 rounded-full bg-[#EBC758] border-2 border-[#241711] text-[#241711] text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#241711]"
                    >
                      BROWSE MENU
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {Object.entries(cart).map(([id, count]) => {
                        let name = id;
                        let price = 149;
                        const item = MENU_ITEMS.find((m) => m.id === id);
                        if (item) {
                          name = item.name;
                          price = item.price;
                        } else if (id === 'drink-classic-black') {
                          name = 'Classic Black Iced Coffee';
                          price = 129;
                        } else if (id === 'drink-caramel-flavour') {
                          name = `Caramel Flavour Frappe (${selectedSize})`;
                          price = 149;
                        } else if (id === 'drink-vanilla-flavour') {
                          name = 'Vanilla Flavour Cold Foam';
                          price = 139;
                        } else if (id === 'drink-hazelnut-flavour') {
                          name = 'Hazelnut Flavour Iced Latte';
                          price = 139;
                        }

                        return (
                          <div
                            key={id}
                            className="p-3.5 rounded-2xl bg-[#FDFBF7] border-2 border-[#241711] flex items-center justify-between gap-3 shadow-[2px_2px_0px_#241711]"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-heading text-base font-extrabold text-[#241711] uppercase truncate">
                                {name}
                              </p>
                              <p className="text-xs text-[#5D4A3D]">
                                ₹{price} each · <span className="font-bold text-[#241711]">₹{price * count}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-[#F6F1E8] rounded-full border border-[#241711] p-0.5">
                                <button
                                  onClick={() => updateQuantity(id, -1)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#241711] hover:bg-[#EBC758]"
                                  aria-label="Decrease"
                                >
                                  <Minus className="w-3 h-3 stroke-[2.5]" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold">
                                  {count}
                                </span>
                                <button
                                  onClick={() => updateQuantity(id, 1)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#241711] hover:bg-[#EBC758]"
                                  aria-label="Increase"
                                >
                                  <Plus className="w-3 h-3 stroke-[2.5]" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(id)}
                                className="p-1.5 text-[#8C6D4F] hover:text-red-500"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Details */}
                    <div className="p-4 rounded-2xl bg-[#FDFBF7] border-2 border-[#241711] space-y-3 shadow-[2px_2px_0px_#241711]">
                      <p className="text-[10px] font-bold text-[#8C6D4F] uppercase tracking-wider">
                        ORDER OPTIONS
                      </p>

                      <div className="grid grid-cols-3 gap-2">
                        {(['Dine-in', 'Takeaway', 'Delivery'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setOrderType(type)}
                            className={`py-1.5 rounded-full text-xs font-bold uppercase border border-[#241711] transition-all ${
                              orderType === type
                                ? 'bg-[#241711] text-[#F6F1E8]'
                                : 'bg-transparent text-[#241711] hover:bg-[#EBC758]'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-[#5D4A3D] uppercase">
                          Your Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Karan"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#F6F1E8] border border-[#241711] text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-[#5D4A3D] uppercase">
                          Table No. or Notes (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Table 4 / Less Ice"
                          value={orderNote}
                          onChange={(e) => setOrderNote(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#F6F1E8] border border-[#241711] text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer */}
              {cartItemCount > 0 && (
                <div className="p-5 border-t-2 border-[#241711] bg-[#FDFBF7] space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-heading text-lg font-bold text-[#5D4A3D] uppercase">
                      TOTAL AMOUNT
                    </span>
                    <span className="font-heading text-3xl font-extrabold text-[#241711]">
                      ₹{cartSubtotal}
                    </span>
                  </div>

                  <a
                    href={generateWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-full bg-[#EBC758] text-[#241711] border-2 border-[#241711] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_#241711] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>SEND ORDER TO WHATSAPP</span>
                  </a>

                  <p className="text-[10px] text-center text-[#8C6D4F]">
                    Karawal Nagar Branch • 9958120122
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TABLE RESERVATION MODAL                                  */}
      {/* ======================================================== */}
      {isReservationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsReservationOpen(false)}
          />

          <div className="relative max-w-lg w-full rounded-3xl bg-[#F6F1E8] border-3 border-[#241711] p-6 sm:p-8 shadow-[8px_8px_0px_#241711] z-10 space-y-5 animate-fade-in text-[#241711]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#241711]">
              <div>
                <p className="text-[10px] font-bold text-[#8C6D4F] uppercase tracking-wider">
                  THE DAILY CUP CAFE
                </p>
                <h3 className="font-heading text-3xl font-extrabold uppercase text-[#241711] leading-none">
                  RESERVE YOUR TABLE
                </h3>
              </div>
              <button
                onClick={() => setIsReservationOpen(false)}
                className="p-1 rounded-full hover:bg-black/10"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {resSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EBC758] border-2 border-[#241711] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <p className="font-heading text-2xl font-extrabold uppercase">
                  OPENING WHATSAPP TO CONFIRM...
                </p>
                <p className="text-xs text-[#5D4A3D]">
                  Your table reservation is being routed directly to the cafe counter.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReservationSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-[#5D4A3D]">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border-2 border-[#241711] text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-[#5D4A3D]">
                      Time
                    </label>
                    <input
                      type="time"
                      required
                      value={resTime}
                      onChange={(e) => setResTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border-2 border-[#241711] text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-[#5D4A3D]">
                      Guests
                    </label>
                    <select
                      value={resGuests}
                      onChange={(e) => setResGuests(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border-2 border-[#241711] text-xs font-bold"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="4">4 Persons</option>
                      <option value="6">6 Persons</option>
                      <option value="8+">8+ Party</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase text-[#5D4A3D]">
                      Occasion
                    </label>
                    <select
                      value={resOccasion}
                      onChange={(e) => setResOccasion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border-2 border-[#241711] text-xs font-bold"
                    >
                      <option value="Casual Hangout">Casual Hangout</option>
                      <option value="Birthday Celebration">Birthday 🎂</option>
                      <option value="Romantic Date">Date ❤️</option>
                      <option value="Work / Study">Work / Study 💻</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-[#5D4A3D]">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karan"
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border-2 border-[#241711] text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-[#5D4A3D]">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9958120122"
                    value={resPhone}
                    onChange={(e) => setResPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border-2 border-[#241711] text-xs font-bold"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReservationOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold uppercase text-[#5D4A3D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#EBC758] text-[#241711] border-2 border-[#241711] font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#241711] flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>CONFIRM ON WHATSAPP</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
