/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRODUCTS } from './data/products';
import { CATEGORIES } from './data/categories';
import { Product, CartItem } from './types';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchBar } from './components/SearchBar';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AccountModal } from './components/AccountModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { VirtualTryOnPage } from './pages/VirtualTryOnPage';
import { CartPage } from './pages/CartPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>('all');
  
  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      selectedSize: '۴-۵ سال',
      selectedColor: PRODUCTS[0].colors[0],
      quantity: 1,
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set([PRODUCTS[1].id]));

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Active product selections
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [productForTryOn, setProductForTryOn] = useState<Product | null>(PRODUCTS[0]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Navigation handler
  const handleNavigate = (tab: string, categoryFilter?: string) => {
    setCurrentTab(tab);
    if (categoryFilter) {
      setShopCategoryFilter(categoryFilter);
    } else if (tab === 'shop') {
      setShopCategoryFilter('all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to cart handler
  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: { name: string; hex: string },
    qty: number = 1
  ) => {
    const chosenSize = size || product.sizes[0] || 'تک سایز';
    const chosenColor = color || product.colors[0] || { name: 'پیش‌فرض', hex: '#333' };

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor.hex === chosenColor.hex
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += qty;
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            selectedSize: chosenSize,
            selectedColor: chosenColor,
            quantity: qty,
          },
        ];
      }
    });

    showToast(`«${product.name}» به سبد خرید اضافه شد.`);
  };

  // Update cart item quantity
  const handleUpdateCartQuantity = (
    productId: string,
    size: string,
    colorHex: string,
    delta: number
  ) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.hex === colorHex
          ) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Remove item from cart
  const handleRemoveCartItem = (productId: string, size: string, colorHex: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.hex === colorHex
          )
      )
    );
  };

  // Wishlist toggle handler
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`«${product.name}» از لیست علاقه‌مندی‌ها حذف شد.`);
      } else {
        next.add(product.id);
        showToast(`«${product.name}» به لیست علاقه‌مندی‌ها افزوده شد.`);
      }
      return next;
    });
  };

  // Trigger try-on for a product
  const handleTryOnProduct = (product: Product) => {
    setProductForTryOn(product);
    setCurrentTab('virtual-try-on');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.has(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-neutral-800 selection:bg-amber-100 selection:text-amber-900 font-sans">
      
      {/* 1. Slim Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Header Navigation */}
      <Header
        currentTab={currentTab}
        activeCategory={shopCategoryFilter}
        onNavigate={handleNavigate}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* 3. Main Views Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            products={PRODUCTS}
            categories={CATEGORIES}
            onViewProduct={(p) => setSelectedProductForDetail(p)}
            onTryOn={handleTryOnProduct}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onNavigateShop={(cat) => handleNavigate('shop', cat)}
            onNavigateTryOn={() => handleNavigate('virtual-try-on')}
          />
        )}

        {currentTab === 'shop' && (
          <ShopPage
            products={PRODUCTS}
            initialCategory={shopCategoryFilter}
            onViewProduct={(p) => setSelectedProductForDetail(p)}
            onTryOn={handleTryOnProduct}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}

        {currentTab === 'virtual-try-on' && (
          <VirtualTryOnPage
            products={PRODUCTS}
            initialProduct={productForTryOn}
            onViewProduct={(p) => setSelectedProductForDetail(p)}
            onAddToCart={(p) => handleAddToCart(p)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'cart' && (
          <CartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onNavigateShop={() => handleNavigate('shop')}
          />
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onNavigateShop={() => handleNavigate('shop')}
        onNavigateTryOn={() => handleNavigate('virtual-try-on')}
      />

      {/* 5. Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setCartItems([]);
          showToast('سفارش آزمایشی شما با موفقیت ثبت شد!');
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistedProducts}
        onRemove={(id) => {
          const prod = PRODUCTS.find((p) => p.id === id);
          if (prod) handleToggleWishlist(prod);
        }}
        onAddToCart={(p) => handleAddToCart(p)}
        onTryOn={handleTryOnProduct}
      />

      <SearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setSelectedProductForDetail(p)}
        onTryOnProduct={handleTryOnProduct}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart}
        onTryOn={handleTryOnProduct}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProductForDetail ? wishlistIds.has(selectedProductForDetail.id) : false}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl border border-neutral-800 animate-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
