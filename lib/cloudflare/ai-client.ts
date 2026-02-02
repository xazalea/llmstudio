/**
 * Cloudflare Workers AI Client
 * For use when deployed to Cloudflare Pages/Workers
 * 
 * Free tier includes:
 * - 10,000 neurons/day for text generation
 * - 5,000 images/month for image generation
 * 
 * Available models:
 * - @cf/stabilityai/stable-diffusion-xl-base-1.0 (image)
 * - @cf/meta/llama-3.1-8b-instruct (text)
 * - @cf/microsoft/resnet-50 (classification)
 */

// Type definitions for Cloudflare AI binding
export interface CloudflareAI {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

export interface CloudflareEnv {
  AI?: CloudflareAI;
}

// Available Cloudflare AI models
export const CF_MODELS = {
  imageGen: {
    sdxl: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    dreamshaper: "@cf/lykon/dreamshaper-8-lcm",
  },
  textGen: {
    llama31: "@cf/meta/llama-3.1-8b-instruct",
    llama32: "@cf/meta/llama-3.2-3b-instruct",
    mistral: "@cf/mistral/mistral-7b-instruct-v0.1",
    qwen: "@cf/qwen/qwen1.5-14b-chat-awq",
  },
  imageClassification: {
    resnet: "@cf/microsoft/resnet-50",
  },
  textEmbeddings: {
    bge: "@cf/baai/bge-base-en-v1.5",
  },
  speechToText: {
    whisper: "@cf/openai/whisper",
  },
  translation: {
    m2m100: "@cf/meta/m2m100-1.2b",
  },
} as const;

/**
 * Generate an image using Cloudflare AI
 */
export async function generateImageWithCF(
  ai: CloudflareAI,
  prompt: string,
  options: {
    model?: keyof typeof CF_MODELS.imageGen;
    steps?: number;
    guidance?: number;
  } = {}
): Promise<{ image: ArrayBuffer }> {
  const model = CF_MODELS.imageGen[options.model ?? "sdxl"];
  
  const result = await ai.run(model, {
    prompt,
    num_steps: options.steps ?? 20,
    guidance: options.guidance ?? 7.5,
  });
  
  return result as { image: ArrayBuffer };
}

/**
 * Generate text using Cloudflare AI
 */
export async function generateTextWithCF(
  ai: CloudflareAI,
  prompt: string,
  options: {
    model?: keyof typeof CF_MODELS.textGen;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  } = {}
): Promise<{ response: string }> {
  const model = CF_MODELS.textGen[options.model ?? "llama31"];
  
  const messages = [];
  if (options.systemPrompt) {
    messages.push({ role: "system", content: options.systemPrompt });
  }
  messages.push({ role: "user", content: prompt });
  
  const result = await ai.run(model, {
    messages,
    max_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7,
  });
  
  return result as { response: string };
}

/**
 * Stream text generation using Cloudflare AI
 */
export async function* streamTextWithCF(
  ai: CloudflareAI,
  prompt: string,
  options: {
    model?: keyof typeof CF_MODELS.textGen;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  } = {}
): AsyncGenerator<string, void, unknown> {
  const model = CF_MODELS.textGen[options.model ?? "llama31"];
  
  const messages = [];
  if (options.systemPrompt) {
    messages.push({ role: "system", content: options.systemPrompt });
  }
  messages.push({ role: "user", content: prompt });
  
  const result = await ai.run(model, {
    messages,
    max_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7,
    stream: true,
  });
  
  // Handle streaming response
  if (result && typeof result === "object" && Symbol.asyncIterator in result) {
    for await (const chunk of result as AsyncIterable<{ response: string }>) {
      if (chunk.response) {
        yield chunk.response;
      }
    }
  } else if (typeof result === "object" && "response" in (result as Record<string, unknown>)) {
    yield (result as { response: string }).response;
  }
}

/**
 * Classify an image using Cloudflare AI
 */
export async function classifyImageWithCF(
  ai: CloudflareAI,
  image: ArrayBuffer | Uint8Array
): Promise<Array<{ label: string; score: number }>> {
  const result = await ai.run(CF_MODELS.imageClassification.resnet, {
    image: Array.from(image instanceof ArrayBuffer ? new Uint8Array(image) : image),
  });
  
  return result as Array<{ label: string; score: number }>;
}

/**
 * Generate text embeddings using Cloudflare AI
 */
export async function generateEmbeddingsWithCF(
  ai: CloudflareAI,
  text: string | string[]
): Promise<{ data: number[][] }> {
  const result = await ai.run(CF_MODELS.textEmbeddings.bge, {
    text: Array.isArray(text) ? text : [text],
  });
  
  return result as { data: number[][] };
}

/**
 * Transcribe audio using Cloudflare AI (Whisper)
 */
export async function transcribeAudioWithCF(
  ai: CloudflareAI,
  audio: ArrayBuffer | Uint8Array
): Promise<{ text: string }> {
  const result = await ai.run(CF_MODELS.speechToText.whisper, {
    audio: Array.from(audio instanceof ArrayBuffer ? new Uint8Array(audio) : audio),
  });
  
  return result as { text: string };
}

/**
 * Translate text using Cloudflare AI
 */
export async function translateWithCF(
  ai: CloudflareAI,
  text: string,
  options: {
    sourceLanguage?: string;
    targetLanguage: string;
  }
): Promise<{ translated_text: string }> {
  const result = await ai.run(CF_MODELS.translation.m2m100, {
    text,
    source_lang: options.sourceLanguage ?? "en",
    target_lang: options.targetLanguage,
  });
  
  return result as { translated_text: string };
}

/**
 * Check if Cloudflare AI is available in the current environment
 */
export function isCloudflareAIAvailable(env: CloudflareEnv): boolean {
  return !!env.AI;
}

/**
 * Get available Cloudflare AI models
 */
export function getAvailableCFModels() {
  return {
    imageGeneration: Object.entries(CF_MODELS.imageGen).map(([key, model]) => ({
      id: key,
      model,
      name: key.charAt(0).toUpperCase() + key.slice(1),
    })),
    textGeneration: Object.entries(CF_MODELS.textGen).map(([key, model]) => ({
      id: key,
      model,
      name: key.charAt(0).toUpperCase() + key.slice(1),
    })),
    other: [
      { id: "imageClassification", model: CF_MODELS.imageClassification.resnet, name: "Image Classification" },
      { id: "embeddings", model: CF_MODELS.textEmbeddings.bge, name: "Text Embeddings" },
      { id: "speechToText", model: CF_MODELS.speechToText.whisper, name: "Speech to Text" },
      { id: "translation", model: CF_MODELS.translation.m2m100, name: "Translation" },
    ],
  };
}
