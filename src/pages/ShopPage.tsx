import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { FilterPanel } from '../components/FilterPanel';
import { SortMenu, SortOption } from '../components/SortMenu';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  initialCategory?: string;
  onViewProduct: (product: Product) => void;
  onTryOn: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  initialCategory = 'all',
  onViewProduct,
  onTryOn,
  onToggleWishlist,
  wishlistIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [currentSort, setCurrentSort] = useState<SortOption>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync selectedCategory when prop changes
  React.useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Extract unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'girls') {
            const isGirl = p.gender === 'girls' || p.gender === 'دخترانه' || p.category === 'dresses';
            if (!isGirl) return false;
          } else if (selectedCategory === 'boys') {
            const isBoy = p.gender === 'boys' || p.gender === 'پسرانه';
            if (!isBoy) return false;
          } else if (p.category !== selectedCategory) {
            return false;
          }
        }

        // Gender
        if (selectedGender !== 'all') {
          if (selectedGender === 'دخترانه' && p.gender !== 'دخترانه' && p.gender !== 'girls') {
            return false;
          } else if (selectedGender === 'پسرانه' && p.gender !== 'پسرانه' && p.gender !== 'boys') {
            return false;
          } else if (selectedGender === 'اسپرت' && p.gender !== 'اسپرت') {
            return false;
          }
        }

        // Size
        if (selectedSize !== 'all' && !p.sizes.includes(selectedSize)) {
          return false;
        }

        // Price (Only filter Tomans with Toman slider)
        if (!p.currency && p.price > maxPrice) {
          return false;
        }

        // Brand
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (currentSort === 'price-asc') return a.price - b.price;
        if (currentSort === 'price-desc') return b.price - a.price;
        if (currentSort === 'popular') return b.rating - a.rating;
        // newest
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      });
  }, [products, selectedCategory, selectedGender, selectedSize, maxPrice, selectedBrand, currentSort]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedSize('all');
    setMaxPrice(2000000);
    setSelectedBrand('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
      
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          فروشگاه لباس کودک شاپرک کیدز
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          مجموعه منتخبی از باکیفیت‌ترین لباس‌های نوزادی و بچگانه، با قابلیت پرو مجازی
        </p>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4 flex justify-between items-center">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 shadow-2xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-neutral-600" />
          <span>فیلترهای پیشرفته</span>
        </button>

        <span className="text-xs text-neutral-500 font-medium">
          {filteredProducts.length} محصول
        </span>
      </div>

      {/* Main Layout Grid: Right Sidebar (RTL) + Products Main Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Filter Sidebar (4 cols on lg) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24">
          <FilterPanel
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedGender={selectedGender}
            onSelectGender={setSelectedGender}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            onResetFilters={handleResetFilters}
            brands={brands}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
          />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                  <h3 className="text-sm font-bold text-neutral-900">فیلترهای محصول</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel
                  selectedCategory={selectedCategory}
                  onSelectCategory={(c) => {
                    setSelectedCategory(c);
                    setMobileFilterOpen(false);
                  }}
                  selectedGender={selectedGender}
                  onSelectGender={setSelectedGender}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                  maxPrice={maxPrice}
                  onMaxPriceChange={setMaxPrice}
                  onResetFilters={handleResetFilters}
                  brands={brands}
                  selectedBrand={selectedBrand}
                  onSelectBrand={setSelectedBrand}
                />
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold"
              >
                مشاهده نتایج ({filteredProducts.length} محصول)
              </button>
            </div>
          </div>
        )}

        {/* Products Main Grid (9 cols on lg) */}
        <main className="lg:col-span-9 space-y-6">
          {/* Sorting Bar */}
          <SortMenu
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            totalCount={filteredProducts.length}
          />

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            onViewProduct={onViewProduct}
            onTryOn={onTryOn}
            onToggleWishlist={onToggleWishlist}
            wishlistIds={wishlistIds}
          />
        </main>

      </div>

    </div>
  );
};
