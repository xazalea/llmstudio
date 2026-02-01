/**
 * Reverse Engineered Higgsfield.ai API Client
 * Based on analysis of fnf.higgsfield.ai, cms.higgsfield.ai, and clerk.higgsfield.ai
 */

import type { AnonymousSession } from '../auth/types';
import { getSessionHeaders } from '../auth/session';
import type {
  ApiResponse,
  ImageGenerationRequest,
  ImageGenerationResult,
  VideoGenerationRequest,
  VideoGenerationResult,
  ImageEditRequest,
  ImageEditResult,
  MotionPreset,
} from './types';

const HIGGSFIELD_API_BASE = 'https://fnf.higgsfield.ai';
const HIGGSFIELD_CMS_BASE = 'https://cms.higgsfield.ai';

/**
 * Higgsfield API Client
 * Reverse engineered from higgsfield.ai network analysis
 */
export class HiggsfieldClient {
  private session: AnonymousSession;
  private baseUrl: string;
  private cmsUrl: string;

  constructor(session: AnonymousSession) {
    this.session = session;
    this.baseUrl = HIGGSFIELD_API_BASE;
    this.cmsUrl = HIGGSFIELD_CMS_BASE;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...getSessionHeaders(this.session),
      // Reverse engineered headers from Higgsfield
      'X-Client-Version': '1.0.0',
      'X-Platform': 'web',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    usesCms = false
  ): Promise<ApiResponse<T>> {
    const url = `${usesCms ? this.cmsUrl : this.baseUrl}${endpoint}`;
    
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

  // ============ User & Subscription APIs ============
  
  /**
   * Get user metadata (country, region, cohort)
   * Endpoint: GET /user/meta
   */
  async getUserMeta(): Promise<ApiResponse<UserMeta>> {
    return this.request<UserMeta>('/user/meta');
  }

  /**
   * Get subscription plans
   * Endpoint: GET /subscriptions/plans
   */
  async getSubscriptionPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return this.request<SubscriptionPlan[]>('/subscriptions/plans');
  }

  /**
   * Get subscription packages
   * Endpoint: GET /subscriptions/packages
   */
  async getSubscriptionPackages(): Promise<ApiResponse<SubscriptionPackage[]>> {
    return this.request<SubscriptionPackage[]>('/subscriptions/packages');
  }

  /**
   * Get workspace plans
   * Endpoint: GET /workspaces/plans
   */
  async getWorkspacePlans(): Promise<ApiResponse<WorkspacePlan[]>> {
    return this.request<WorkspacePlan[]>('/workspaces/plans');
  }

  // ============ CMS APIs ============

  /**
   * Get site notices
   * Endpoint: GET /notices
   */
  async getNotices(): Promise<ApiResponse<Notice[]>> {
    return this.request<Notice[]>('/notices', {}, true);
  }

  /**
   * Get Kling motion presets
   * Endpoint: GET /kling-motions/{id}
   */
  async getKlingMotions(id?: string): Promise<ApiResponse<MotionPreset[]>> {
    const endpoint = id ? `/kling-motions/${id}` : '/kling-motions';
    return this.request<MotionPreset[]>(endpoint, {}, true);
  }

  // ============ Image Generation APIs ============

  /**
   * Generate image
   * Reverse engineered endpoint for image generation
   */
  async generateImage(
    request: ImageGenerationRequest
  ): Promise<ApiResponse<ImageGenerationResult>> {
    return this.request<ImageGenerationResult>('/generations/image', {
      method: 'POST',
      body: JSON.stringify({
        prompt: request.prompt,
        negative_prompt: request.negativePrompt,
        model: request.model,
        width: request.width || 1024,
        height: request.height || 1024,
        aspect_ratio: request.aspectRatio,
        steps: request.steps || 30,
        guidance_scale: request.guidanceScale || 7.5,
        seed: request.seed,
        style_preset: request.stylePreset,
        reference_image: request.referenceImage,
        control_image: request.controlImage,
        control_type: request.controlType,
      }),
    });
  }

  /**
   * Get generation job status
   */
  async getGenerationStatus(jobId: string): Promise<ApiResponse<ImageGenerationResult>> {
    return this.request<ImageGenerationResult>(`/generations/${jobId}`);
  }

  // ============ Video Generation APIs ============

  /**
   * Generate video
   * Reverse engineered endpoint for video generation
   */
  async generateVideo(
    request: VideoGenerationRequest
  ): Promise<ApiResponse<VideoGenerationResult>> {
    return this.request<VideoGenerationResult>('/generations/video', {
      method: 'POST',
      body: JSON.stringify({
        prompt: request.prompt,
        negative_prompt: request.negativePrompt,
        model: request.model,
        duration: request.duration || 4,
        fps: request.fps || 24,
        width: request.width || 1024,
        height: request.height || 576,
        aspect_ratio: request.aspectRatio,
        start_frame: request.startFrame,
        end_frame: request.endFrame,
        motion_preset: request.motionPreset,
        motion_strength: request.motionStrength,
        camera_control: request.cameraControl,
      }),
    });
  }

  /**
   * Get video generation status
   */
  async getVideoStatus(jobId: string): Promise<ApiResponse<VideoGenerationResult>> {
    return this.request<VideoGenerationResult>(`/generations/video/${jobId}`);
  }

  // ============ Image Editing APIs ============

  /**
   * Edit image (inpaint, upscale, etc.)
   */
  async editImage(request: ImageEditRequest): Promise<ApiResponse<ImageEditResult>> {
    return this.request<ImageEditResult>('/edits/image', {
      method: 'POST',
      body: JSON.stringify({
        image: request.image,
        operation: request.operation,
        mask: request.mask,
        prompt: request.prompt,
        strength: request.strength,
        params: request.params,
      }),
    });
  }

  /**
   * Get edit job status
   */
  async getEditStatus(jobId: string): Promise<ApiResponse<ImageEditResult>> {
    return this.request<ImageEditResult>(`/edits/${jobId}`);
  }
}

// ============ Type Definitions (Reverse Engineered) ============

interface UserMeta {
  country: string;
  region: string;
  cohort: string;
  features: string[];
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    imageGenerations: number;
    videoGenerations: number;
    storage: number;
  };
}

interface SubscriptionPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
}

interface WorkspacePlan {
  id: string;
  name: string;
  seats: number;
  price: number;
  features: string[];
}

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'update';
  createdAt: string;
  expiresAt?: string;
}

/**
 * Create Higgsfield client instance
 */
export function createHiggsfieldClient(session: AnonymousSession): HiggsfieldClient {
  return new HiggsfieldClient(session);
}
