/**
 * Hugging Face Spaces Configuration
 * All public Gradio spaces that can be accessed without authentication
 */

export interface SpaceConfig {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  category: 'image-gen' | 'video-gen' | 'chat' | 'audio' | 'image-edit' | 'upscale';
  defaultParams?: Record<string, unknown>;
  apiPath?: string;
  isAvailable?: boolean;
}

// Image Generation Spaces
export const IMAGE_GEN_SPACES: SpaceConfig[] = [
  {
    id: 'flux-schnell',
    name: 'FLUX.1 Schnell',
    description: 'Ultra-fast 4-step image generation with excellent quality',
    endpoint: 'black-forest-labs/FLUX.1-schnell',
    category: 'image-gen',
    apiPath: '/infer',
    defaultParams: {
      seed: 0,
      randomize_seed: true,
      width: 1024,
      height: 1024,
      num_inference_steps: 4,
    },
  },
  {
    id: 'flux-dev',
    name: 'FLUX.1 Dev',
    description: 'High-quality FLUX model for detailed image generation',
    endpoint: 'black-forest-labs/FLUX.1-dev',
    category: 'image-gen',
    apiPath: '/infer',
    defaultParams: {
      seed: 0,
      randomize_seed: true,
      width: 1024,
      height: 1024,
      guidance_scale: 3.5,
      num_inference_steps: 28,
    },
  },
  {
    id: 'sdxl-lightning',
    name: 'SDXL Lightning',
    description: 'ByteDance ultra-fast SDXL in 4 steps',
    endpoint: 'ByteDance/SDXL-Lightning',
    category: 'image-gen',
    apiPath: '/generate',
    defaultParams: {
      ckpt: '4-Step',
    },
  },
  {
    id: 'stable-diffusion-3',
    name: 'Stable Diffusion 3.5 Large',
    description: 'Latest SD model with improved text rendering',
    endpoint: 'stabilityai/stable-diffusion-3.5-large',
    category: 'image-gen',
    apiPath: '/infer',
    defaultParams: {
      seed: 0,
      randomize_seed: true,
      width: 1024,
      height: 1024,
      guidance_scale: 4.5,
      num_inference_steps: 40,
    },
  },
  {
    id: 'playground-v2',
    name: 'Playground v2.5',
    description: 'Aesthetic-focused model for artistic images',
    endpoint: 'playgroundai/playground-v2.5-1024px-aesthetic',
    category: 'image-gen',
    apiPath: '/run',
    defaultParams: {
      guidance_scale: 3,
      num_inference_steps: 25,
    },
  },
  {
    id: 'kolors',
    name: 'Kolors',
    description: 'Kwai high-quality diffusion model',
    endpoint: 'Kwai-Kolors/Kolors',
    category: 'image-gen',
    apiPath: '/generate',
  },
];

// Video Generation Spaces
export const VIDEO_GEN_SPACES: SpaceConfig[] = [
  {
    id: 'animatediff-lightning',
    name: 'AnimateDiff Lightning',
    description: 'Fast text-to-video with AnimateDiff',
    endpoint: 'ByteDance/AnimateDiff-Lightning',
    category: 'video-gen',
    apiPath: '/generate',
    defaultParams: {
      base: 'ToonYou',
      step: 4,
    },
  },
  {
    id: 'i2vgen-xl',
    name: 'I2VGen-XL',
    description: 'High-quality image-to-video generation',
    endpoint: 'ali-vilab/i2vgen-xl',
    category: 'video-gen',
    apiPath: '/predict',
  },
  {
    id: 'cogvideox',
    name: 'CogVideoX',
    description: 'Advanced text-to-video model',
    endpoint: 'THUDM/CogVideoX-5B-Space',
    category: 'video-gen',
    apiPath: '/generate',
  },
];

