import React from 'react';
import { ProductCategory } from '../types';
import { RotateCcw } from 'lucide-react';
import { formatPrice, formatNumber } from '../utils/formatters';
import { calculateCategoryCount } from '../data/categories';
import { PRODUCTS } from '../data/products';

interface FilterPanelProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedGender: string;
  onSelectGender: (gender: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  maxPrice: number;
  onMaxPriceChange: (val: number) => void;
  onResetFilters: () => void;
  brands: string[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
  selectedSize,
  onSelectSize,
  maxPrice,
  onMaxPriceChange,
  onResetFilters,
  brands,
  selectedBrand,
  onSelectBrand,
}) => {
  const categoriesList: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'همه دسته‌ها' },
    { id: 'girls', label: 'دخترانه' },
    { id: 'boys', label: 'پسرانه' },
    { id: 'hoodies', label: 'سویشرت و هودی' },
    { id: 'jackets', label: 'کت و کاپشن' },
    { id: 'dresses', label: 'پیراهن و سارافون' },
    { id: 'sets', label: 'ست‌های کودک' },
  ];

  const genders = [
    { id: 'all', label: 'همه' },
    { id: 'دخترانه', label: 'دخترانه' },
    { id: 'پسرانه', label: 'پسرانه' },
    { id: 'اسپرت', label: 'اسپرت' },
  ];

  const sizes = ['همه', '۱-۲ سال', '۲-۳ سال', '۴-۵ سال', '۶-۷ سال', '۸-۱۰ سال'];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 space-y-6">
      
      {/* Header and Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <h3 className="text-sm font-bold text-neutral-900">فیلترهای جستجو</h3>
        <button
          onClick={onResetFilters}
          className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>بازنشانی</span>
        </button>
      </div>

      {/* 1. Category */}
      <div>
        <label className="block text-xs font-semibold text-neutral-700 mb-2.5">
          دسته‌بندی محصول
        </label>
        <div className="space-y-1">
          {categoriesList.map((cat) => {
            const count = cat.id === 'all' ? PRODUCTS.length : calculateCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-right px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[11px] ${selectedCategory === cat.id ? 'text-neutral-300' : 'text-neutral-400'}`}>
                  ({formatNumber(count)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Gender Segmented Control */}
      <div className="pt-2 border-t border-neutral-100">
        <label className="block text-xs font-semibold text-neutral-700 mb-2.5">
          جنسیت
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-xl">
          {genders.map((g) => (
            <button
              key={g.id}
              onClick={() => onSelectGender(g.id)}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${
                selectedGender === g.id
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Age / Size Selector */}
      <div className="pt-2 border-t border-neutral-100">
        <label className="block text-xs font-semibold text-neutral-700 mb-2.5">
          سایز و رده سنی
        </label>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => onSelectSize(s === 'همه' ? 'all' : s)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                (selectedSize === 'all' && s === 'همه') || selectedSize === s
                  ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Price Range */}
      <div className="pt-2 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-neutral-700">حداکثر قیمت</label>
          <span className="text-xs font-medium text-neutral-900">
            {formatPrice(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="500000"
          max="2000000"
          step="50000"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
          <span>۵۰۰٬۰۰۰ ت</span>
          <span>۲٬۰۰۰٬۰۰۰ ت</span>
        </div>
      </div>

      {/* 5. Brand */}
      {brands.length > 0 && (
        <div className="pt-2 border-t border-neutral-100">
          <label className="block text-xs font-semibold text-neutral-700 mb-2">
            برند
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => onSelectBrand(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-800 focus:outline-none focus:border-neutral-900"
          >
            <option value="all">همه برندها</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

    </div>
  );
};
