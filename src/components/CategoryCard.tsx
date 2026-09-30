import React from 'react';
import { CategoryInfo } from '../types';
import { formatNumber } from '../utils/formatters';

interface CategoryCardProps {
  category: CategoryInfo;
  onClick: (category: CategoryInfo) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={() => onClick(category)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200/90 bg-white hover:border-neutral-400 hover:shadow-md transition-all duration-200"
    >
      <div className="aspect-4/3 w-full overflow-hidden bg-[#F3F2EC]">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold tracking-tight">{category.title}</h3>
          <span className="text-xs text-neutral-300 font-medium">
            {formatNumber(category.itemCount)} مدل
          </span>
        </div>
        <p className="text-xs text-neutral-200 mt-1 line-clamp-1 font-light">
          {category.description}
        </p>
      </div>
    </div>
  );
};
