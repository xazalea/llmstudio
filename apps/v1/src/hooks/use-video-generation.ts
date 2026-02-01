"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import type { VideoGenerationRequest, VideoGenerationResult, VideoModel, MotionPreset } from "@lib/api/types";

// Simulated generation for demo
async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 5000));
  
  // Demo video URL (in production would call actual API)
  const seed = Math.floor(Math.random() * 1000000);
  
  return {
    id: crypto.randomUUID(),
    status: "completed",
    videoUrl: `https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4`,
    thumbnailUrl: `https://picsum.photos/seed/${seed}/1024/576`,
    duration: request.duration || 4,
    fps: request.fps || 24,
    width: request.width || 1024,
    height: request.height || 576,
    prompt: request.prompt,
    model: request.model,
    createdAt: Date.now(),
    completedAt: Date.now(),
  };
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

export const VIDEO_MODELS: { id: VideoModel; name: string; description: string; maxDuration: number }[] = [
  {
    id: "animatediff",
    name: "AnimateDiff",
    description: "Animate images or generate motion from text",
    maxDuration: 4,
  },
  {
    id: "stable-video-diffusion",
    name: "Stable Video Diffusion",
    description: "High-quality image-to-video generation",
    maxDuration: 4,
  },
  {
    id: "modelscope",
    name: "ModelScope Text2Video",
    description: "Text-to-video with natural motion",
    maxDuration: 2,
  },
  {
    id: "zeroscope",
    name: "Zeroscope v2",
    description: "Fast text-to-video generation",
    maxDuration: 3,
  },
];

export const MOTION_PRESETS: MotionPreset[] = [
  {
    id: "static",
    name: "Static",
    description: "Subtle animation, no camera movement",
    params: { motion_strength: 0.3 },
  },
  {
    id: "slow-zoom-in",
    name: "Slow Zoom In",
    description: "Gradual zoom towards subject",
    params: { motion_strength: 0.5, camera: "zoom_in" },
  },
  {
    id: "slow-zoom-out",
    name: "Slow Zoom Out",
    description: "Gradual zoom away from subject",
    params: { motion_strength: 0.5, camera: "zoom_out" },
  },
  {
    id: "pan-left",
    name: "Pan Left",
    description: "Smooth horizontal pan left",
    params: { motion_strength: 0.6, camera: "pan_left" },
  },
  {
    id: "pan-right",
    name: "Pan Right",
    description: "Smooth horizontal pan right",
    params: { motion_strength: 0.6, camera: "pan_right" },
  },
  {
    id: "orbit",
    name: "Orbit",
    description: "Camera orbits around subject",
    params: { motion_strength: 0.7, camera: "orbit" },
  },
  {
    id: "dynamic",
    name: "Dynamic",
    description: "High motion with dramatic movement",
    params: { motion_strength: 0.9, camera: "dynamic" },
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Film-like movement and pacing",
    params: { motion_strength: 0.6, camera: "cinematic" },
  },
];

export const VIDEO_ASPECT_RATIOS = [
  { id: "16:9", name: "Landscape (16:9)", width: 1024, height: 576 },
  { id: "9:16", name: "Portrait (9:16)", width: 576, height: 1024 },
  { id: "1:1", name: "Square (1:1)", width: 576, height: 576 },
  { id: "4:3", name: "Standard (4:3)", width: 768, height: 576 },
  { id: "21:9", name: "Cinematic (21:9)", width: 1024, height: 440 },
];
