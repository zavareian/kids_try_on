import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, Sparkles } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

interface HeaderProps {
  currentTab: string;
  activeCategory?: string;
  onNavigate: (tab: string, categoryFilter?: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  activeCategory = 'all',
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact navigation structure requested:
  // خانه, فروشگاه, دخترانه, پسرانه, پرو مجازی, سبد خرید, حساب کاربری
  const navLinks = [
    { id: 'home', label: 'خانه', tab: 'home' },
    { id: 'shop', label: 'فروشگاه', tab: 'shop', category: 'all' },
    { id: 'girls', label: 'دخترانه', tab: 'shop', category: 'girls' },
    { id: 'boys', label: 'پسرانه', tab: 'shop', category: 'boys' },
    { id: 'virtual-try-on', label: 'پرو مجازی', tab: 'virtual-try-on', isSpecial: true },
    { id: 'cart', label: 'سبد خرید', tab: 'cart', showBadge: true },
    { id: 'account', label: 'حساب کاربری', isAccountAction: true },
  ];

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (link.id === 'home') {
      return currentTab === 'home';
    }
    if (link.id === 'girls') {
      return currentTab === 'shop' && activeCategory === 'girls';
    }
    if (link.id === 'boys') {
      return currentTab === 'shop' && activeCategory === 'boys';
    }
    if (link.id === 'shop') {
      return currentTab === 'shop' && (activeCategory === 'all' || !activeCategory || (activeCategory !== 'girls' && activeCategory !== 'boys'));
    }
    if (link.id === 'virtual-try-on') {
      return currentTab === 'virtual-try-on';
    }
    if (link.id === 'cart') {
      return currentTab === 'cart';
    }
    return false;
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isAccountAction) {
      onOpenAccount();
    } else if (link.tab === 'shop' && link.category) {
      onNavigate('shop', link.category);
    } else if (link.tab) {
      onNavigate(link.tab);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-neutral-200/80 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Zone 1 (Right in RTL): Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-right group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-amber-800 transition-colors">
                ش
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-neutral-900 leading-none">
                  شاپرک کیدز
                </span>
                <span className="text-[11px] text-neutral-500 font-normal tracking-wide mt-1">
                  بوتیک مدرن لباس کودک
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2 (Center in RTL): Primary Top Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 lg:gap-3">
            {navLinks.map((link) => {
              const active = isLinkActive(link);

              if (link.isSpecial) {
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link)}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      active
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100/90 border border-amber-200/80'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${active ? 'text-amber-100' : 'text-amber-600 animate-pulse'}`} />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    active
                      ? 'text-neutral-900 font-bold bg-neutral-100/80'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 font-medium'
                  }`}
                >
                  <span>{link.label}</span>
                  
                  {link.showBadge && cartCount > 0 && (
                    <span className="bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center leading-none">
                      {formatNumber(cartCount)}
                    </span>
                  )}

                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-neutral-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3 (Left in RTL): Interactive Action Affordances */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="جستجو در محصولات"
              title="جستجو"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="علاقه‌مندی‌ها"
              title="علاقه‌مندی‌ها"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {formatNumber(wishlistCount)}
                </span>
              )}
            </button>

            {/* Quick Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-neutral-800 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="سبد خرید"
              title="مشاهده سبد خرید"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute top-1 -right-0.5 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {formatNumber(cartCount)}
                </span>
              )}
            </button>

            {/* User Account Button */}
            <button
              onClick={onOpenAccount}
              className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="حساب کاربری"
              title="حساب کاربری"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="منوی دسترسی سریع"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-[#FAF9F6] px-4 pt-3 pb-6 shadow-xl transition-all">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`flex items-center justify-between text-right px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    link.isSpecial
                      ? active
                        ? 'bg-amber-500 text-white font-bold'
                        : 'bg-amber-100/90 text-amber-950 font-semibold'
                      : active
                      ? 'bg-neutral-900 text-white font-bold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {link.isSpecial && <Sparkles className="w-4 h-4" />}
                    <span>{link.label}</span>
                  </div>

                  {link.showBadge && cartCount > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      active ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                    }`}>
                      {formatNumber(cartCount)}
                    </span>
                  )}
                  {link.isSpecial && !active && (
                    <span className="text-[11px] bg-amber-500 text-white px-2 py-0.5 rounded-md font-normal">
                      ویژه
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
