/**
 * Reverse Engineered Freepik.com API Client
 * Based on analysis of freepik.com network traffic and JavaScript bundles
 */

import type { AnonymousSession } from '../auth/types';
import { getSessionHeaders } from '../auth/session';
import type {
  ApiResponse,
  ImageGenerationRequest,
  ImageGenerationResult,
  Asset,
  AssetSearchParams,
  AssetSearchResult,
  Workspace,
  CanvasState,
} from './types';

const FREEPIK_API_BASE = 'https://www.freepik.com/api';
const FREEPIK_ID_BASE = 'https://id.freepik.com/api/v2';

/**
 * Freepik API Client
 * Reverse engineered from freepik.com network analysis
 */
export class FreepikClient {
  private session: AnonymousSession;
  private baseUrl: string;
  private idUrl: string;

  constructor(session: AnonymousSession) {
    this.session = session;
    this.baseUrl = FREEPIK_API_BASE;
    this.idUrl = FREEPIK_ID_BASE;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...getSessionHeaders(this.session),
      // Reverse engineered headers from Freepik
      'X-Requested-With': 'XMLHttpRequest',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    usesIdApi = false
  ): Promise<ApiResponse<T>> {
    const url = `${usesIdApi ? this.idUrl : this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers as Record<string, string>),
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: data.message || 'Request failed',
            details: data,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
        },
      };
    }
  }

  // ============ Country & Pricing APIs ============

  /**
   * Get country information
   * Endpoint: GET /api/country
   */
  async getCountry(): Promise<ApiResponse<CountryInfo>> {
    return this.request<CountryInfo>('/country');
  }

  /**
   * Get pricing plans
   * Endpoint: GET /api/pricing-plans
   */
  async getPricingPlans(seats = 1): Promise<ApiResponse<PricingPlan[]>> {
    return this.request<PricingPlan[]>(`/pricing-plans?seats=${seats}`);
  }

  // ============ Image Generation APIs ============

  /**
   * Generate image using Freepik AI Suite
   * Reverse engineered from /api/image-generation endpoint
   */
  async generateImage(
    request: ImageGenerationRequest
  ): Promise<ApiResponse<ImageGenerationResult>> {
    return this.request<ImageGenerationResult>('/image-generation', {
      method: 'POST',
      body: JSON.stringify({
        prompt: request.prompt,
        negative_prompt: request.negativePrompt,
        model: this.mapModelToFreepik(request.model),
        width: request.width || 1024,
        height: request.height || 1024,
        aspect_ratio: request.aspectRatio,
        num_inference_steps: request.steps || 30,
        guidance_scale: request.guidanceScale || 7.5,
        seed: request.seed,
        style: request.stylePreset,
      }),
    });
  }

  /**
   * Map our model names to Freepik's internal model identifiers
   */
  private mapModelToFreepik(model: string): string {
    const modelMap: Record<string, string> = {
      'flux-schnell': 'flux',
      'flux-dev': 'flux',
      'flux-pro': 'flux-pro',
      'stable-diffusion-xl': 'sdxl',
      'stable-diffusion-3': 'sd3',
      'sdxl-turbo': 'sdxl-turbo',
      'dalle-3': 'gpt-image',
      'ideogram': 'ideogram',
      'midjourney': 'mystic',
    };
    return modelMap[model] || model;
  }

  /**
   * Get generation status
   */
  async getGenerationStatus(jobId: string): Promise<ApiResponse<ImageGenerationResult>> {
    return this.request<ImageGenerationResult>(`/image-generation/${jobId}`);
  }

  // ============ Asset Library APIs ============

  /**
   * Search assets (photos, vectors, videos, etc.)
   * Reverse engineered search endpoint
   */
  async searchAssets(params: AssetSearchParams): Promise<ApiResponse<AssetSearchResult>> {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.set('q', params.query);
    if (params.type) queryParams.set('type', params.type);
    if (params.license) queryParams.set('license', params.license);
    if (params.orientation) queryParams.set('orientation', params.orientation);
    if (params.color) queryParams.set('color', params.color);
    if (params.page) queryParams.set('page', String(params.page));
    if (params.limit) queryParams.set('limit', String(params.limit));
    if (params.sortBy) queryParams.set('sort', params.sortBy);
    
    return this.request<AssetSearchResult>(`/search?${queryParams.toString()}`);
  }

  /**
   * Get asset details
   */
  async getAsset(assetId: string): Promise<ApiResponse<Asset>> {
    return this.request<Asset>(`/assets/${assetId}`);
  }

  /**
   * Get asset download URL
   */
  async getAssetDownload(assetId: string): Promise<ApiResponse<AssetDownload>> {
    return this.request<AssetDownload>(`/assets/${assetId}/download`);
  }

  // ============ Workspace/Spaces APIs ============

  /**
   * Create a new workspace (Freepik Spaces)
   */
  async createWorkspace(name: string, description?: string): Promise<ApiResponse<Workspace>> {
    return this.request<Workspace>('/spaces', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  /**
   * Get workspace by ID
   */
  async getWorkspace(workspaceId: string): Promise<ApiResponse<Workspace>> {
    return this.request<Workspace>(`/spaces/${workspaceId}`);
  }

  /**
   * Update workspace canvas state
   */
  async updateCanvas(
    workspaceId: string,
    canvas: CanvasState
  ): Promise<ApiResponse<Workspace>> {
    return this.request<Workspace>(`/spaces/${workspaceId}/canvas`, {
      method: 'PUT',
      body: JSON.stringify(canvas),
    });
  }

  /**
   * List user's workspaces
   */
  async listWorkspaces(): Promise<ApiResponse<Workspace[]>> {
    return this.request<Workspace[]>('/spaces');
  }

  // ============ Image Editing APIs ============

  /**
   * Remove background from image
   */
  async removeBackground(imageUrl: string): Promise<ApiResponse<EditResult>> {
    return this.request<EditResult>('/edit/background-remove', {
      method: 'POST',
      body: JSON.stringify({ image: imageUrl }),
    });
  }

  /**
   * Upscale image
   */
  async upscaleImage(
    imageUrl: string,
    scale: 2 | 4 = 2
  ): Promise<ApiResponse<EditResult>> {
    return this.request<EditResult>('/edit/upscale', {
      method: 'POST',
      body: JSON.stringify({ image: imageUrl, scale }),
    });
  }

  /**
   * Inpaint/edit image region
   */
  async inpaintImage(
    imageUrl: string,
    maskUrl: string,
    prompt: string
  ): Promise<ApiResponse<EditResult>> {
    return this.request<EditResult>('/edit/inpaint', {
      method: 'POST',
      body: JSON.stringify({
        image: imageUrl,
        mask: maskUrl,
        prompt,
      }),
    });
  }
}

// ============ Type Definitions (Reverse Engineered) ============

interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  locale: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  downloads: number;
  aiCredits: number;
  recommended?: boolean;
}

interface AssetDownload {
  url: string;
  expiresAt: number;
  format: string;
  size: number;
}

interface EditResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputUrl?: string;
  error?: string;
}

/**
 * Create Freepik client instance
 */
export function createFreepikClient(session: AnonymousSession): FreepikClient {
  return new FreepikClient(session);
}
