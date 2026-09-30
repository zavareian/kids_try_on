import React, { useState } from 'react';
import { X, Sparkles, Truck, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-neutral-900 text-neutral-100 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-6 text-[13px] font-medium tracking-tight overflow-hidden whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>پرو لباس مجازی با هوش مصنوعی برای اولین بار در ایران</span>
          </span>
          <span className="hidden md:inline-block text-neutral-600">·</span>
          <span className="hidden md:flex items-center gap-1.5 text-neutral-300">
            <Truck className="w-3.5 h-3.5 text-neutral-400" />
            <span>ارسال سریع و رایگان برای خریدهای بالای ۱ میلیون تومان</span>
          </span>
          <span className="hidden lg:inline-block text-neutral-600">·</span>
          <span className="hidden lg:flex items-center gap-1.5 text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>ضمانت ۷ روز تعویض و بازگشت بدون قید و شرط</span>
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-neutral-400 hover:text-white p-1 rounded transition-colors mr-2 shrink-0"
          aria-label="بستن اعلان"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
