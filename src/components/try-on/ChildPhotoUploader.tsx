import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, Sparkles, CheckCircle2 } from 'lucide-react';
import sampleChildImg from '../../assets/images/child_portrait_tryon_1790665874103.jpg';

interface ChildPhotoUploaderProps {
  onPhotoSelected: (imageUrl: string) => void;
}

export const ChildPhotoUploader: React.FC<ChildPhotoUploaderProps> = ({ onPhotoSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری (JPG, PNG, WEBP) انتخاب کنید.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onPhotoSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 text-center max-w-xl mx-auto shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-center mx-auto mb-4">
        <Camera className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
        عکس کودک را برای شروع پرو لباس آپلود کنید
      </h2>
      <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
        تصویری تمام‌قد یا قدی از کودک خود بارگذاری کنید تا بتوانید لباس‌های مختلف فروشگاه را با کشیدن و رها کردن (Drag & Drop) روی او امتحان کنید.
      </p>

      {/* Drag & Drop Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-6 border-2 border-dashed rounded-2xl p-6 sm:p-8 cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-500 bg-amber-50/50 scale-[1.01]'
            : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/70 hover:bg-neutral-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <UploadCloud className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
        <span className="text-xs sm:text-sm font-semibold text-neutral-800 block">
          عکس را بکشید و اینجا رها کنید، یا کلیک نمایید
        </span>
        <span className="text-[11px] text-neutral-400 mt-1 block">
          فرمت‌های مجاز: JPG, PNG, WEBP (حداکثر ۱۰ مگابایت)
        </span>
      </div>

      {/* Or quick test with our photorealistic sample child photo */}
      <div className="mt-6 pt-5 border-t border-neutral-100">
        <span className="text-xs text-neutral-400 block mb-3 font-medium">
          یا از تصویر نمونه آتلیه‌ای واقعی برای آزمایش استفاده کنید:
        </span>
        <button
          onClick={() => onPhotoSelected(sampleChildImg)}
          className="inline-flex items-center gap-3 p-2 pr-3 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 rounded-2xl transition-all group text-right"
        >
          <img
            src={sampleChildImg}
            alt="کودک نمونه"
            className="w-12 h-12 rounded-xl object-cover border border-amber-300 shadow-2xs"
          />
          <div>
            <div className="text-xs font-bold text-amber-950 flex items-center gap-1">
              <span>استفاده از عکس کودک نمونه</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span className="text-[11px] text-amber-800/80 block mt-0.5">
              آزمایش سریع پرو لباس با یک کلیک
            </span>
          </div>
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-right text-[11px] text-neutral-500 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>زمینه خلوت و روشن برای بهترین نتیجه</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>کودک رو به دوربین با نور ملایم</span>
        </div>
      </div>
    </div>
  );
};
