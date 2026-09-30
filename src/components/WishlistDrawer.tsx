import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onTryOn: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onAddToCart,
  onTryOn,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-base font-bold text-neutral-900">لیست علاقه‌مندی‌ها</h3>
            <span className="text-xs text-neutral-500 font-medium">({items.length} کالا)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-300 mb-4">
                <Heart className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="text-base font-semibold text-neutral-800">
                لیست علاقه‌مندی‌ها خالی است
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                با کلیک روی آیکون قلب در کنار هر محصول، لباس‌های مورد علاقه خود را اینجا ذخیره کنید.
              </p>
            </div>
          ) : (
            items.map((product) => (
              <div key={product.id} className="py-4 flex gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-neutral-100 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemove(product.id)}
                        className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {product.brand} · <span className="font-semibold text-neutral-800">{formatPrice(product.price, product.currency)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-1 py-1.5 px-2 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>افزودن به سبد</span>
                    </button>
                    <button
                      onClick={() => {
                        onTryOn(product);
                        onClose();
                      }}
                      className="py-1.5 px-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100"
                    >
                      پرو مجازی
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
