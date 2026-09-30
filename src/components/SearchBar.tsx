import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onTryOnProduct: (product: Product) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onTryOnProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.includes(query.trim()) ||
          p.brand.includes(query.trim()) ||
          p.category.includes(query.trim()) ||
          p.gender.includes(query.trim())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="نام لباس، نوع پوشاک (مثلاً: کت جین، هودی، دخترانه)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-medium text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-neutral-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 px-2 py-1 rounded-md"
          >
            بستن
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-neutral-100">
          {query.trim() === '' ? (
            <div className="py-6 px-2 text-center">
              <span className="text-xs text-neutral-400 block mb-3">جستجوهای پرطرفدار:</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['کت جین', 'پیراهن لینن', 'هودی بافت', 'دخترانه', 'ست پنبه‌ای'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              موردی مطابق با «{query}» پیدا نشد.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-neutral-50 rounded-xl px-2 transition-colors cursor-pointer group"
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 group-hover:text-amber-900">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-2">
                      <span>{item.brand}</span>
                      <span>·</span>
                      <span className="font-medium text-neutral-800">{formatPrice(item.price, item.currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTryOnProduct(item);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1 border border-amber-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>پرو</span>
                  </button>
                  <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
