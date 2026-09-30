import React from 'react';
import { Heart, Star, Sparkles, ShoppingBag, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, formatNumber } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onTryOn: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
  onTryOn,
  onToggleWishlist,
  isWishlisted,
}) => {
  const genderLabel =
    product.gender === 'girls'
      ? 'دخترانه'
      : product.gender === 'boys'
      ? 'پسرانه'
      : product.gender;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-lg hover:border-neutral-300 transition-all duration-200">
      
      {/* 1. Realistic Product Image Area */}
      <div className="relative aspect-square w-full bg-[#F5F4EE] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Quiet Top Metadata Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-start">
          {product.isNew && (
            <div className="bg-neutral-900/85 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
              جدید
            </div>
          )}
          {product.sourceStore && (
            <div className="bg-white/90 backdrop-blur-sm text-neutral-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border border-neutral-200/80 shadow-2xs">
              {product.sourceStore}
            </div>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/85 text-neutral-600 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Color Indicators (Discreet at bottom right of image) */}
        {product.colors && product.colors.length > 0 && (
          <div className="absolute bottom-2.5 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-1 rounded-md">
            {product.colors.map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Product Meta & Pricing Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category line */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="font-medium text-neutral-600">{product.brand}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400">{genderLabel}</span>
              {product.productUrl && (
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-neutral-400 hover:text-neutral-900 transition-colors"
                  title="مشاهده صفحه رسمی در سایت مبدا"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewProduct(product)}
            className="text-[14px] sm:text-[15px] font-semibold text-neutral-900 leading-snug line-clamp-1 hover:text-amber-900 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-neutral-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-medium text-neutral-700">{product.rating}</span>
            <span className="text-neutral-400 text-[11px]">({formatNumber(product.reviewsCount)})</span>
          </div>

          {/* Pricing (Preserving source currency: SEK or Tomans) */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base font-bold text-neutral-900 tracking-tight">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.oldPrice, product.currency)}
              </span>
            )}
          </div>
        </div>

        {/* 3. Action Buttons: [مشاهده و خرید] & [پرو لباس] */}
        <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewProduct(product)}
            className="w-full py-2 px-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 active:bg-neutral-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>مشاهده و خرید</span>
          </button>

          <button
            onClick={() => onTryOn(product)}
            className="w-full py-2 px-2.5 text-xs font-semibold text-amber-900 bg-amber-100/90 hover:bg-amber-200 active:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-2xs group-hover:bg-amber-500 group-hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:text-white" />
            <span>پرو لباس</span>
          </button>
        </div>
      </div>
    </div>
  );
};
