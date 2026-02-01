/**
 * Free AI Video Generation Integration
 * Uses open-source models via Hugging Face and other free services
 */

import type {
  VideoGenerationRequest,
  VideoGenerationResult,
  VideoModel,
  MotionPreset,
  CameraControl,
} from '../api/types';

// Free API endpoints
const HUGGINGFACE_INFERENCE_API = 'https://api-inference.huggingface.co/models';

// Video model configurations
const VIDEO_MODEL_CONFIGS: Record<string, VideoModelConfig> = {
  'animatediff': {
    provider: 'huggingface',
    modelId: 'guoyww/animatediff-motion-adapter-v1-5-2',
    maxDuration: 4,
    defaultDuration: 2,
    fps: 8,
  },
  'stable-video-diffusion': {
    provider: 'huggingface',
    modelId: 'stabilityai/stable-video-diffusion-img2vid-xt',
    maxDuration: 4,
    defaultDuration: 3,
    fps: 14,
  },
  'modelscope': {
    provider: 'huggingface',
    modelId: 'damo-vilab/text-to-video-ms-1.7b',
    maxDuration: 2,
    defaultDuration: 2,
    fps: 8,
  },
  'zeroscope': {
    provider: 'huggingface',
    modelId: 'cerspense/zeroscope_v2_576w',
    maxDuration: 3,
    defaultDuration: 2,
    fps: 8,
  },
  'text2video-zero': {
    provider: 'huggingface',
    modelId: 'PAIR/Text2Video-Zero',
    maxDuration: 2,
    defaultDuration: 2,
    fps: 8,
  },
};

interface VideoModelConfig {
  provider: 'huggingface' | 'replicate' | 'local';
  modelId: string;
  maxDuration: number;
  defaultDuration: number;
  fps: number;
}

interface VideoGenerationOptions {
  apiKey?: string;
  timeout?: number;
}

/**
 * Motion presets for video generation
 * Reverse engineered from Higgsfield's Kling motion system
 */
export const MOTION_PRESETS: MotionPreset[] = [
  {
    id: 'static',
    name: 'Static',
    description: 'No camera movement, subtle animation',
    params: { motion_strength: 0.3, camera_movement: 'none' },
  },
  {
    id: 'slow-zoom-in',
    name: 'Slow Zoom In',
    description: 'Gradual zoom towards subject',
    params: { motion_strength: 0.5, camera_movement: 'zoom_in', speed: 0.3 },
  },
  {
    id: 'slow-zoom-out',
    name: 'Slow Zoom Out',
    description: 'Gradual zoom away from subject',
    params: { motion_strength: 0.5, camera_movement: 'zoom_out', speed: 0.3 },
  },
  {
    id: 'pan-left',
    name: 'Pan Left',
    description: 'Smooth horizontal pan to the left',
    params: { motion_strength: 0.6, camera_movement: 'pan_left', speed: 0.4 },
  },
  {
    id: 'pan-right',
    name: 'Pan Right',
    description: 'Smooth horizontal pan to the right',
    params: { motion_strength: 0.6, camera_movement: 'pan_right', speed: 0.4 },
  },
  {
    id: 'tilt-up',
    name: 'Tilt Up',
    description: 'Camera tilts upward',
    params: { motion_strength: 0.6, camera_movement: 'tilt_up', speed: 0.4 },
  },
  {
    id: 'tilt-down',
    name: 'Tilt Down',
    description: 'Camera tilts downward',
    params: { motion_strength: 0.6, camera_movement: 'tilt_down', speed: 0.4 },
  },
  {
    id: 'orbit',
    name: 'Orbit',
    description: 'Camera orbits around subject',
    params: { motion_strength: 0.7, camera_movement: 'orbit', speed: 0.5 },
  },
  {
    id: 'dolly-in',
    name: 'Dolly In',
    description: 'Camera moves towards subject',
    params: { motion_strength: 0.6, camera_movement: 'dolly_in', speed: 0.4 },
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'High motion with dramatic movement',
    params: { motion_strength: 0.9, camera_movement: 'dynamic', speed: 0.7 },
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Film-like movement and pacing',
    params: { motion_strength: 0.6, camera_movement: 'cinematic', speed: 0.5 },
  },
];

/**
 * Unified Video Generator
 * Provides a single interface for multiple free AI video generation models
 */
export class VideoGenerator {
  private apiKey?: string;
  private timeout: number;

