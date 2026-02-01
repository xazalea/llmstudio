/**
 * Free AI Image Generation Integration
 * Uses Hugging Face Inference API and other free services
 */

import type {
  ImageGenerationRequest,
  ImageGenerationResult,
  ImageModel,
  GeneratedImage,
} from '../api/types';

// Free API endpoints
const HUGGINGFACE_INFERENCE_API = 'https://api-inference.huggingface.co/models';

// Model configurations for free alternatives
const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'stable-diffusion-xl': {
    provider: 'huggingface',
    modelId: 'stabilityai/stable-diffusion-xl-base-1.0',
    maxSteps: 50,
    defaultSteps: 30,
  },
  'stable-diffusion-3': {
    provider: 'huggingface',
    modelId: 'stabilityai/stable-diffusion-3-medium-diffusers',
    maxSteps: 50,
    defaultSteps: 28,
  },
  'flux-schnell': {
    provider: 'huggingface',
    modelId: 'black-forest-labs/FLUX.1-schnell',
    maxSteps: 4,
    defaultSteps: 4,
  },
  'flux-dev': {
    provider: 'huggingface',
    modelId: 'black-forest-labs/FLUX.1-dev',
    maxSteps: 50,
    defaultSteps: 30,
  },
  'sdxl-turbo': {
    provider: 'huggingface',
    modelId: 'stabilityai/sdxl-turbo',
    maxSteps: 4,
    defaultSteps: 1,
  },
  'playground-v2': {
    provider: 'huggingface',
    modelId: 'playgroundai/playground-v2.5-1024px-aesthetic',
    maxSteps: 50,
    defaultSteps: 30,
  },
  'kandinsky-3': {
    provider: 'huggingface',
    modelId: 'kandinsky-community/kandinsky-3',
    maxSteps: 50,
    defaultSteps: 25,
  },
};

interface ModelConfig {
  provider: 'huggingface' | 'replicate' | 'local';
  modelId: string;
  maxSteps: number;
  defaultSteps: number;
  apiKey?: string;
}

interface GenerationOptions {
  apiKey?: string;
  timeout?: number;
}

/**
 * Unified Image Generator
 * Provides a single interface for multiple free AI image generation models
 */
export class ImageGenerator {
  private apiKey?: string;
  private timeout: number;

  constructor(options: GenerationOptions = {}) {
    this.apiKey = options.apiKey;
    this.timeout = options.timeout || 120000; // 2 minutes default
  }

  /**
   * Generate images using the specified model
   */
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const jobId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      const config = MODEL_CONFIGS[request.model];
      if (!config) {
        throw new Error(`Unsupported model: ${request.model}`);
      }

      let images: GeneratedImage[];

      switch (config.provider) {
        case 'huggingface':
          images = await this.generateWithHuggingFace(request, config);
          break;
        default:
          throw new Error(`Unsupported provider: ${config.provider}`);
      }

      return {
        id: jobId,
        status: 'completed',
        images,
        prompt: request.prompt,
        model: request.model,
        createdAt: startTime,
        completedAt: Date.now(),
      };
    } catch (error) {
      return {
        id: jobId,
        status: 'failed',
        images: [],
        prompt: request.prompt,
        model: request.model,
        createdAt: startTime,
        completedAt: Date.now(),
      };
    }
  }

  /**
   * Generate with Hugging Face Inference API
   */
  private async generateWithHuggingFace(
    request: ImageGenerationRequest,
    config: ModelConfig
  ): Promise<GeneratedImage[]> {
    const url = `${HUGGINGFACE_INFERENCE_API}/${config.modelId}`;
    
    const payload = {
      inputs: request.prompt,
      parameters: {
        negative_prompt: request.negativePrompt || '',
        width: request.width || 1024,
        height: request.height || 1024,
        num_inference_steps: Math.min(
          request.steps || config.defaultSteps,
          config.maxSteps
        ),
        guidance_scale: request.guidanceScale || 7.5,
        seed: request.seed,
      },
    };

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

    // Hugging Face returns image as blob
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    return [
      {
        url: imageUrl,
        width: request.width || 1024,
        height: request.height || 1024,
        seed: request.seed,
      },
    ];
  }

  /**
   * Get available models
   */
  getAvailableModels(): ImageModelInfo[] {
    return Object.entries(MODEL_CONFIGS).map(([id, config]) => ({
      id: id as ImageModel,
      name: this.getModelDisplayName(id),
      provider: config.provider,
      maxSteps: config.maxSteps,
      defaultSteps: config.defaultSteps,
      description: this.getModelDescription(id),
    }));
  }

  private getModelDisplayName(modelId: string): string {
    const names: Record<string, string> = {
      'stable-diffusion-xl': 'Stable Diffusion XL',
      'stable-diffusion-3': 'Stable Diffusion 3',
      'flux-schnell': 'FLUX.1 Schnell',
      'flux-dev': 'FLUX.1 Dev',
      'sdxl-turbo': 'SDXL Turbo',
      'playground-v2': 'Playground v2.5',
      'kandinsky-3': 'Kandinsky 3',
    };
    return names[modelId] || modelId;
  }

  private getModelDescription(modelId: string): string {
    const descriptions: Record<string, string> = {
      'stable-diffusion-xl': 'High-quality 1024x1024 images with excellent detail',
      'stable-diffusion-3': 'Latest SD model with improved text rendering',
      'flux-schnell': 'Ultra-fast generation (4 steps) with great quality',
      'flux-dev': 'High-quality FLUX model for detailed generations',
      'sdxl-turbo': 'Lightning-fast single-step generation',
      'playground-v2': 'Aesthetic-focused model for artistic images',
      'kandinsky-3': 'Multilingual model with unique artistic style',
    };
    return descriptions[modelId] || '';
  }
}

interface ImageModelInfo {
  id: ImageModel;
  name: string;
  provider: string;
  maxSteps: number;
  defaultSteps: number;
  description: string;
}

/**
 * Create image generator instance
 */
export function createImageGenerator(options?: GenerationOptions): ImageGenerator {
  return new ImageGenerator(options);
}

/**
 * Get dimension presets for different aspect ratios
 */
export function getDimensionsForAspectRatio(
  aspectRatio: string,
  maxDimension = 1024
): { width: number; height: number } {
  const ratios: Record<string, [number, number]> = {
    '1:1': [1, 1],
    '4:3': [4, 3],
    '3:4': [3, 4],
    '16:9': [16, 9],
    '9:16': [9, 16],
    '21:9': [21, 9],
    '9:21': [9, 21],
    '3:2': [3, 2],
    '2:3': [2, 3],
  };

  const [w, h] = ratios[aspectRatio] || [1, 1];
  const scale = maxDimension / Math.max(w, h);
  
  return {
    width: Math.round((w * scale) / 64) * 64, // Round to nearest 64
    height: Math.round((h * scale) / 64) * 64,
  };
}
