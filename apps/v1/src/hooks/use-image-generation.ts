"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ImageGenerationRequest, ImageGenerationResult, ImageModel } from "@lib/api/types";

// Simulated generation for demo - in production would call actual APIs
async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // Generate placeholder images (in production, this would call Hugging Face API)
  const seed = request.seed || Math.floor(Math.random() * 1000000);
  const width = request.width || 1024;
  const height = request.height || 1024;
  
  // Use picsum for demo placeholder images
  const images = Array.from({ length: 4 }, (_, i) => ({
    url: `https://picsum.photos/seed/${seed + i}/${width}/${height}`,
    width,
    height,
    seed: seed + i,
  }));

  return {
    id: crypto.randomUUID(),
    status: "completed",
    images,
    prompt: request.prompt,
    model: request.model,
    createdAt: Date.now(),
    completedAt: Date.now(),
  };
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
    description: "Ultra-fast generation with great quality",
    speed: "~4s",
  },
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    description: "High-quality 1024px images with excellent detail",
    speed: "~15s",
  },
  {
    id: "stable-diffusion-3",
    name: "Stable Diffusion 3",
    description: "Latest SD model with improved text rendering",
    speed: "~20s",
  },
  {
    id: "flux-dev",
    name: "FLUX.1 Dev",
    description: "High-quality FLUX for detailed generations",
    speed: "~25s",
  },
  {
    id: "sdxl-turbo",
    name: "SDXL Turbo",
    description: "Lightning-fast single-step generation",
    speed: "~2s",
  },
  {
    id: "playground-v2",
    name: "Playground v2.5",
    description: "Aesthetic-focused model for artistic images",
    speed: "~18s",
  },
  {
    id: "kandinsky-3",
    name: "Kandinsky 3",
    description: "Multilingual model with unique artistic style",
    speed: "~15s",
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
