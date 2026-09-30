export type Gender = 'girls' | 'boys' | 'unisex' | 'baby';

export type ProductCategory = 
  | 'all'
  | 'girls'
  | 'boys'
  | 'baby'
  | 'sets'
  | 'dresses'
  | 'pants'
  | 'tshirts'
  | 'hoodies'
  | 'jackets';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  gender: 'دخترانه' | 'پسرانه' | 'اسپرت' | 'نوزاد' | 'girls' | 'boys';
  brand: string;
  price: number;
  oldPrice?: number;
  currency?: string;
  sourceStore?: string;
  productUrl?: string;
  swedishName?: string;
  image: string;
  gallery: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  specs: { [key: string]: string };
  rating: number;
  reviewsCount: number;
  available: boolean;
  featured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface CategoryInfo {
  id: ProductCategory;
  title: string;
  itemCount: number;
  image: string;
  description: string;
}

export type TryOnStatus = 'idle' | 'uploading' | 'generating' | 'success' | 'error';

export interface TryOnState {
  originalChildImage: string | null;
  generatedTryOnImage: string | null;
  selectedProduct: Product | null;
  tryOnStatus: TryOnStatus;
  statusMessage?: string;
  activeView?: 'original' | 'result';
}
