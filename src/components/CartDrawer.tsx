import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice, formatNumber } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, colorHex: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string, colorHex: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 1000000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleSimulateCheckout = () => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      setShowCheckoutSuccess(false);
      onCheckout();
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            <h3 className="text-base font-bold text-neutral-900">سبد خرید شما</h3>
            <span className="text-xs text-neutral-500 font-medium">
              ({formatNumber(items.length)} قلم)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-100/70">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-amber-950">
            {isFreeShipping ? (
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                سفارش شما مشمول ارسال رایگان شد!
              </span>
            ) : (
              <span>
                فقط {formatPrice(freeShippingThreshold - subtotal)} تا{' '}
                <strong className="text-amber-900">ارسال رایگان</strong>
              </span>
            )}
            <span className="text-[11px] text-amber-800 font-bold">
              {formatNumber(Math.round(progressToFreeShipping))}٪
            </span>
          </div>
          <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isFreeShipping ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="text-base font-semibold text-neutral-800">
                سبد خرید شما خالی است
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                جدیدترین لباس‌های باکیفیت و ارگانیک کودک را کشف کنید یا استایل مورد نظرتان را مجازی پرو کنید.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                شروع گشت‌وگذار در فروشگاه
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}-${index}`} className="py-4 flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-neutral-100 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() =>
                          onRemoveItem(item.product.id, item.selectedSize, item.selectedColor.hex)
                        }
                        className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                        title="حذف از سبد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                      <span>سایز: {item.selectedSize}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        رنگ:
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, -1)
                        }
                        className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold text-neutral-900 bg-white">
                        {formatNumber(item.quantity)}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, 1)
                        }
                        className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="text-xs sm:text-sm font-bold text-neutral-900">
                      {formatPrice(item.product.price * item.quantity, item.product.currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-[#FAF9F6] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>جمع اقلام:</span>
                <span className="font-medium text-neutral-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>هزینه ارسال:</span>
                <span className="font-medium text-neutral-800">
                  {isFreeShipping ? 'رایگان' : formatPrice(45000)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-base text-amber-900">
                  {formatPrice(subtotal + (isFreeShipping ? 0 : 45000))}
                </span>
              </div>
            </div>

            {showCheckoutSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2 border border-emerald-200 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>درخواست ثبت شد (سفارش آزمایشی)</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onClose}
                  className="py-3 px-3 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-center"
                >
                  ادامه خرید
                </button>
                <button
                  onClick={handleSimulateCheckout}
                  className="py-3 px-3 text-xs font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>ادامه به پرداخت</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
