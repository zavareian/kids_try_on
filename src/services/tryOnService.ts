import { TRY_ON_WEBHOOK_URL } from '../config/constants';

export interface TryOnApiResponse {
  status?: string;
  imageUrl?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface TryOnServiceResult {
  success: boolean;
  imageUrl?: string;
  errorMessage?: string;
  rawResponse?: TryOnApiResponse;
}

/**
 * Converts a data URL, file path, remote URL, or Blob into a true binary Blob
 * so the browser can send it as a real multipart file.
 */
async function toBlob(source: string | Blob | File, defaultFilename: string): Promise<File> {
  if (source instanceof File) {
    return source;
  }
  if (source instanceof Blob) {
    return new File([source], defaultFilename, { type: source.type || 'image/jpeg' });
  }
  if (typeof source === 'string') {
    if (source.startsWith('data:')) {
      const parts = source.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const binary = atob(parts[1]);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      return new File([array], defaultFilename, { type: mime });
    }

    // Fetch relative asset or URL
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`بارگذاری تصویر (${defaultFilename}) با خطای ${response.status} مواجه شد.`);
    }
    const blob = await response.blob();
    return new File([blob], defaultFilename, { type: blob.type || 'image/jpeg' });
  }

  throw new Error('فرمت تصویر ورودی نامعتبر است.');
}

/**
 * Service to connect directly to the existing n8n Virtual Try-On Webhook.
 * Sends:
 *   - Character_Image
 *   - Product_Image
 * via POST multipart/form-data.
 */
class TryOnService {
  private webhookUrl: string = TRY_ON_WEBHOOK_URL;

  public setWebhookUrl(url: string) {
    this.webhookUrl = url;
  }

  public getWebhookUrl(): string {
    return this.webhookUrl;
  }

  /**
   * Generates Virtual Try-On by dispatching Character_Image and Product_Image to n8n Webhook.
   * Can be called as generateTryOn(childImage, productImage) or generateTryOn({ childImage, productImage }).
   */
  public async generateTryOn(
    childImageOrPayload: string | Blob | File | { childImage: string | Blob | File; productImage: string | Blob | File },
    productImageParam?: string | Blob | File
  ): Promise<TryOnServiceResult> {
    let childImage: string | Blob | File;
    let productImage: string | Blob | File;

    if (
      typeof childImageOrPayload === 'object' &&
      childImageOrPayload !== null &&
      !(childImageOrPayload instanceof Blob) &&
      'childImage' in childImageOrPayload
    ) {
      childImage = childImageOrPayload.childImage;
      productImage = childImageOrPayload.productImage;
    } else {
      childImage = childImageOrPayload as string | Blob | File;
      productImage = productImageParam as string | Blob | File;
    }

    // Validation
    if (!childImage) {
      return {
        success: false,
        errorMessage: 'عکس کودک مشخص نشده است. لطفاً ابتدا عکس کودک را انتخاب کنید.',
      };
    }

    if (!productImage) {
      return {
        success: false,
        errorMessage: 'لباس انتخاب نشده است. لطفاً ابتدا یک لباس انتخاب کنید.',
      };
    }

    // Convert both to binary file blobs
    const characterFile = await toBlob(childImage, 'Character_Image.jpg');
    const productFile = await toBlob(productImage, 'Product_Image.jpg');

    // Create FormData (Browser automatically sets boundary; DO NOT set Content-Type header)
    const formData = new FormData();
    formData.append('Character_Image', characterFile);
    formData.append('Product_Image', productFile);

    // Development Debug Logging
    console.log('[n8n Try-On] Webhook request started');
    console.log('[n8n Try-On] Target URL:', this.webhookUrl);
    console.log('[n8n Try-On] Character_Image exists:', Boolean(characterFile), `(${characterFile.size} bytes)`);
    console.log('[n8n Try-On] Product_Image exists:', Boolean(productFile), `(${productFile.size} bytes)`);

    let response: Response;
    try {
      response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: formData,
      });
    } catch (networkError) {
      console.error('[Try-On] Network error:', networkError);
      return {
        success: false,
        errorMessage: 'خطای ارتباط با سرور پرو لباس. لطفاً اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید.',
      };
    }

    console.log('[Try-On] HTTP status:', response.status);

    if (!response.ok) {
      console.error(`[Try-On] HTTP error: status ${response.status}`);
      return {
        success: false,
        errorMessage: `خطای سرور پرو لباس (کد ${response.status}). لطفاً دوباره تلاش کنید.`,
      };
    }

    let parsedResponse: TryOnApiResponse;
    try {
      const rawText = await response.text();
      try {
        const json = JSON.parse(rawText);
        // If returns an array: [{ status: "...", imageUrl: "..." }]
        parsedResponse = Array.isArray(json) ? json[0] : json;
      } catch {
        console.error('[Try-On] Invalid JSON response:', rawText);
        return {
          success: false,
          errorMessage: 'پاسخ دریافتی از سرور معتبر نبود.',
        };
      }
    } catch (parseError) {
      console.error('[Try-On] Error reading response body:', parseError);
      return {
        success: false,
        errorMessage: 'خطا در دریافت پاسخ پرو هوشمند.',
      };
    }

    console.log('[Try-On] Parsed response:', parsedResponse);

    // Handle status === "error"
    if (parsedResponse.status === 'error') {
      const msg = parsedResponse.message || parsedResponse.error || 'پرو لباس با خطا مواجه شد.';
      return {
        success: false,
        errorMessage: msg,
        rawResponse: parsedResponse,
      };
    }

    // Extract imageUrl
    let returnedImageUrl: string | undefined;
    if (typeof parsedResponse.imageUrl === 'string' && parsedResponse.imageUrl) {
      returnedImageUrl = parsedResponse.imageUrl;
    } else if (
      parsedResponse.data &&
      typeof parsedResponse.data === 'object' &&
      'imageUrl' in (parsedResponse.data as Record<string, unknown>) &&
      typeof (parsedResponse.data as Record<string, unknown>).imageUrl === 'string'
    ) {
      returnedImageUrl = (parsedResponse.data as Record<string, unknown>).imageUrl as string;
    } else if (typeof parsedResponse.resultImageUrl === 'string' && parsedResponse.resultImageUrl) {
      returnedImageUrl = parsedResponse.resultImageUrl;
    }

    if (!returnedImageUrl) {
      console.error('[Try-On] Missing imageUrl in response:', parsedResponse);
      return {
        success: false,
        errorMessage: 'تصویر نهایی پرو در پاسخ سرور یافت نشد.',
        rawResponse: parsedResponse,
      };
    }

    return {
      success: true,
      imageUrl: returnedImageUrl,
      rawResponse: parsedResponse,
    };
  }
}

export const tryOnService = new TryOnService();
