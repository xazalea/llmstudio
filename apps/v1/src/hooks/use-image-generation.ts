"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ImageGenerationRequest, ImageGenerationResult, ImageModel } from "@/types/api";

// Call the real API endpoint
async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
  const response = await fetch('/api/generate/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: request.prompt,
      negativePrompt: request.negativePrompt,
      model: request.model,
      width: request.width || 1024,
      height: request.height || 1024,
      steps: request.steps,
      guidanceScale: request.guidanceScale,
      seed: request.seed,
      stylePreset: request.stylePreset,
    }),
  });

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message || 'Generation failed');
  }

  return json.data;
}

export interface GenerationState {
  isGenerating: boolean;
  results: ImageGenerationResult[];
  error: string | null;
}

export function useImageGeneration() {
  const [results, setResults] = useState<ImageGenerationResult[]>([]);

  const mutation = useMutation({
    mutationFn: generateImage,
    onSuccess: (result) => {
      setResults(prev => [result, ...prev]);
    },
  });

  const generate = useCallback((request: ImageGenerationRequest) => {
    mutation.mutate(request);
  }, [mutation]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    generate,
    clearResults,
    isGenerating: mutation.isPending,
    results,
    error: mutation.error?.message || null,
    latestResult: results[0] || null,
  };
}

export const AVAILABLE_MODELS: { id: ImageModel; name: string; description: string; speed: string }[] = [
  {
    id: "flux-schnell",
    name: "FLUX.1 Schnell",
    description: "Ultra-fast generation with great quality (4 steps)",
    speed: "~8s",
  },
  {
    id: "flux-dev",
    name: "FLUX.1 Dev",
    description: "High-quality FLUX for detailed generations",
    speed: "~30s",
  },
  {
    id: "sdxl-lightning",
    name: "SDXL Lightning",
    description: "ByteDance ultra-fast SDXL in 4 steps",
    speed: "~6s",
  },
  {
    id: "stable-diffusion-3",
    name: "Stable Diffusion 3.5",
    description: "Latest SD model with improved text rendering",
    speed: "~25s",
  },
  {
    id: "playground-v2",
    name: "Playground v2.5",
    description: "Aesthetic-focused model for artistic images",
    speed: "~20s",
  },
  {
    id: "kolors",
    name: "Kolors",
    description: "Kwai high-quality diffusion model",
    speed: "~18s",
  },
];

export const ASPECT_RATIOS = [
  { id: "1:1", name: "Square", width: 1024, height: 1024 },
  { id: "16:9", name: "Landscape", width: 1024, height: 576 },
  { id: "9:16", name: "Portrait", width: 576, height: 1024 },
  { id: "4:3", name: "Standard", width: 1024, height: 768 },
  { id: "3:4", name: "Portrait 3:4", width: 768, height: 1024 },
  { id: "21:9", name: "Cinematic", width: 1024, height: 440 },
  { id: "3:2", name: "Photo", width: 1024, height: 683 },
  { id: "2:3", name: "Portrait Photo", width: 683, height: 1024 },
];

export const STYLE_PRESETS = [
  { id: "none", name: "None" },
  { id: "photorealistic", name: "Photorealistic" },
  { id: "cinematic", name: "Cinematic" },
  { id: "anime", name: "Anime" },
  { id: "digital-art", name: "Digital Art" },
  { id: "fantasy", name: "Fantasy" },
  { id: "oil-painting", name: "Oil Painting" },
  { id: "watercolor", name: "Watercolor" },
  { id: "3d-render", name: "3D Render" },
  { id: "pixel-art", name: "Pixel Art" },
  { id: "comic-book", name: "Comic Book" },
  { id: "neon", name: "Neon" },
  { id: "minimalist", name: "Minimalist" },
];
