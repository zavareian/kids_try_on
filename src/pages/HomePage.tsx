import React from 'react';
import { Product, CategoryInfo } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { CategoryCard } from '../components/CategoryCard';
import { Sparkles, ArrowLeft, ShieldCheck, Heart, Sparkle } from 'lucide-react';
import heroImg from '../assets/images/hero_kids_fashion_1790665862453.jpg';

interface HomePageProps {
  products: Product[];
  categories: CategoryInfo[];
  onViewProduct: (product: Product) => void;
  onTryOn: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onNavigateShop: (catId?: string) => void;
  onNavigateTryOn: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  onViewProduct,
  onTryOn,
  onToggleWishlist,
  wishlistIds,
  onNavigateShop,
  onNavigateTryOn,
}) => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Hero Campaign Banner (Requirement #8) */}
      <section className="relative overflow-hidden bg-neutral-100 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-neutral-200/80 shadow-xs">
        <div className="relative aspect-16/9 min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="لباس‌های شیک و باکیفیت کودک شاپرک کیدز"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle contrast gradient for clean legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent sm:w-2/3" />
          
          {/* Hero Content Overlay */}
          <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-center max-w-xl text-white">
            
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 mb-3 tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>کالکشن جدید پاییز و زمستان ۱۴۰۳</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-balance">
              لباس‌هایی برای لحظه‌های زیبای کودکی
            </h1>

            <p className="mt-4 text-xs sm:text-base text-neutral-200 leading-relaxed font-light">
              پوشاک نرم، ارگانیک و باکیفیت طراحی‌شده برای لطافت پوست کودک. اکنون می‌توانید قبل از خرید، تن‌خور هر لباسی را به‌صورت آنلاین روی عکس دلبندتان پرو کنید.
            </p>

            {/* Two Action Buttons (Requirement #8) */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigateShop()}
                className="px-6 py-3.5 bg-white text-neutral-900 rounded-2xl text-xs sm:text-sm font-bold hover:bg-neutral-100 transition-all shadow-md active:scale-98 whitespace-nowrap"
              >
                مشاهده محصولات
              </button>

              <button
                onClick={onNavigateTryOn}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98 flex items-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-amber-100" />
                <span>پرو لباس مجازی</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Categories Showcase (Requirement #9) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              دسته‌بندی‌های لباس کودک
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              مجموعه‌ای کامل از بهترین پوشاک دخترانه، پسرانه و ست‌های راحتی
            </p>
          </div>
          <button
            onClick={() => onNavigateShop()}
            className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-amber-900 flex items-center gap-1 transition-colors"
          >
            <span>مشاهده همه دسته‌ها</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onClick={(c) => onNavigateShop(c.id)}
            />
          ))}
        </div>
      </section>

      {/* 3. Featured / Newest Products (Requirement #10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              جدیدترین محصولات
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              تولیدات اختصاصی شاپرک کیدز با بالاترین استاندارد کیفی و دوخت تمیز
            </p>
          </div>
          <button
            onClick={() => onNavigateShop()}
            className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-amber-900 flex items-center gap-1 transition-colors"
          >
            <span>مشاهده همه محصولات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <ProductGrid
          products={featuredProducts}
          onViewProduct={onViewProduct}
          onTryOn={onTryOn}
          onToggleWishlist={onToggleWishlist}
          wishlistIds={wishlistIds}
        />
      </section>

      {/* 4. Interactive Virtual Try-On Highlight Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-50 via-amber-100/50 to-orange-50 border border-amber-200/90 rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xs">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>فناوری اختصاصی شاپرک کیدز</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-amber-950 leading-tight">
              دیگر نگران تناسب و تن‌خور لباس کودک خود نباشید!
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              با دستیار هوشمند پرو لباس مجازی، کافی است یک بار عکس کودک خود را آپلود کنید و هر کدام از لباس‌های فروشگاه را به سادگی روی تن او تماشا کنید.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-amber-950">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-amber-200/60">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-white inline-flex items-center justify-center text-xs font-bold mb-2">
                  ۱
                </span>
                <div className="font-bold">آپلود عکس کودک</div>
                <div className="text-[11px] text-amber-800 font-normal mt-1">با گوشی یا دوربین در نور طبیعی</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-amber-200/60">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-white inline-flex items-center justify-center text-xs font-bold mb-2">
                  ۲
                </span>
                <div className="font-bold">انتخاب یا درگ لباس</div>
                <div className="text-[11px] text-amber-800 font-normal mt-1">از بین ده‌ها مدل روز فروشگاه</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-amber-200/60">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-white inline-flex items-center justify-center text-xs font-bold mb-2">
                  ۳
                </span>
                <div className="font-bold">مشاهده تن‌خور واقعی</div>
                <div className="text-[11px] text-amber-800 font-normal mt-1">تطبیق هوشمند سایز و بافت پارچه</div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onNavigateTryOn}
                className="px-7 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ورود به استودیوی پرو لباس مجازی</span>
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
