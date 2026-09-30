import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onTryOn: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onViewProduct,
  onTryOn,
  onToggleWishlist,
  wishlistIds,
}) => {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200/80 p-8 my-6">
        <PackageOpen className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
        <h4 className="text-base font-semibold text-neutral-800">محصولی یافت نشد</h4>
        <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
          متاسفانه محصولی مطابق با فیلترهای انتخابی شما پیدا نشد. لطفاً فیلترها را تغییر داده یا بازنشانی کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewProduct={onViewProduct}
          onTryOn={onTryOn}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlistIds.has(product.id)}
        />
      ))}
    </div>
  );
};
