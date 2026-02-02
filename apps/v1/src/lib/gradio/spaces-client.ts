/**
 * Unified Gradio Spaces Client
 * Connects to public Hugging Face Spaces via their Gradio APIs
 */

import { Client } from "@gradio/client";
import { getSpaceById, type SpaceConfig } from "./spaces-config";

export interface GenerationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  space: string;
  duration: number;
}

export interface ImageGenerationInput {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  guidanceScale?: number;
  seed?: number;
}

export interface ImageGenerationOutput {
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  seed?: number;
}

export interface ChatInput {
  message: string;
  history?: Array<[string, string]>;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatOutput {
  response: string;
  history: Array<[string, string]>;
}

export interface VideoGenerationInput {
  prompt: string;
  negativePrompt?: string;
  steps?: number;
  fps?: number;
  duration?: number;
  image?: Blob;
}

export interface VideoGenerationOutput {
  videoUrl: string;
  duration: number;
}

// Connection cache for reusing clients
const clientCache = new Map<string, Client>();

/**
 * Get or create a Gradio client for a space
 */
async function getClient(spaceEndpoint: string): Promise<Client> {
  if (clientCache.has(spaceEndpoint)) {
    return clientCache.get(spaceEndpoint)!;
  }

  // Connect to the space (HF_TOKEN can be set via environment variable for higher rate limits)
  const client = await Client.connect(spaceEndpoint);

  clientCache.set(spaceEndpoint, client);
  return client;
}

/**
 * Clear a specific client from cache
 */
export function clearClientCache(spaceEndpoint?: string): void {
  if (spaceEndpoint) {
    clientCache.delete(spaceEndpoint);
  } else {
    clientCache.clear();
  }
}

/**
 * Generate images using a Hugging Face Space
 */
export async function generateImage(
  spaceId: string,
  input: ImageGenerationInput
): Promise<GenerationResult<ImageGenerationOutput>> {
  const startTime = Date.now();
  const space = getSpaceById(spaceId);

  if (!space) {
    return {
      success: false,
      error: `Unknown space: ${spaceId}`,
      space: spaceId,
      duration: Date.now() - startTime,
    };
  }

  try {
    const client = await getClient(space.endpoint);
    const params = buildImageParams(space, input);
    const result = await client.predict(space.apiPath || "/predict", params);
    const images = parseImageResult(result, space);

    return {
      success: true,
      data: {
        images,
        seed: input.seed,
      },
      space: space.endpoint,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    clearClientCache(space.endpoint);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      space: space.endpoint,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Build image generation parameters for a specific space
 */
function buildImageParams(space: SpaceConfig, input: ImageGenerationInput): Record<string, unknown> {
  const defaultParams = space.defaultParams || {};
  
  switch (space.id) {
    case 'flux-schnell':
    case 'flux-dev':
      return {
        prompt: input.prompt,
        seed: input.seed ?? defaultParams.seed ?? 0,
        randomize_seed: input.seed === undefined,
        width: input.width ?? defaultParams.width ?? 1024,
        height: input.height ?? defaultParams.height ?? 1024,
        num_inference_steps: input.steps ?? defaultParams.num_inference_steps ?? 4,
        ...(space.id === 'flux-dev' && {
          guidance_scale: input.guidanceScale ?? defaultParams.guidance_scale ?? 3.5,
        }),
      };
    
    case 'sdxl-lightning':
      return {
        prompt: input.prompt,
        ckpt: defaultParams.ckpt ?? '4-Step',
      };
    
    case 'stable-diffusion-3':
      return {
        prompt: input.prompt,
        negative_prompt: input.negativePrompt ?? '',
        seed: input.seed ?? defaultParams.seed ?? 0,
        randomize_seed: input.seed === undefined,
        width: input.width ?? defaultParams.width ?? 1024,
        height: input.height ?? defaultParams.height ?? 1024,
        guidance_scale: input.guidanceScale ?? defaultParams.guidance_scale ?? 4.5,
        num_inference_steps: input.steps ?? defaultParams.num_inference_steps ?? 40,
      };
    
    case 'playground-v2':
      return {
        prompt: input.prompt,
        negative_prompt: input.negativePrompt ?? '',
        guidance_scale: input.guidanceScale ?? defaultParams.guidance_scale ?? 3,
        num_inference_steps: input.steps ?? defaultParams.num_inference_steps ?? 25,
      };
    
    default:
      return {
        prompt: input.prompt,
        negative_prompt: input.negativePrompt ?? '',
        ...defaultParams,
      };
  }
}

/**
 * Parse image result from Gradio response
 */
function parseImageResult(
  result: { data: unknown },
  space: SpaceConfig
): Array<{ url: string; width: number; height: number }> {
  const data = Array.isArray(result.data) ? result.data : [result.data];
  const imageData = data[0];
  
  if (typeof imageData === 'string') {
    return [{ url: imageData, width: 1024, height: 1024 }];
  }
  
  if (imageData && typeof imageData === 'object') {
    const fileData = imageData as { url?: string; path?: string; data?: string };
    const url = fileData.url || fileData.path || '';
    return [{ url, width: 1024, height: 1024 }];
  }
  
  if (Array.isArray(imageData)) {
    return imageData.map(img => {
      if (typeof img === 'string') {
        return { url: img, width: 1024, height: 1024 };
      }
      const fileData = img as { url?: string; path?: string };
      return { url: fileData.url || fileData.path || '', width: 1024, height: 1024 };
    });
  }
  
  return [];
}

/**
 * Chat with an LLM via Hugging Face Space
 */
export async function chat(
  spaceId: string,
  input: ChatInput
): Promise<GenerationResult<ChatOutput>> {
  const startTime = Date.now();
  const space = getSpaceById(spaceId);

  if (!space) {
    return {
      success: false,
      error: `Unknown space: ${spaceId}`,
      space: spaceId,
      duration: Date.now() - startTime,
    };
  }

  try {
    const client = await getClient(space.endpoint);
    
    const result = await client.predict(space.apiPath || "/chat", {
      message: input.message,
      history: input.history ?? [],
      system_prompt: input.systemPrompt ?? "You are a helpful AI assistant.",
      temperature: input.temperature ?? 0.7,
      max_new_tokens: input.maxTokens ?? 2048,
    });

    const data = Array.isArray(result.data) ? result.data : [result.data];
    const response = typeof data[0] === 'string' ? data[0] : String(data[0] ?? '');
    const history = Array.isArray(data[1]) ? data[1] as Array<[string, string]> : [];

    return {
      success: true,
      data: {
        response,
        history,
      },
      space: space.endpoint,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    clearClientCache(space.endpoint);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      space: space.endpoint,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Stream chat responses
 */
export async function* streamChat(
  spaceId: string,
  input: ChatInput
): AsyncGenerator<{ chunk: string; done: boolean }> {
  const space = getSpaceById(spaceId);

  if (!space) {
    yield { chunk: '', done: true };
    return;
  }

  try {
    const client = await getClient(space.endpoint);
    
    const submission = client.submit(space.apiPath || "/chat", {
      message: input.message,
      history: input.history ?? [],
      system_prompt: input.systemPrompt ?? "You are a helpful AI assistant.",
      temperature: input.temperature ?? 0.7,
      max_new_tokens: input.maxTokens ?? 2048,
    });

    for await (const event of submission) {
      if (event.type === "data") {
        const response = event.data[0];
        yield {
          chunk: typeof response === 'string' ? response : String(response ?? ''),
          done: false,
        };
      }
    }
    
    yield { chunk: '', done: true };
  } catch (error) {
    clearClientCache(space.endpoint);
    yield { chunk: '', done: true };
  }
}

/**
 * Generate video using a Hugging Face Space
 */
export async function generateVideo(
  spaceId: string,
  input: VideoGenerationInput
): Promise<GenerationResult<VideoGenerationOutput>> {
  const startTime = Date.now();
  const space = getSpaceById(spaceId);

  if (!space) {
    return {
      success: false,
      error: `Unknown space: ${spaceId}`,
      space: spaceId,
      duration: Date.now() - startTime,
    };
  }

  try {
    const client = await getClient(space.endpoint);
    const params = buildVideoParams(space, input);
    const result = await client.predict(space.apiPath || "/generate", params);
    
    const data = Array.isArray(result.data) ? result.data : [result.data];
    const videoData = data[0] as { url?: string; path?: string } | string;
    const videoUrl = typeof videoData === 'string' 
      ? videoData 
      : videoData?.url || videoData?.path || '';

    return {
      success: true,
      data: {
        videoUrl,
        duration: input.duration ?? 4,
      },
      space: space.endpoint,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    clearClientCache(space.endpoint);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      space: space.endpoint,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Build video generation parameters
 */
function buildVideoParams(space: SpaceConfig, input: VideoGenerationInput): Record<string, unknown> {
  const defaultParams = space.defaultParams || {};
  
  switch (space.id) {
    case 'animatediff-lightning':
      return {
        prompt: input.prompt,
        base: defaultParams.base ?? 'ToonYou',
        step: input.steps ?? defaultParams.step ?? 4,
      };
    
    case 'i2vgen-xl':
      return {
        image: input.image,
        prompt: input.prompt,
        negative_prompt: input.negativePrompt ?? '',
      };
    
    case 'cogvideox':
      return {
        prompt: input.prompt,
        num_inference_steps: input.steps ?? 50,
      };
    
    default:
      return {
        prompt: input.prompt,
        ...defaultParams,
      };
  }
}

/**
 * Check if a space is available
 */
export async function checkSpaceStatus(spaceId: string): Promise<{
  available: boolean;
  latency?: number;
  error?: string;
}> {
  const startTime = Date.now();
  const space = getSpaceById(spaceId);

  if (!space) {
    return { available: false, error: 'Unknown space' };
  }

  try {
    const client = await Client.connect(space.endpoint);
    const latency = Date.now() - startTime;
    clientCache.set(space.endpoint, client);
    return { available: true, latency };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}
