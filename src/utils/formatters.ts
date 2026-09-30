// Utility to convert Latin numerals to Persian numerals
export const toPersianDigits = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num
    .toString()
    .replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
};

// Format price with thousands separators and Persian digits + currency ('تومان' or 'SEK')
export const formatPrice = (price: number, currency?: string): string => {
  if (currency === 'SEK') {
    const formatted = price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
    return `${toPersianDigits(formatted)} SEK`;
  }
  const formattedWithCommas = price.toLocaleString('fa-IR');
  return `${formattedWithCommas} تومان`;
};

// Format raw number with Persian digits
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fa-IR');
};
