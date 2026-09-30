import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenSizeGuide: () => void;
  onNavigateShop: () => void;
  onNavigateTryOn: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSizeGuide,
  onNavigateShop,
  onNavigateTryOn,
}) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions / Trust Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-neutral-800 text-right">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">پرو هوشمند مجازی</h4>
              <p className="text-[11px] text-neutral-400 mt-1">مشاهده تن‌خور واقعی لباس روی عکس کودک</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">ارسال سریع و مطمئن</h4>
              <p className="text-[11px] text-neutral-400 mt-1">پوشش سراسری با پست پیشتاز و تیپاکس</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">ضمانت ۷ روز بازگشت</h4>
              <p className="text-[11px] text-neutral-400 mt-1">تعویض سایز یا عودت وجه بدون دغدغه</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">پارچه‌های ارگانیک</h4>
              <p className="text-[11px] text-neutral-400 mt-1">صددرصد ضدحساسیت و سازگار با پوست نوزاد</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 text-right">
          
          {/* Brand & Story */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-900 font-black text-lg flex items-center justify-center">
                ش
              </div>
              <span className="text-lg font-bold text-white">شاپرک کیدز</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              شاپرک کیدز یک بوتیک تخصصی آنلاین برای پوشاک کودک است که کیفیت برتر، طراحی آرامش‌بخش مینیمال و فناوری نوآورانه پرو آنلاین لباس را در کنار هم به ارمغان می‌آورد.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wide">دسترسی سریع</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={onNavigateShop} className="hover:text-white transition-colors">
                  همه محصولات
                </button>
              </li>
              <li>
                <button onClick={onNavigateTryOn} className="hover:text-white transition-colors">
                  پرو لباس مجازی
                </button>
              </li>
              <li>
                <button onClick={onOpenSizeGuide} className="hover:text-white transition-colors">
                  راهنمای جامع سایز
                </button>
              </li>
              <li>
                <button onClick={onNavigateShop} className="hover:text-white transition-colors">
                  لباس‌های جدید فصل
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wide">خدمات مشتریان</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">راهنمای ثبت سفارش</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">روش‌ها و هزینه‌های ارسال</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">شرایط تعویض و بازگشت کالا</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">قوانین و مقررات فروشگاه</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">حریم خصوصی کاربران</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© تمام حقوق برای فروشگاه لباس کودک شاپرک کیدز محفوظ است.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>طراحی شده با عشق برای کودکان ایران</span>
            <span>·</span>
            <span>نسخه پیش‌نمایش پرو لباس مجازی</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
