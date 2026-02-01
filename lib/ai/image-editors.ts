/**
 * Free AI Image Editing Tools
 * Uses open-source models for inpainting, upscaling, background removal, etc.
 */

import type {
  ImageEditRequest,
  ImageEditResult,
  ImageEditOperation,
} from '../api/types';

const HUGGINGFACE_INFERENCE_API = 'https://api-inference.huggingface.co/models';

// Model configurations for different editing operations
const EDIT_MODEL_CONFIGS: Record<ImageEditOperation, EditModelConfig> = {
  'inpaint': {
    modelId: 'runwayml/stable-diffusion-inpainting',
    description: 'AI-powered object removal and replacement',
  },
  'outpaint': {
    modelId: 'runwayml/stable-diffusion-inpainting',
    description: 'Extend images beyond their borders',
  },
  'upscale': {
    modelId: 'caidas/swin2SR-realworld-sr-x4-64-bsrgan-psnr',
    description: 'Enhance resolution up to 4x',
  },
  'background-remove': {
    modelId: 'briaai/RMBG-1.4',
    description: 'Remove background from images',
  },
  'background-replace': {
    modelId: 'runwayml/stable-diffusion-inpainting',
    description: 'Replace background with AI-generated content',
  },
  'style-transfer': {
    modelId: 'CompVis/stable-diffusion-v1-4',
    description: 'Apply artistic styles to images',
  },
  'face-swap': {
    modelId: 'InstantX/InstantID',
    description: 'Swap faces between images',
  },
  'colorize': {
    modelId: 'baldwinsuen/deoldify-colorizer',
    description: 'Add color to black and white images',
  },
  'denoise': {
    modelId: 'nvidia/swinir',
    description: 'Remove noise and artifacts',
  },
  'enhance': {
    modelId: 'google/maxim-deblurring-realblur',
    description: 'Enhance overall image quality',
  },
};

interface EditModelConfig {
  modelId: string;
  description: string;
}

interface ImageEditorOptions {
  apiKey?: string;
  timeout?: number;
}

/**
 * Unified Image Editor
 * Provides AI-powered image editing tools using free models
 */
export class ImageEditor {
  private apiKey?: string;
  private timeout: number;

  constructor(options: ImageEditorOptions = {}) {
    this.apiKey = options.apiKey;
    this.timeout = options.timeout || 120000;
  }

