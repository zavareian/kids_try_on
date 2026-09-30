import React from 'react';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

interface SortMenuProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
}

export const SortMenu: React.FC<SortMenuProps> = ({
  currentSort,
  onSortChange,
  totalCount,
}) => {
  const options: { id: SortOption; label: string }[] = [
    { id: 'newest', label: 'جدیدترین' },
    { id: 'popular', label: 'محبوب‌ترین' },
    { id: 'price-asc', label: 'ارزان‌ترین' },
    { id: 'price-desc', label: 'گران‌ترین' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:px-4 rounded-xl border border-neutral-200/80">
      
      <div className="text-xs text-neutral-600 font-medium">
        نمایش <span className="font-bold text-neutral-900">{totalCount}</span> محصول
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <span className="text-xs text-neutral-400 whitespace-nowrap ml-1">مرتب‌سازی:</span>
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSortChange(opt.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                currentSort === opt.id
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
