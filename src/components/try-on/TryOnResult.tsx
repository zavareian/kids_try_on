import React, { useState } from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { Sparkles, ShoppingBag, Eye, RefreshCw, Camera, CheckCircle2, SplitSquareHorizontal } from 'lucide-react';

interface TryOnResultProps {
  originalChildImage: string;
  generatedTryOnImage: string;
  product: Product;
  onTryAnotherCloth: () => void;
  onChangePhoto: () => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const TryOnResult: React.FC<TryOnResultProps> = ({
  originalChildImage,
  generatedTryOnImage,
  product,
  onTryAnotherCloth,
  onChangePhoto,
  onViewProduct,
  onAddToCart,
}) => {
  const [activeView, setActiveView] = useState<'result' | 'original'>('result');

  const displayedImage = activeView === 'result' ? generatedTryOnImage : originalChildImage;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-8 max-w-4xl mx-auto shadow-sm">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              پرو لباس آماده شد
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              تصویر اختصاصی تولیدشده توسط هوش مصنوعی با لباس «{product.name}»
            </p>
          </div>
        </div>

        {/* View Toggle: «نتیجه پرو» vs «عکس اصلی» */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs">
          <button
            onClick={() => setActiveView('result')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
              activeView === 'result'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            نتیجه پرو هوشمند
          </button>
          <button
            onClick={() => setActiveView('original')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
              activeView === 'original'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            عکس اصلی کودک
          </button>
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Full Photorealistic Image (NO composite overlays) */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-3/4 rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-[#FAF9F6]">
            <img
              src={displayedImage}
              alt={activeView === 'result' ? 'نتیجه پرو نهایی' : 'عکس اولیه کودک'}
              className="w-full h-full object-cover object-top transition-opacity duration-300"
            />

            {/* Mode Indicator badge */}
            <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>
                {activeView === 'result'
                  ? 'رندر کامل Nano Banana'
                  : 'عکس خام بارگذاری‌شده'}
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
            <span>با دکمه‌های بالا بین عکس اصلی و نتیجه پرو جابه‌جا شوید.</span>
          </div>
        </div>

        {/* Right Column: Garment Details & The 4 Action Buttons */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Garment Details Card */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex items-start gap-3.5">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover bg-white border border-neutral-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] text-neutral-400 block">{product.brand}</span>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 mt-0.5">
                  {product.name}
                </h4>
                <div className="text-xs sm:text-sm font-bold text-neutral-900 mt-1">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>

            {/* Required Action 4: [ افزودن به سبد خرید ] */}
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>افزودن به سبد خرید</span>
            </button>

            {/* Required Action 3: [ مشاهده محصول ] */}
            <button
              onClick={() => onViewProduct(product)}
              className="w-full py-3 px-4 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>مشاهده محصول</span>
            </button>
          </div>

          {/* Secondary Required Actions: [ پرو لباس دیگر ] & [ تغییر عکس کودک ] */}
          <div className="pt-5 border-t border-neutral-100 grid grid-cols-2 gap-2.5">
            <button
              onClick={onTryAnotherCloth}
              className="py-2.5 px-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>پرو لباس دیگر</span>
            </button>

            <button
              onClick={onChangePhoto}
              className="py-2.5 px-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>تغییر عکس کودک</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