  /**
   * Edit image with specified operation
   */
  async edit(request: ImageEditRequest): Promise<ImageEditResult> {
    const jobId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      const config = EDIT_MODEL_CONFIGS[request.operation];
      if (!config) {
        throw new Error(`Unsupported operation: ${request.operation}`);
      }

      let outputUrl: string;

      switch (request.operation) {
        case 'inpaint':
        case 'outpaint':
        case 'background-replace':
          outputUrl = await this.runInpainting(request, config);
          break;
        case 'upscale':
          outputUrl = await this.runUpscale(request, config);
          break;
        case 'background-remove':
          outputUrl = await this.runBackgroundRemoval(request, config);
          break;
        case 'style-transfer':
          outputUrl = await this.runStyleTransfer(request, config);
          break;
        case 'colorize':
          outputUrl = await this.runColorize(request, config);
          break;
        case 'denoise':
        case 'enhance':
          outputUrl = await this.runEnhance(request, config);
          break;
        default:
          throw new Error(`Operation not implemented: ${request.operation}`);
      }

      return {
        id: jobId,
        status: 'completed',
        outputUrl,
        originalUrl: request.image,
        operation: request.operation,
        createdAt: startTime,
        completedAt: Date.now(),
      };
    } catch (error) {
      return {
        id: jobId,
        status: 'failed',
        originalUrl: request.image,
        operation: request.operation,
        createdAt: startTime,
        completedAt: Date.now(),
      };
    }
  }

  /**
   * Run inpainting operation
   */
  private async runInpainting(
    request: ImageEditRequest,
    config: EditModelConfig
  ): Promise<string> {
    const url = `${HUGGINGFACE_INFERENCE_API}/${config.modelId}`;

    // Convert images to base64 if needed
    const imageData = await this.prepareImageData(request.image);
    const maskData = request.mask ? await this.prepareImageData(request.mask) : null;

    const payload = {
      inputs: {
        image: imageData,
        mask: maskData,
        prompt: request.prompt || 'seamless fill',
        negative_prompt: 'blurry, low quality, artifacts',
        strength: request.strength || 0.8,
      },
    };

    return this.makeRequest(url, payload);
  }

  /**
   * Run upscaling operation
   */
  private async runUpscale(
    request: ImageEditRequest,
    config: EditModelConfig
  ): Promise<string> {
    const url = `${HUGGINGFACE_INFERENCE_API}/${config.modelId}`;

    const imageData = await this.prepareImageData(request.image);

    const payload = {
      inputs: imageData,
      parameters: {
        scale: request.params?.scale || 4,
      },
    };

    return this.makeRequest(url, payload);
  }

  /**
   * Run background removal
   */
  private async runBackgroundRemoval(
    request: ImageEditRequest,
    config: EditModelConfig
  ): Promise<string> {
    const url = `${HUGGINGFACE_INFERENCE_API}/${config.modelId}`;

    const imageData = await this.prepareImageData(request.image);

    const payload = {
      inputs: imageData,
    };

    return this.makeRequest(url, payload);
  }

  /**
   * Run style transfer
   */
  private async runStyleTransfer(
    request: ImageEditRequest,
    config: EditModelConfig
  ): Promise<string> {
    const url = `${HUGGINGFACE_INFERENCE_API}/${config.modelId}`;

    const imageData = await this.prepareImageData(request.image);
    const style = request.params?.style || 'artistic';

    const payload = {
      inputs: {
        image: imageData,
        prompt: `${request.prompt || 'image'} in ${style} style`,
        strength: request.strength || 0.6,
      },
    };

    return this.makeRequest(url, payload);
  }

  /**
   * Run colorization
   */
  private async runColorize(
    request: ImageEditRequest,
    config: EditModelConfig
  ): Promise<string> {
    const url = `${HUGGINGFACE_INFERENCE_API}/${config.modelId}`;

    const imageData = await this.prepareImageData(request.image);

    const payload = {
      inputs: imageData,
    };

    return this.makeRequest(url, payload);
  }

  /**
   * Run enhancement/denoising
   */
  private async runEnhance(
    request: ImageEditRequest,
    config: EditModelConfig
  ): Promise<string> {
    const url = `${HUGGINGFACE_INFERENCE_API}/${config.modelId}`;

    const imageData = await this.prepareImageData(request.image);

    const payload = {
      inputs: imageData,
    };

    return this.makeRequest(url, payload);
  }

  /**
   * Make API request and handle response
   */
  private async makeRequest(url: string, payload: unknown): Promise<string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  /**
   * Prepare image data for API
   */
  private async prepareImageData(imageUrl: string): Promise<string> {
    // If already base64, return as-is
    if (imageUrl.startsWith('data:')) {
      return imageUrl.split(',')[1];
    }

    // If blob URL, convert to base64
    if (imageUrl.startsWith('blob:')) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    // Otherwise return the URL (API will fetch it)
    return imageUrl;
  }

  /**
   * Get available editing operations
   */
  getAvailableOperations(): EditOperationInfo[] {
    return Object.entries(EDIT_MODEL_CONFIGS).map(([id, config]) => ({
      id: id as ImageEditOperation,
      name: this.getOperationDisplayName(id),
      description: config.description,
      requiresMask: ['inpaint', 'outpaint', 'background-replace'].includes(id),
      requiresPrompt: ['inpaint', 'outpaint', 'background-replace', 'style-transfer'].includes(id),
    }));
  }

  private getOperationDisplayName(operationId: string): string {
    const names: Record<string, string> = {
      'inpaint': 'Inpaint / Remove Objects',
      'outpaint': 'Outpaint / Extend',
      'upscale': 'Upscale',
      'background-remove': 'Remove Background',
      'background-replace': 'Replace Background',
      'style-transfer': 'Style Transfer',
      'face-swap': 'Face Swap',
      'colorize': 'Colorize',
      'denoise': 'Denoise',
      'enhance': 'Enhance Quality',
    };
    return names[operationId] || operationId;
  }
}

interface EditOperationInfo {
  id: ImageEditOperation;
  name: string;
  description: string;
  requiresMask: boolean;
  requiresPrompt: boolean;
}

/**
 * Create image editor instance
 */
export function createImageEditor(options?: ImageEditorOptions): ImageEditor {
  return new ImageEditor(options);
}
