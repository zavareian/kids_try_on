import React, { useState } from 'react';
import { Product } from '../../types';
import { ClothingItem } from './ClothingItem';
import { Filter, Search } from 'lucide-react';

interface ClothingLibraryProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

export const ClothingLibrary: React.FC<ClothingLibraryProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'همه لباس‌ها' },
    { id: 'girls', label: 'دخترانه' },
    { id: 'boys', label: 'پسرانه' },
    { id: 'hoodies', label: 'هودی و سویشرت' },
    { id: 'jackets', label: 'کت و کاپشن' },
    { id: 'dresses', label: 'پیراهن' },
    { id: 'sets', label: 'ست‌ها' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      activeCategory === 'all'
        ? true
        : activeCategory === 'girls'
        ? p.gender === 'دخترانه' || p.gender === 'girls' || p.category === 'dresses'
        : activeCategory === 'boys'
        ? p.gender === 'پسرانه' || p.gender === 'boys'
        : p.category === activeCategory;

    const matchesSearch = searchQuery.trim()
      ? p.name.includes(searchQuery.trim()) || p.brand.includes(searchQuery.trim())
      : true;

    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col h-full shadow-2xs">
      
      {/* Title & Help */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">کتابخانه لباس‌های فروشگاه</h3>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            لباس را انتخاب کرده یا با Drag & Drop روی کودک بکشید
          </p>
        </div>
      </div>

      {/* Quick Search */}
      <div className="relative mt-3">
        <input
          type="text"
          placeholder="جستجوی مدل لباس..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs p-2.5 pr-8 pl-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-neutral-900"
        />
        <Search className="w-4 h-4 text-neutral-400 absolute right-2.5 top-3" />
      </div>

      {/* Category Pills (Interactive Segmented buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 mt-1 max-h-[500px]">
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            لباسی در این دسته‌بندی پیدا نشد.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <ClothingItem
              key={p.id}
              product={p}
              isSelected={selectedProduct?.id === p.id}
              onSelect={onSelectProduct}
            />
          ))
        )}
      </div>

    </div>
  );
};
