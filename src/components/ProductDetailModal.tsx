import React, { useState } from 'react';
import { X, Heart, Star, Sparkles, ShoppingBag, ShieldCheck, Truck, RotateCcw, Ruler, Check, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, formatNumber } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }, qty: number) => void;
  onTryOn: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onTryOn,
  onToggleWishlist,
  isWishlisted,
  onOpenSizeGuide,
}) => {
  if (!isOpen || !product) return null;

  const [selectedImg, setSelectedImg] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'پیش‌فرض', hex: '#666' });
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'تک‌سایز');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>{product.brand}</span>
            <span>/</span>
            <span>{product.gender}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Gallery (Sticky left in LTR / right in RTL) + Purchase Module */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#F5F4EE] border border-neutral-200/80">
              <img
                src={selectedImg}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImg === img ? 'border-neutral-900' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Virtual Try-On Banner Callout directly under image */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>می‌خواهید تن‌خور این لباس را روی کودک خود ببینید؟</span>
                </h5>
                <p className="text-[11px] text-amber-900/80 mt-1">
                  عکس کودک خود را بارگذاری کنید و این لباس را به‌صورت مجازی پرو نمایید!
                </p>
              </div>
              <button
                onClick={() => {
                  onTryOn(product);
                  onClose();
                }}
                className="shrink-0 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap"
              >
                پرو مجازی این لباس
              </button>
            </div>
          </div>

          {/* Details & Purchase Module Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
                {product.name}
              </h1>

              {/* Brand and Source */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-neutral-600">
                <span>برند: <strong className="text-neutral-900">{product.brand}</strong></span>
                {product.sourceStore && (
                  <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px] font-medium border border-neutral-200/60">
                    منبع کاتالوگ: {product.sourceStore}
                  </span>
                )}
                {product.productUrl && (
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 text-[11px] font-medium transition-colors"
                  >
                    <span>صفحه رسمی محصول در فروشگاه مبدا</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-neutral-800">{product.rating}</span>
                  <span className="text-neutral-400">({formatNumber(product.reviewsCount)} نظر ثبت شده)</span>
                </div>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                  موجود در انبار
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-black text-neutral-900 tracking-tight">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.oldPrice, product.currency)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2">
                    <span>انتخاب رنگ:</span>
                    <span className="text-neutral-500 font-normal">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor.name === c.name ? 'border-neutral-900 scale-110 shadow-sm' : 'border-transparent'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2">
                  <span>انتخاب سایز:</span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-amber-800 hover:text-amber-950 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>راهنمای سایز کودک</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                        selectedSize === s
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-neutral-50/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specifications Table */}
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <h4 className="text-xs font-bold text-neutral-900 mb-3">مشخصات و ویژگی‌ها:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="bg-neutral-50 p-2.5 rounded-xl flex items-center justify-between">
                      <span className="text-neutral-500">{key}:</span>
                      <span className="font-semibold text-neutral-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Stepper + Add to Cart + Wishlist */}
            <div className="pt-6 border-t border-neutral-100 space-y-3">
              <div className="flex items-center gap-3">
                
                {/* Quantity */}
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 text-xs text-neutral-700 hover:bg-neutral-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-neutral-900 bg-white">
                    {formatNumber(quantity)}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2.5 text-xs text-neutral-700 hover:bg-neutral-200 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add To Cart Button */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedAnimation
                      ? 'bg-emerald-700 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>به سبد خرید افزوده شد!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>افزودن به سبد خرید</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-neutral-200 hover:border-neutral-400 text-neutral-700'
                  }`}
                  aria-label="افزودن به علاقه‌مندی‌ها"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-neutral-500 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>ارسال سریع</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                  <span>۷ روز ضمانت بازگشت</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>تضمین اصالت پارچه</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
