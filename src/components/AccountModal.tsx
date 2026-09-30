import React, { useState } from 'react';
import { X, User, Phone, CheckCircle2 } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 10) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-neutral-800" />
            <h3 className="text-base font-bold text-neutral-900">
              {isLoggedIn ? 'حساب کاربری من' : 'ورود / ثبت‌نام'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoggedIn ? (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                {name ? name[0] : 'ک'}
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-sm">{name || 'کاربر گرامی شاپرک کیدز'}</h4>
                <p className="text-xs text-neutral-500 mt-0.5">{phoneNumber}</p>
              </div>

              <div className="bg-neutral-50 rounded-xl p-3 text-right space-y-2 text-xs border border-neutral-100">
                <div className="flex justify-between text-neutral-700">
                  <span>سفارش‌های در حال پردازش:</span>
                  <span className="font-bold">۱ سفارش</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>امتیاز باشگاه مشتریان:</span>
                  <span className="font-bold text-amber-900">۱۴۰ امتیاز</span>
                </div>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full py-2.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-colors"
              >
                خروج از حساب کاربری
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-xs text-neutral-600 leading-relaxed">
                برای پیگیری سفارش‌ها، ذخیره استایل‌های پرو شده و دریافت کدهای تخفیف، شماره موبایل خود را وارد کنید.
              </p>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  نام و نام خانوادگی (اختیاری)
                </label>
                <input
                  type="text"
                  placeholder="مثال: سارا محمدی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  شماره موبایل
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="0912..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full text-xs p-3 pl-10 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-neutral-900 text-left font-mono"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
              >
                ادامه و ورود
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
