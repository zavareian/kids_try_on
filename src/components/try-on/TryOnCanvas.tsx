import React, { useState, useRef } from 'react';
import { Product } from '../../types';
import { Camera, Sparkles, Upload, CheckCircle2, Loader2, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface TryOnCanvasProps {
  originalChildImage: string | null;
  generatedTryOnImage: string | null;
  activeView: 'original' | 'result';
  onToggleView: (view: 'original' | 'result') => void;
  selectedProduct: Product | null;
  onDropProduct: (productId: string) => void;
  onSelectChildImage: (file: File) => void;
  onRemoveChildPhoto: () => void;
  isProcessing: boolean;
  onGenerateTryOn: () => void;
  errorMessage?: string | null;
  validationError?: string | null;
}

export const TryOnCanvas: React.FC<TryOnCanvasProps> = ({
  originalChildImage,
  generatedTryOnImage,
  activeView,
  onToggleView,
  selectedProduct,
  onDropProduct,
  onSelectChildImage,
  onRemoveChildPhoto,
  isProcessing,
  onGenerateTryOn,
  errorMessage,
  validationError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndHandleFile = (file: File) => {
    setFileValidationError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt =
      lowerName.endsWith('.jpg') ||
      lowerName.endsWith('.jpeg') ||
      lowerName.endsWith('.png') ||
      lowerName.endsWith('.webp');

    // Section 7: File type validation
    if (!validTypes.includes(file.type) && !hasValidExt) {
      setFileValidationError('لطفاً یک فایل تصویری معتبر انتخاب کنید.');
      return;
    }

    // Section 7: 10 MB size limit
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileValidationError('حجم تصویر باید کمتر از 10 مگابایت باشد.');
      return;
    }

    onSelectChildImage(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
    // reset input so selecting the same file again triggers onChange
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    // 1. Check if an image file was dropped from the user's computer
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndHandleFile(file);
      return;
    }

    // 2. Check if a clothing product was dragged and dropped from clothing library
    const dataStr = e.dataTransfer.getData('text/plain');
    if (dataStr) {
      try {
        const item = JSON.parse(dataStr);
        if (item.id) {
          onDropProduct(item.id);
        }
      } catch (err) {
        console.error('Failed to parse dropped clothing item data', err);
      }
    }
  };

  // The active image to render: strictly originalChildImage or generatedTryOnImage
  const displayImage =
    generatedTryOnImage && activeView === 'result'
      ? generatedTryOnImage
      : originalChildImage;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm flex flex-col items-center justify-between p-4 sm:p-6 min-h-[560px]">
      
      {/* Hidden Native File Input (accepts JPG, JPEG, PNG, WEBP) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* 1. Canvas Top Header */}
      <div className="w-full flex items-center justify-between pb-3.5 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs sm:text-sm font-bold text-neutral-800">
            بوم هوشمند پرو لباس کودک
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Switcher between Original Child and Generated Try-On Result */}
          {generatedTryOnImage && originalChildImage && (
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-xl border border-neutral-200 text-xs">
              <button
                type="button"
                onClick={() => onToggleView('original')}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                  activeView === 'original'
                    ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                عکس اولیه
              </button>
              <button
                type="button"
                onClick={() => onToggleView('result')}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                  activeView === 'result'
                    ? 'bg-neutral-900 text-white shadow-2xs font-bold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                نتیجه پرو هوشمند
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Drag & Drop Status Bar when Garment is Selected */}
      {selectedProduct && (
        <div className="w-full mt-3 px-3 py-2 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-emerald-950 font-semibold truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>لباس انتخاب شد:</span>
            <strong className="text-emerald-900 font-bold truncate">
              {selectedProduct.name}
            </strong>
            <span className="text-emerald-700 text-[11px] hidden sm:inline">
              ({formatPrice(selectedProduct.price)})
            </span>
          </div>

          <button
            type="button"
            onClick={onGenerateTryOn}
            disabled={isProcessing}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow-xs ${
              isProcessing
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-98'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>در حال پرو لباس...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>پرو این لباس</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Validation / Error Feedback Alert */}
      {(validationError || fileValidationError || errorMessage) && (
        <div className="w-full mt-3 px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError || fileValidationError || errorMessage}</span>
          </div>
          {errorMessage && (
            <button
              type="button"
              onClick={onGenerateTryOn}
              disabled={isProcessing}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-[11px] transition-colors shrink-0"
            >
              تلاش مجدد
            </button>
          )}
        </div>
      )}

      {/* 3. Main Center Area: NO IMAGE vs AFTER IMAGE */}
      {!originalChildImage ? (
        /* NO IMAGE STATE (Section 2 & 13) */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative my-4 w-full max-w-sm aspect-3/4 rounded-2xl overflow-hidden border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center bg-[#FAF9F6] ${
            isDragOver
              ? 'border-amber-500 bg-amber-50/50 scale-[1.01]'
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center justify-center mb-3.5">
            <Camera className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h4 className="text-base font-bold text-neutral-800">
            عکس کودک را اضافه کنید
          </h4>
          <p className="text-xs text-neutral-500 mt-1.5 max-w-[240px] leading-relaxed">
            تصویر تمام‌قد یا قدی کودک خود را بارگذاری کنید تا بتوانید لباس‌ها را روی آن پرو نمایید.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-98 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>انتخاب عکس</span>
          </button>

          <span className="text-[11px] text-neutral-400 mt-3 block">
            فرمت‌های مجاز: JPG, PNG, WEBP (حداکثر ۱۰ مگابایت)
          </span>
        </div>
      ) : (
        /* AFTER IMAGE STATE (Section 3, 8 & 13) */
        <div className="w-full flex flex-col items-center my-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full max-w-sm aspect-3/4 rounded-2xl overflow-hidden border-2 transition-all flex items-center justify-center bg-[#FAF9F6] shadow-inner ${
              isDragOver
                ? 'border-amber-500 ring-4 ring-amber-500/20 scale-[1.01]'
                : 'border-neutral-200'
            }`}
          >
            {/* The child image: strictly object-fit: contain, preserving aspect ratio, no CSS filters or overlays */}
            <img
              src={displayImage || ''}
              alt="عکس کودک برای پرو لباس"
              className="w-full h-full object-contain select-none pointer-events-none"
            />

            {/* Non-intrusive drag indicator when dragging clothing over canvas */}
            {isDragOver && (
              <div className="absolute inset-x-0 bottom-0 p-3 bg-neutral-900/85 backdrop-blur-md text-white flex items-center justify-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-150">
                <Upload className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>رها کنید تا این لباس انتخاب شود</span>
              </div>
            )}

            {/* Processing State Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 z-20 animate-in fade-in duration-150">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/80 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
                </div>
                <h4 className="text-sm font-bold text-white text-center">
                  در حال پرو لباس...
                </h4>
                <p className="text-xs text-neutral-300 mt-2 text-center max-w-xs leading-relaxed">
                  در حال پردازش هوشمند و شبیه‌سازی تن‌خور لباس روی کودک...
                </p>
              </div>
            )}
          </div>

          {/* Controls: [ تغییر عکس ] and [ حذف عکس ] (Section 3, 4, 5 & 13) */}
          <div className="flex items-center gap-2.5 w-full max-w-sm justify-center mt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-neutral-200 disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تغییر عکس</span>
            </button>

            <button
              type="button"
              onClick={onRemoveChildPhoto}
              disabled={isProcessing}
              className="flex-1 py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-rose-200 disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف عکس</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Canvas Bottom Guidance */}
      <div className="w-full text-center pt-3 border-t border-neutral-100">
        <p className="text-xs text-neutral-500">
          {!originalChildImage ? (
            <span>ابتدا عکس کودک خود را انتخاب کنید، سپس لباسی را برای پرو برگزینید.</span>
          ) : selectedProduct ? (
            <span className="text-neutral-700">
              لباس <strong className="text-neutral-900">«{selectedProduct.name}»</strong> به عنوان مرجع پوشاک انتخاب شده است. روی دکمه <strong className="text-neutral-900">«پرو این لباس»</strong> کلیک کنید.
            </span>
          ) : (
            <span>
              یک لباس را از کتابخانه لباس‌ها روی این کادر Drag & Drop کنید یا روی آن کلیک نمایید تا به عنوان لباس مرجع انتخاب شود.
            </span>
          )}
        </p>
      </div>

    </div>
  );
};