// Chat/LLM Spaces
export const CHAT_SPACES: SpaceConfig[] = [
  {
    id: 'qwen-72b',
    name: 'Qwen 2.5 72B Instruct',
    description: 'Powerful 72B parameter model for complex tasks',
    endpoint: 'Qwen/Qwen2.5-72B-Instruct',
    category: 'chat',
    apiPath: '/model_chat',
    defaultParams: {
      temperature: 0.7,
      max_tokens: 2048,
    },
  },
  {
    id: 'qwen-32b',
    name: 'Qwen 2.5 32B Instruct',
    description: 'Fast and capable 32B model',
    endpoint: 'Qwen/Qwen2.5-32B-Instruct',
    category: 'chat',
    apiPath: '/model_chat',
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3.1 70B',
    description: 'Meta Llama 3.1 for general purpose chat',
    endpoint: 'meta-llama/Llama-3.1-70B-Instruct',
    category: 'chat',
    apiPath: '/chat',
  },
  {
    id: 'mistral-nemo',
    name: 'Mistral Nemo',
    description: 'Efficient Mistral model for fast responses',
    endpoint: 'mistralai/Mistral-Nemo-Instruct-2407',
    category: 'chat',
    apiPath: '/chat',
  },
  {
    id: 'gemma-2-27b',
    name: 'Gemma 2 27B',
    description: 'Google Gemma 2 with 27B parameters',
    endpoint: 'google/gemma-2-27b-it',
    category: 'chat',
    apiPath: '/chat',
  },
];

// Audio Generation Spaces
export const AUDIO_SPACES: SpaceConfig[] = [
  {
    id: 'musicgen',
    name: 'MusicGen',
    description: 'Generate music from text descriptions',
    endpoint: 'facebook/MusicGen',
    category: 'audio',
    apiPath: '/predict',
    defaultParams: {
      duration: 8,
    },
  },
  {
    id: 'bark',
    name: 'Bark',
    description: 'Text-to-speech with emotions and music',
    endpoint: 'suno/bark',
    category: 'audio',
    apiPath: '/predict',
  },
];

// Image Editing Spaces
export const IMAGE_EDIT_SPACES: SpaceConfig[] = [
  {
    id: 'ic-light',
    name: 'IC-Light',
    description: 'Relight images with AI',
    endpoint: 'lllyasviel/IC-Light',
    category: 'image-edit',
    apiPath: '/process',
  },
  {
    id: 'instruct-pix2pix',
    name: 'InstructPix2Pix',
    description: 'Edit images with text instructions',
    endpoint: 'timbrooks/instruct-pix2pix',
    category: 'image-edit',
    apiPath: '/predict',
  },
  {
    id: 'remove-bg',
    name: 'Remove Background',
    description: 'Remove image backgrounds instantly',
    endpoint: 'ECCV2022/dis-background-removal',
    category: 'image-edit',
    apiPath: '/predict',
  },
];

// Upscaling Spaces
export const UPSCALE_SPACES: SpaceConfig[] = [
  {
    id: 'finegrain-enhancer',
    name: 'Finegrain Image Enhancer',
    description: '4x image upscaling with detail enhancement',
    endpoint: 'finegrain/finegrain-image-enhancer',
    category: 'upscale',
    apiPath: '/predict',
  },
  {
    id: 'real-esrgan',
    name: 'Real-ESRGAN',
    description: 'General-purpose image upscaling',
    endpoint: 'ai-forever/Real-ESRGAN',
    category: 'upscale',
    apiPath: '/predict',
  },
];

// All spaces combined
export const ALL_SPACES: SpaceConfig[] = [
  ...IMAGE_GEN_SPACES,
  ...VIDEO_GEN_SPACES,
  ...CHAT_SPACES,
  ...AUDIO_SPACES,
  ...IMAGE_EDIT_SPACES,
  ...UPSCALE_SPACES,
];

// Get space by ID
export function getSpaceById(id: string): SpaceConfig | undefined {
  return ALL_SPACES.find(space => space.id === id);
}

// Get spaces by category
export function getSpacesByCategory(category: SpaceConfig['category']): SpaceConfig[] {
  return ALL_SPACES.filter(space => space.category === category);
}
