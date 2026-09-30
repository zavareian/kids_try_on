import React from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { Sparkles, Shirt, CheckCircle2, Eye, Loader2, AlertCircle } from 'lucide-react';

interface SelectedProductPanelProps {
  product: Product | null;
  hasChildImage: boolean;
  onGenerateTryOn: () => void;
  isProcessing: boolean;
  onViewProductDetails: (product: Product) => void;
  errorMessage?: string | null;
}

export const SelectedProductPanel: React.FC<SelectedProductPanelProps> = ({
  product,
  hasChildImage,
  onGenerateTryOn,
  isProcessing,
  onViewProductDetails,
  errorMessage,
}) => {
  const isButtonEnabled = hasChildImage && !!product && !isProcessing;

  const getButtonText = () => {
    if (isProcessing) return 'در حال پرو لباس...';
    if (!product) return 'ابتدا یک لباس انتخاب کنید';
    if (!hasChildImage) return 'ابتدا عکس کودک را انتخاب کنید';
    return 'پرو این لباس';
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 flex flex-col justify-between h-full shadow-2xs">
      
      <div>
        {/* Header & Status Indicator */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
          {product ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>لباس انتخاب شد</span>
            </div>
          ) : (
            <div className="text-xs text-neutral-500 font-medium">
              لباس مرجع پرو
            </div>
          )}

          {product && (
            <button
              onClick={() => onViewProductDetails(product)}
              className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-semibold"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>مشاهده محصول</span>
            </button>
          )}
        </div>

        {product ? (
          <>
            {/* Garment Reference Spotlight Card */}
            <div className="mt-4 flex gap-3.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-xl object-cover bg-white shrink-0 border border-neutral-200 shadow-2xs"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-neutral-400 block">{product.brand}</span>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug truncate mt-0.5" title={product.name}>
                  {product.name}
                </h4>
                <div className="text-xs sm:text-sm font-bold text-neutral-900 mt-1.5">
                  {formatPrice(product.price, product.currency)}
                </div>
                <span className="text-[10px] text-neutral-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                  {product.gender === 'girls' ? 'دخترانه' : product.gender === 'boys' ? 'پسرانه' : product.gender}
                </span>
              </div>
            </div>

            {/* Reference Specifications */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-100 text-neutral-600">
                <span>جنس پارچه مرجع:</span>
                <span className="font-semibold text-neutral-800">{product.specs['جنس پارچه'] || 'نخ‌پنبه طبیعی'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100 text-neutral-600">
                <span>شناسه لباس:</span>
                <span className="font-mono text-neutral-600">{product.id}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
              <Shirt className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h4 className="text-sm font-bold text-neutral-800">
              لباسی انتخاب نشده است
            </h4>
            <p className="text-xs text-neutral-500 mt-1.5 max-w-xs leading-relaxed">
              یک لباس را از کتابخانه لباس‌ها روی فضای پرو بکشید یا انتخاب کنید.
            </p>
          </div>
        )}

        {/* Try-On Status Tip */}
        <div className="mt-5 p-3 rounded-2xl bg-neutral-100/80 border border-neutral-200/80 text-[11px] text-neutral-700 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 text-neutral-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>پرو هوشمند و پیشرفته</span>
          </div>
          تن‌خور لباس با تطبیق سایز و اندام کودک شما به‌صورت واقع‌گرایانه شبیه‌سازی و نمایش داده می‌شود.
        </div>

        {/* Error message if request failed */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Action Button: «پرو این لباس» */}
      <div className="pt-5 border-t border-neutral-100 mt-4">
        <button
          onClick={onGenerateTryOn}
          disabled={!isButtonEnabled}
          className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
            !isButtonEnabled
              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed border border-neutral-200'
              : 'bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white shadow-neutral-900/10'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>{getButtonText()}</span>
            </>
          ) : (
            <>
              {isButtonEnabled && <Sparkles className="w-4 h-4 text-amber-400" />}
              <span>{getButtonText()}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
