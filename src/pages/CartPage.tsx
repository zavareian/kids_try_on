import React, { useState } from 'react';
import { CartItem } from '../types';
import { formatPrice, formatNumber } from '../utils/formatters';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, colorHex: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string, colorHex: string) => void;
  onNavigateShop: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigateShop,
}) => {
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const isFreeShipping = subtotal >= 1000000;
  const shippingCost = items.length === 0 || isFreeShipping ? 0 : 45000;
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toLowerCase() === 'bamboo10') {
      setDiscountApplied(true);
    } else {
      alert('کد تخفیف معتبر نیست. کد نمونه: bamboo10');
    }
  };

  const handleCheckout = () => {
    setOrderPlaced(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          سبد خرید
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          بررسی نهایی اقلام انتخابی و نهایی‌سازی سفارش
        </p>
      </div>

      {orderPlaced ? (
        <div className="max-w-md mx-auto text-center py-16 bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">سفارش شما با موفقیت ثبت شد!</h2>
          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
            کد پیگیری سفارش شما: <strong className="text-neutral-900 font-mono">BMB-89421</strong>
            <br />
            پیامک تایید سفارش و اطلاعات ارسال برای شما ارسال خواهد شد.
          </p>
          <button
            onClick={onNavigateShop}
            className="mt-6 px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            بازگشت به فروشگاه
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8 max-w-lg mx-auto">
          <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4 stroke-[1.5]" />
          <h3 className="text-lg font-bold text-neutral-800">سبد خرید شما در حال حاضر خالی است</h3>
          <p className="text-xs text-neutral-500 mt-2 max-w-xs mx-auto">
            می‌توانید زیباترین لباس‌های ارگانیک کودک را ببینید و حتی با قابلیت پرو مجازی، تن‌خور آن را امتحان کنید.
          </p>
          <button
            onClick={onNavigateShop}
            className="mt-6 px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            مشاهده محصولات فروشگاه
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items List (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 divide-y divide-neutral-100">
            {items.map((item, index) => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}-${index}`} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-neutral-100 shrink-0"
                  />
                  <div>
                    <span className="text-[11px] text-neutral-400 block">{item.product.brand}</span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-0.5">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1.5">
                      <span>سایز: <strong>{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        رنگ:
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <strong>{item.selectedColor.name}</strong>
                      </span>
                    </div>
                    <div className="text-xs font-bold text-neutral-900 mt-2 sm:hidden">
                      {formatPrice(item.product.price, item.product.currency)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, -1)
                      }
                      className="px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-200 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1.5 text-xs font-bold text-neutral-900 bg-white">
                      {formatNumber(item.quantity)}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, 1)
                      }
                      className="px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-200 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Total item price */}
                  <div className="hidden sm:block text-sm font-bold text-neutral-900 text-left min-w-[120px]">
                    {formatPrice(item.product.price * item.quantity, item.product.currency)}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() =>
                      onRemoveItem(item.product.id, item.selectedSize, item.selectedColor.hex)
                    }
                    className="p-2 text-neutral-400 hover:text-rose-500 rounded-lg hover:bg-neutral-100 transition-colors"
                    title="حذف کالا"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Checkout & Summary Sidebar (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Discount Code Box */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5">
              <h4 className="text-xs font-bold text-neutral-800 mb-2.5">کد تخفیف</h4>
              <form onSubmit={handleApplyDiscount} className="flex gap-2">
                <input
                  type="text"
                  placeholder="کد تخفیف (مثال: bamboo10)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shrink-0"
                >
                  اعمال
                </button>
              </form>
              {discountApplied && (
                <span className="text-[11px] text-emerald-700 font-semibold mt-2 block">
                  ✓ تخفیف ۱۰ درصدی شاپرک کیدز با موفقیت اعمال شد.
                </span>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                خلاصه فاکتور
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>مجموع قیمت اقلام ({formatNumber(items.length)} قلم):</span>
                  <span className="font-semibold text-neutral-800">{formatPrice(subtotal)}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>تخفیف ویژه:</span>
                    <span>- {formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span className="font-semibold text-neutral-800">
                    {isFreeShipping ? 'رایگان' : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline text-sm font-bold text-neutral-900">
                  <span>مبلغ کل قابل پرداخت:</span>
                  <span className="text-base text-amber-900">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>ثبت نهایی و ادامه به پرداخت</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>پرداخت از درگاه امن شاپرک با تمام کارت‌های عضو شتاب</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
