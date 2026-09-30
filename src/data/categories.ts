import { CategoryInfo, Product } from '../types';
import { PRODUCTS } from './products';
import denimJacketImg from '../assets/images/kid_denim_jacket_1790665886868.jpg';
import floralDressImg from '../assets/images/kid_floral_dress_1790665898085.jpg';
import knitHoodieImg from '../assets/images/kid_knit_hoodie_1790665908320.jpg';

export function calculateCategoryCount(catId: string, products: Product[] = PRODUCTS): number {
  if (catId === 'girls') {
    return products.filter((p) => p.gender === 'girls' || p.gender === 'دخترانه' || p.category === 'dresses').length;
  }
  if (catId === 'boys') {
    return products.filter((p) => p.gender === 'boys' || p.gender === 'پسرانه').length;
  }
  return products.filter((p) => p.category === catId).length;
}

const BASE_CATEGORIES: Omit<CategoryInfo, 'itemCount'>[] = [
  {
    id: 'girls',
    title: 'دخترانه',
    image: floralDressImg,
    description: 'پیراهن‌های کتان، سارافون، ست‌های تابستانه و مجلسی شیک',
  },
  {
    id: 'boys',
    title: 'پسرانه',
    image: denimJacketImg,
    description: 'کت جین، شلوارهای کتان بادوام، تیشرت‌های نخ‌پنبه و پیراهن',
  },
  {
    id: 'hoodies',
    title: 'سویشرت و هودی',
    image: knitHoodieImg,
    description: 'هودی‌های بافت و دورس گرم و پنبه‌ای با طرح‌های ملایم مینیمال',
  },
  {
    id: 'jackets',
    title: 'کت و کاپشن پاییزه',
    image: denimJacketImg,
    description: 'کت‌های جین سنگ‌شور و بارانی‌های سبک برای فصل‌های خنک',
  },
  {
    id: 'dresses',
    title: 'پیراهن و سارافون',
    image: floralDressImg,
    description: 'پیراهن‌های گلدار لطیف با پارچه صددرصد ارگانیک و دوخت تمیز',
  },
  {
    id: 'sets',
    title: 'ست‌های دوتکه و سه‌تکه',
    image: knitHoodieImg,
    description: 'ست‌های راحتی و بیرونی ست‌شده با هارمونی رنگ‌های طبیعی',
  },
];

export function getDynamicCategories(products: Product[] = PRODUCTS): CategoryInfo[] {
  return BASE_CATEGORIES.map((cat) => ({
    ...cat,
    itemCount: calculateCategoryCount(cat.id, products),
  }));
}

export const CATEGORIES: CategoryInfo[] = getDynamicCategories(PRODUCTS);
