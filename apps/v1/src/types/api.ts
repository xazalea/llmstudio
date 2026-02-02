/**
 * API Types for AI Creative Suite
 */

// Image Generation Types
export type ImageModel = 
  | "flux-schnell"
  | "flux-dev"
  | "stable-diffusion-xl"
  | "stable-diffusion-3"
  | "sdxl-turbo"
  | "sdxl-lightning"
  | "playground-v2"
  | "kandinsky-3"
  | "kolors";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "21:9" | "3:2" | "2:3";

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
  batchSize?: number;
  stylePreset?: string;
}

export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  seed?: number;
}

export interface ImageGenerationResult {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  images: GeneratedImage[];
  prompt: string;
  model: string;
  createdAt?: number;
  completedAt?: number;
  error?: string;
}

// Video Generation Types
export type VideoModel = string;

export interface MotionPreset {
  id: string;
  name: string;
  description: string;
  cameraMotion?: {
    type: string;
    intensity: number;
  };
  params?: Record<string, unknown>;
}

export interface VideoGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  model: VideoModel;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  motionPreset?: MotionPreset;
  motionStrength?: number;
  startFrame?: string;
  seed?: number;
}

export interface VideoGenerationResult {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  prompt: string;
  model: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  createdAt?: number;
  completedAt?: number;
  error?: string;
}

// Chat Types
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  stream?: boolean;
}

export interface ChatResponse {
  response: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}
