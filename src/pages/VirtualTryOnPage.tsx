import React, { useState, useEffect } from 'react';
import { Product, TryOnStatus } from '../types';
import { ClothingLibrary } from '../components/try-on/ClothingLibrary';
import { TryOnCanvas } from '../components/try-on/TryOnCanvas';
import { SelectedProductPanel } from '../components/try-on/SelectedProductPanel';
import { TryOnResult } from '../components/try-on/TryOnResult';
import { tryOnService } from '../services/tryOnService';
import { Sparkles, ArrowRight } from 'lucide-react';

interface VirtualTryOnPageProps {
  products: Product[];
  initialProduct: Product | null;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigateHome: () => void;
}

export const VirtualTryOnPage: React.FC<VirtualTryOnPageProps> = ({
  products,
  initialProduct,
  onViewProduct,
  onAddToCart,
  onNavigateHome,
}) => {
  // Required Virtual Try-On States (Section 1, 4, 12):
  // 1. originalChildImage (starts null as per Section 2)
  // 2. selectedProduct
  // 3. generatedTryOnImage
  // 4. tryOnStatus ("idle" | "uploading" | "generating" | "success" | "error")
  const [originalChildImage, setOriginalChildImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct || products[0] || null);
  const [generatedTryOnImage, setGeneratedTryOnImage] = useState<string | null>(null);
  const [tryOnStatus, setTryOnStatus] = useState<TryOnStatus>('idle');

  const [activeCanvasView, setActiveCanvasView] = useState<'original' | 'result'>('original');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      setGeneratedTryOnImage(null);
      setIsCompleted(false);
      setTryOnStatus('idle');
      setErrorMessage(null);
      setValidationError(null);
      setActiveCanvasView('original');
    }
  }, [initialProduct]);

  // Section 1, 3, 4, 7, 9: Handle selecting or replacing child image
  const handleSelectChildImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const dataUrl = e.target.result as string;
        // 1. Store as originalChildImage
        setOriginalChildImage(dataUrl);
        // 2. Clear any previous generated result (Section 9: never display old result for different child)
        setGeneratedTryOnImage(null);
        setIsCompleted(false);
        // 3. Reset status to "idle"
        setTryOnStatus('idle');
        setErrorMessage(null);
        setValidationError(null);
        setActiveCanvasView('original');
        // selectedProduct remains UNCHANGED (Section 4 & 6)
      }
    };
    reader.readAsDataURL(file);
  };

  // Section 5 & 6: Delete photo
  const handleRemoveChildPhoto = () => {
    // 1. originalChildImage = null
    setOriginalChildImage(null);
    // 2. generatedTryOnImage = null
    setGeneratedTryOnImage(null);
    // 3. tryOnStatus = "idle"
    setTryOnStatus('idle');
    setIsCompleted(false);
    setErrorMessage(null);
    setValidationError(null);
    setActiveCanvasView('original');
    // IMPORTANT (Section 6): Deleting child image must NOT remove selectedProduct
  };

  // Drag & drop garment selection (Section 14)
  const handleDropProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
      setGeneratedTryOnImage(null);
      setIsCompleted(false);
      setTryOnStatus('idle');
      setErrorMessage(null);
      setValidationError(null);
      setActiveCanvasView('original');
    }
  };

  // Clothing library selection
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setGeneratedTryOnImage(null);
    setIsCompleted(false);
    setTryOnStatus('idle');
    setErrorMessage(null);
    setValidationError(null);
    setActiveCanvasView('original');
  };

  // Section 5 & 11: Try-On execution & validation
  const handleGenerateTryOn = async () => {
    // 1. Check if there is no originalChildImage (Section 11)
    if (!originalChildImage) {
      setValidationError('ابتدا عکس کودک را اضافه کنید.');
      return;
    }

    // 2. Check if there is no selectedProduct (Section 11)
    if (!selectedProduct) {
      setValidationError('ابتدا یک لباس را انتخاب کنید.');
      return;
    }

    // Prevent concurrent requests (Section 5 & 9)
    if (tryOnStatus === 'uploading' || tryOnStatus === 'generating') {
      return;
    }

    setValidationError(null);
    setErrorMessage(null);
    setTryOnStatus('uploading');
    setIsCompleted(false);

    try {
      setTryOnStatus('generating');

      // Send to existing n8n webhook with Character_Image & Product_Image (Section 10)
      const result = await tryOnService.generateTryOn(
        originalChildImage,
        selectedProduct.image
      );

      if (result.success && result.imageUrl) {
        setGeneratedTryOnImage(result.imageUrl);
        setTryOnStatus('success');
        setActiveCanvasView('result');
        setIsCompleted(true);
      } else {
        setTryOnStatus('error');
        setErrorMessage(
          result.errorMessage || 'متأسفانه پرو لباس انجام نشد. لطفاً دوباره تلاش کنید.'
        );
      }
    } catch (err: unknown) {
      console.error('[Try-On] Execution error:', err);
      setTryOnStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'متأسفانه پرو لباس انجام نشد. لطفاً دوباره تلاش کنید.'
      );
    }
  };

  // When changing photo from the result screen
  const handleChangePhotoFromResult = () => {
    setGeneratedTryOnImage(null);
    setIsCompleted(false);
    setTryOnStatus('idle');
    setActiveCanvasView('original');
  };

  // When trying another cloth from the result screen
  const handleTryAnotherCloth = () => {
    setGeneratedTryOnImage(null);
    setIsCompleted(false);
    setTryOnStatus('idle');
    setActiveCanvasView('original');
  };

  const isProcessing = tryOnStatus === 'uploading' || tryOnStatus === 'generating';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24">
      
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-neutral-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-950 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>پرو هوشمند و واقع‌گرایانه</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            پرو لباس مجازی
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            عکس کودک خود را بارگذاری و لباس دلخواه را برای پرو هوشمند انتخاب کنید
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="self-start sm:self-center text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فروشگاه</span>
        </button>
      </div>

      {/* Main Studio Views */}
      {isCompleted && generatedTryOnImage && selectedProduct && originalChildImage ? (
        /* Result Screen View (Section 13) */
        <div className="py-2 animate-in fade-in duration-300">
          <TryOnResult
            originalChildImage={originalChildImage}
            generatedTryOnImage={generatedTryOnImage}
            product={selectedProduct}
            onTryAnotherCloth={handleTryAnotherCloth}
            onChangePhoto={handleChangePhotoFromResult}
            onViewProduct={onViewProduct}
            onAddToCart={onAddToCart}
          />
        </div>
      ) : (
        /* 3-Section Studio Workspace (Always preserved!) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Section 1 (Right in RTL): Clothing Library (4 cols on lg) */}
          <div className="lg:col-span-4 order-2 lg:order-1 h-[620px]">
            <ClothingLibrary
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={handleSelectProduct}
            />
          </div>

          {/* Section 2 (Center in RTL): Try-On Canvas (5 cols on lg) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <TryOnCanvas
              originalChildImage={originalChildImage}
              generatedTryOnImage={generatedTryOnImage}
              activeView={activeCanvasView}
              onToggleView={setActiveCanvasView}
              selectedProduct={selectedProduct}
              onDropProduct={handleDropProduct}
              onSelectChildImage={handleSelectChildImage}
              onRemoveChildPhoto={handleRemoveChildPhoto}
              isProcessing={isProcessing}
              onGenerateTryOn={handleGenerateTryOn}
              errorMessage={errorMessage}
              validationError={validationError}
            />
          </div>

          {/* Section 3 (Left in RTL): Selected Garment Info Panel (3 cols on lg) */}
          <div className="lg:col-span-3 order-3 h-[620px]">
            <SelectedProductPanel
              product={selectedProduct}
              hasChildImage={!!originalChildImage}
              onGenerateTryOn={handleGenerateTryOn}
              isProcessing={isProcessing}
              onViewProductDetails={onViewProduct}
              errorMessage={errorMessage}
            />
          </div>

        </div>
      )}

    </div>
  );
};
