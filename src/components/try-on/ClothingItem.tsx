import React from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { Move } from 'lucide-react';

interface ClothingItemProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product) => void;
}

export const ClothingItem: React.FC<ClothingItemProps> = ({
  product,
  isSelected,
  onSelect,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(product)}
      className={`group relative flex items-center gap-3 p-2.5 rounded-2xl border cursor-grab active:cursor-grabbing transition-all select-none ${
        isSelected
          ? 'border-neutral-900 bg-neutral-50 shadow-sm ring-2 ring-neutral-900/10'
          : 'border-neutral-200/90 bg-white hover:border-neutral-300 hover:shadow-2xs'
      }`}
    >
      {/* Product Image */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F5F4EE] shrink-0 border border-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-1 right-1 bg-black/40 backdrop-blur-xs text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          <Move className="w-2.5 h-2.5" />
        </div>
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400">
          <span className="truncate">{product.brand}</span>
          <span className="shrink-0">{product.gender === 'girls' ? 'دخترانه' : product.gender === 'boys' ? 'پسرانه' : product.gender}</span>
        </div>
        <h4 className="text-xs font-bold text-neutral-900 truncate mt-0.5" title={product.name}>
          {product.name}
        </h4>
        <div className="text-xs font-semibold text-neutral-800 mt-1">
          {formatPrice(product.price, product.currency)}
        </div>
      </div>

      {/* Selection pill */}
      <div className="shrink-0">
        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
            isSelected
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-neutral-300 group-hover:border-neutral-400'
          }`}
        >
          {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
        </div>
      </div>
    </div>
  );
};