  constructor(options: VideoGenerationOptions = {}) {
    this.apiKey = options.apiKey;
    this.timeout = options.timeout || 300000; // 5 minutes default (video takes longer)
  }

  /**
   * Generate video using the specified model
   */
  async generate(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    const jobId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      const config = VIDEO_MODEL_CONFIGS[request.model];
      if (!config) {
        throw new Error(`Unsupported video model: ${request.model}`);
      }

      let result: Partial<VideoGenerationResult>;

      switch (config.provider) {
        case 'huggingface':
          result = await this.generateWithHuggingFace(request, config);
          break;
        default:
          throw new Error(`Unsupported provider: ${config.provider}`);
      }

      return {
        id: jobId,
        status: 'completed',
        videoUrl: result.videoUrl,
        thumbnailUrl: result.thumbnailUrl,
        duration: request.duration || config.defaultDuration,
        fps: request.fps || config.fps,
        width: request.width || 576,
        height: request.height || 320,
        prompt: request.prompt,
        model: request.model,
        createdAt: startTime,
        completedAt: Date.now(),
      };
    } catch (error) {
      return {
        id: jobId,
        status: 'failed',
        duration: 0,
        fps: 0,
        width: 0,
        height: 0,
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
    request: VideoGenerationRequest,
    config: VideoModelConfig
  ): Promise<Partial<VideoGenerationResult>> {
    const url = `${HUGGINGFACE_INFERENCE_API}/${config.modelId}`;
    
    // Apply motion preset parameters
    const motionParams = request.motionPreset?.params || {};
    
    const payload = {
      inputs: request.prompt,
      parameters: {
        negative_prompt: request.negativePrompt || '',
        num_frames: Math.round((request.duration || config.defaultDuration) * config.fps),
        width: request.width || 576,
        height: request.height || 320,
        ...motionParams,
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

    // Response could be video blob or JSON with URL
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('video')) {
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      return { videoUrl };
    }

    const data = await response.json();
    return { videoUrl: data.url || data.video_url };
  }

  /**
   * Get available video models
   */
  getAvailableModels(): VideoModelInfo[] {
    return Object.entries(VIDEO_MODEL_CONFIGS).map(([id, config]) => ({
      id: id as VideoModel,
      name: this.getModelDisplayName(id),
      provider: config.provider,
      maxDuration: config.maxDuration,
      defaultDuration: config.defaultDuration,
      fps: config.fps,
      description: this.getModelDescription(id),
    }));
  }

  /**
   * Get available motion presets
   */
  getMotionPresets(): MotionPreset[] {
    return MOTION_PRESETS;
  }

  /**
   * Get camera control options
   */
  getCameraControls(): CameraControlOption[] {
    return [
      { type: 'static', name: 'Static', directions: [] },
      { type: 'pan', name: 'Pan', directions: ['left', 'right'] },
      { type: 'zoom', name: 'Zoom', directions: ['in', 'out'] },
      { type: 'rotate', name: 'Rotate', directions: ['cw', 'ccw'] },
      { type: 'dolly', name: 'Dolly', directions: ['in', 'out'] },
      { type: 'orbit', name: 'Orbit', directions: ['cw', 'ccw'] },
    ];
  }

  private getModelDisplayName(modelId: string): string {
    const names: Record<string, string> = {
      'animatediff': 'AnimateDiff',
      'stable-video-diffusion': 'Stable Video Diffusion',
      'modelscope': 'ModelScope Text2Video',
      'zeroscope': 'Zeroscope v2',
      'text2video-zero': 'Text2Video-Zero',
    };
    return names[modelId] || modelId;
  }

  private getModelDescription(modelId: string): string {
    const descriptions: Record<string, string> = {
      'animatediff': 'Animate any image or generate motion from text',
      'stable-video-diffusion': 'High-quality image-to-video generation',
      'modelscope': 'Text-to-video with natural motion',
      'zeroscope': 'Fast text-to-video with decent quality',
      'text2video-zero': 'Zero-shot text-to-video generation',
    };
    return descriptions[modelId] || '';
  }
}

interface VideoModelInfo {
  id: VideoModel;
  name: string;
  provider: string;
  maxDuration: number;
  defaultDuration: number;
  fps: number;
  description: string;
}

interface CameraControlOption {
  type: CameraControl['type'];
  name: string;
  directions: string[];
}

/**
 * Create video generator instance
 */
export function createVideoGenerator(options?: VideoGenerationOptions): VideoGenerator {
  return new VideoGenerator(options);
}
