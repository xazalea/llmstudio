"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

export interface VideoGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  model?: string;
  steps?: number;
  fps?: number;
  duration?: number;
  imageUrl?: string;
  width?: number;
  height?: number;
  motionPreset?: {
    id: string;
    name: string;
    description: string;
    cameraMotion?: {
      type: string;
      intensity: number;
    };
  };
  motionStrength?: number;
  startFrame?: string;
  seed?: number;
}

export interface VideoGenerationResult {
  id: string;
  status: string;
  videoUrl: string;
  thumbnailUrl?: string;
  prompt: string;
  model: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  parameters: {
    steps?: number;
    fps?: number;
    duration?: number;
  };
  createdAt: number;
  completedAt: number;
}

// Call the real API endpoint
async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
  const response = await fetch('/api/generate/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error?.message || 'Video generation failed');
  }

  return json.data;
}

export function useVideoGeneration() {
  const [results, setResults] = useState<VideoGenerationResult[]>([]);

  const mutation = useMutation({
    mutationFn: generateVideo,
    onSuccess: (result) => {
      setResults(prev => [result, ...prev]);
    },
  });

  const generate = useCallback((request: VideoGenerationRequest) => {
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

export const VIDEO_MODELS = [
  {
    id: "animatediff-lightning",
    name: "AnimateDiff Lightning",
    description: "Fast text-to-video with AnimateDiff (4 steps)",
    speed: "~15s",
    maxDuration: 4,
  },
  {
    id: "i2vgen-xl",
    name: "I2VGen-XL",
    description: "High-quality image-to-video generation",
    speed: "~30s",
    requiresImage: true,
    maxDuration: 6,
  },
  {
    id: "cogvideox",
    name: "CogVideoX",
    description: "Advanced text-to-video model",
    speed: "~60s",
    maxDuration: 10,
  },
];

export const VIDEO_ASPECT_RATIOS = [
  { id: "16:9", name: "Landscape (16:9)", width: 1024, height: 576 },
  { id: "9:16", name: "Portrait (9:16)", width: 576, height: 1024 },
  { id: "1:1", name: "Square (1:1)", width: 768, height: 768 },
  { id: "4:3", name: "Standard (4:3)", width: 1024, height: 768 },
];

export const MOTION_PRESETS = [
  {
    id: "none",
    name: "None",
    description: "No camera motion",
  },
  {
    id: "zoom-in",
    name: "Zoom In",
    description: "Slowly zoom into the scene",
    cameraMotion: { type: "zoom", intensity: 0.5 },
  },
  {
    id: "zoom-out",
    name: "Zoom Out",
    description: "Slowly zoom out from the scene",
    cameraMotion: { type: "zoom", intensity: -0.5 },
  },
  {
    id: "pan-left",
    name: "Pan Left",
    description: "Camera pans from right to left",
    cameraMotion: { type: "pan", intensity: 0.5 },
  },
  {
    id: "pan-right",
    name: "Pan Right",
    description: "Camera pans from left to right",
    cameraMotion: { type: "pan", intensity: -0.5 },
  },
  {
    id: "tilt-up",
    name: "Tilt Up",
    description: "Camera tilts upward",
    cameraMotion: { type: "tilt", intensity: 0.5 },
  },
  {
    id: "tilt-down",
    name: "Tilt Down",
    description: "Camera tilts downward",
    cameraMotion: { type: "tilt", intensity: -0.5 },
  },
  {
    id: "orbit",
    name: "Orbit",
    description: "Camera orbits around subject",
    cameraMotion: { type: "orbit", intensity: 0.5 },
  },
];
