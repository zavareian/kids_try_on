import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sizeTable = [
    { age: '۹ تا ۱۲ ماه', height: '۷۴ - ۸۰ سانتی‌متر', chest: '۴۷ - ۴۹ سانتی‌متر', weight: '۹ - ۱۱ کیلوگرم' },
    { age: '۱ تا ۲ سال', height: '۸۱ - ۹۲ سانتی‌متر', chest: '۵۰ - ۵۲ سانتی‌متر', weight: '۱۱ - ۱۳ کیلوگرم' },
    { age: '۲ تا ۳ سال', height: '۹۳ - ۹۸ سانتی‌متر', chest: '۵۳ - ۵۴ سانتی‌متر', weight: '۱۳ - ۱۵ کیلوگرم' },
    { age: '۳ تا ۴ سال', height: '۹۹ - ۱۰۴ سانتی‌متر', chest: '۵۵ - ۵۶ سانتی‌متر', weight: '۱۵ - ۱۷ کیلوگرم' },
    { age: '۴ تا ۵ سال', height: '۱۰۵ - ۱۱۰ سانتی‌متر', chest: '۵۷ - ۵۸ سانتی‌متر', weight: '۱۷ - ۲۰ کیلوگرم' },
    { age: '۶ تا ۷ سال', height: '۱۱۱ - ۱۲۲ سانتی‌متر', chest: '۶۰ - ۶۳ سانتی‌متر', weight: '۲۱ - ۲۵ کیلوگرم' },
    { age: '۸ تا ۱۰ سال', height: '۱۲۳ - ۱۳۵ سانتی‌متر', chest: '۶۴ - ۶۸ سانتی‌متر', weight: '۲۶ - ۳۲ کیلوگرم' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-neutral-800" />
            <h3 className="text-base font-bold text-neutral-900">راهنمای جامع سایز لباس کودک</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-x-auto">
          <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
            برای انتخاب دقیق‌ترین سایز، توصیه می‌کنیم قد و دور سینه کودک خود را بدون کفش و با متر نواری نرم اندازه بگیرید. در صورتی که کودک شما بین دو سایز قرار دارد، همیشه سایز بزرگ‌تر را انتخاب نمایید.
          </p>

          <table className="w-full text-right text-xs border border-neutral-200 rounded-xl overflow-hidden">
            <thead className="bg-neutral-100 text-neutral-800 font-bold border-b border-neutral-200">
              <tr>
                <th className="p-3">رده سنی</th>
                <th className="p-3">قد استاندارد</th>
                <th className="p-3">دور سینه</th>
                <th className="p-3">وزن تقریبی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sizeTable.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                  <td className="p-3 font-semibold text-neutral-900">{row.age}</td>
                  <td className="p-3 text-neutral-600">{row.height}</td>
                  <td className="p-3 text-neutral-600">{row.chest}</td>
                  <td className="p-3 text-neutral-600">{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
