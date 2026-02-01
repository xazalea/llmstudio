/**
 * API Types - Reverse engineered from Higgsfield.ai and Freepik.com
 */

// Common types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Image Generation Types
export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  model: ImageModel;
  width?: number;
  height?: number;
  aspectRatio?: AspectRatio;
  steps?: number;
  guidanceScale?: number;
  seed?: number;
  stylePreset?: string;
  referenceImage?: string;
  controlImage?: string;
  controlType?: ControlType;
}

export type ImageModel = 
  | 'stable-diffusion-xl'
  | 'stable-diffusion-3'
  | 'flux-schnell'
  | 'flux-dev'
  | 'flux-pro'
  | 'sdxl-turbo'
  | 'playground-v2'
  | 'kandinsky-3'
  | 'dalle-3'
  | 'midjourney'
  | 'ideogram';

export type AspectRatio = 
  | '1:1' 
  | '4:3' 
  | '3:4' 
  | '16:9' 
  | '9:16' 
  | '21:9' 
  | '9:21'
  | '3:2'
  | '2:3';

export type ControlType = 
  | 'canny'
  | 'depth'
  | 'pose'
  | 'scribble'
  | 'softedge'
  | 'lineart';

export interface ImageGenerationResult {
  id: string;
  status: GenerationStatus;
  images: GeneratedImage[];
  prompt: string;
  model: string;
  createdAt: number;
  completedAt?: number;
}

export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  seed?: number;
}

// Video Generation Types
export interface VideoGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  model: VideoModel;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  aspectRatio?: AspectRatio;
  startFrame?: string;
  endFrame?: string;
  motionPreset?: MotionPreset;
  motionStrength?: number;
  cameraControl?: CameraControl;
}

export type VideoModel = 
  | 'animatediff'
  | 'stable-video-diffusion'
  | 'modelscope'
  | 'zeroscope'
  | 'text2video-zero'
  | 'kling'
  | 'runway-gen3'
  | 'pika'
  | 'sora';

export interface MotionPreset {
  id: string;
  name: string;
  description?: string;
  params: Record<string, unknown>;
}

export interface CameraControl {
  type: 'pan' | 'zoom' | 'rotate' | 'dolly' | 'orbit' | 'static';
  direction?: 'left' | 'right' | 'up' | 'down' | 'in' | 'out' | 'cw' | 'ccw';
  intensity?: number;
}

export interface VideoGenerationResult {
  id: string;
  status: GenerationStatus;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: number;
  fps: number;
  width: number;
  height: number;
  prompt: string;
  model: string;
  createdAt: number;
  completedAt?: number;
}

// Image Editing Types
export interface ImageEditRequest {
  image: string;
  operation: ImageEditOperation;
  mask?: string;
  prompt?: string;
  strength?: number;
  params?: Record<string, unknown>;
}

export type ImageEditOperation = 
  | 'inpaint'
  | 'outpaint'
  | 'upscale'
  | 'background-remove'
  | 'background-replace'
  | 'style-transfer'
  | 'face-swap'
  | 'colorize'
  | 'denoise'
  | 'enhance';

export interface ImageEditResult {
  id: string;
  status: GenerationStatus;
  outputUrl?: string;
  originalUrl: string;
  operation: ImageEditOperation;
  createdAt: number;
  completedAt?: number;
}

// Video Editing Types
export interface VideoEditRequest {
  video: string;
  operation: VideoEditOperation;
  params?: Record<string, unknown>;
}

export type VideoEditOperation = 
  | 'trim'
  | 'speed'
  | 'reverse'
  | 'loop'
  | 'transition'
  | 'effect'
  | 'stabilize'
  | 'interpolate';

export interface VideoEditResult {
  id: string;
  status: GenerationStatus;
  outputUrl?: string;
  originalUrl: string;
  operation: VideoEditOperation;
  createdAt: number;
  completedAt?: number;
}

// Common types
export type GenerationStatus = 
  | 'pending'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

// Asset Library Types
export interface Asset {
  id: string;
  type: AssetType;
  url: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  tags: string[];
  width?: number;
  height?: number;
  duration?: number;
  format: string;
  size: number;
  license: AssetLicense;
  author?: string;
  createdAt: number;
}

export type AssetType = 
  | 'image'
  | 'video'
  | 'vector'
  | 'psd'
  | 'font'
  | 'icon'
  | 'audio'
  | '3d';

export type AssetLicense = 
  | 'free'
  | 'premium'
  | 'editorial'
  | 'commercial';

export interface AssetSearchParams {
  query?: string;
  type?: AssetType;
  license?: AssetLicense;
  orientation?: 'landscape' | 'portrait' | 'square';
  color?: string;
  minWidth?: number;
  minHeight?: number;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'newest' | 'popular';
}

export interface AssetSearchResult {
  assets: Asset[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  canvas: CanvasState;
  collaborators: string[];
}

export interface CanvasState {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
  viewport: Viewport;
}

export interface CanvasNode {
  id: string;
  type: 'image' | 'video' | 'text' | 'shape' | 'group';
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface CanvasConnection {
  id: string;
  from: string;
  to: string;
  type?: string;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}
