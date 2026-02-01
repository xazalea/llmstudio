"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  UploadIcon, 
  ScissorsIcon, 
  FastForwardIcon, 
  RewindIcon,
  SparklesIcon,
  Loader2Icon,
  DownloadIcon,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  RepeatIcon,
  SlidersIcon,
  WandIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type VideoTool = "trim" | "speed" | "reverse" | "loop" | "effect" | "stabilize" | "interpolate";

const VIDEO_TOOLS: { id: VideoTool; name: string; icon: React.ElementType; description: string }[] = [
  { id: "trim", name: "Trim", icon: ScissorsIcon, description: "Cut video to length" },
  { id: "speed", name: "Speed", icon: FastForwardIcon, description: "Change playback speed" },
  { id: "reverse", name: "Reverse", icon: RewindIcon, description: "Play backwards" },
  { id: "loop", name: "Loop", icon: RepeatIcon, description: "Create seamless loop" },
  { id: "effect", name: "Effects", icon: WandIcon, description: "Apply visual effects" },
  { id: "stabilize", name: "Stabilize", icon: SlidersIcon, description: "Reduce camera shake" },
  { id: "interpolate", name: "Smooth", icon: SparklesIcon, description: "Frame interpolation" },
];

const EFFECTS = [
  { id: "none", name: "None" },
  { id: "blur", name: "Blur" },
  { id: "sharpen", name: "Sharpen" },
  { id: "grayscale", name: "Grayscale" },
  { id: "sepia", name: "Sepia" },
  { id: "vintage", name: "Vintage" },
  { id: "vignette", name: "Vignette" },
  { id: "mirror", name: "Mirror" },
];

export function VideoEditor() {
  const [selectedTool, setSelectedTool] = useState<VideoTool>("trim");
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Tool parameters
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [loopCount, setLoopCount] = useState(2);
  const [selectedEffect, setSelectedEffect] = useState("none");
  const [targetFps, setTargetFps] = useState(60);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
    }
  };

  const handleProcess = async () => {
    if (!uploadedVideo) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 3000));
    setIsProcessing(false);
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel - Tools */}
      <div className="w-80 flex-shrink-0 space-y-6 overflow-y-auto pb-6">
        {/* Tool Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Edit Tool</label>
          <div className="grid grid-cols-2 gap-2">
            {VIDEO_TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                  selectedTool === tool.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 hover:bg-white/5"
                )}
              >
                <tool.icon className="h-5 w-5" />
                <span className="font-medium">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tool-specific options */}
        {selectedTool === "trim" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Start Time</label>
                <span className="text-sm text-muted-foreground">{trimStart}s</span>
              </div>
              <Slider
                value={[trimStart]}
                onValueChange={([v]) => setTrimStart(v)}
                min={0}
                max={60}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">End Time</label>
                <span className="text-sm text-muted-foreground">{trimEnd}s</span>
              </div>
              <Slider
                value={[trimEnd]}
                onValueChange={([v]) => setTrimEnd(v)}
                min={0}
                max={60}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Duration: {Math.max(0, trimEnd - trimStart)}s
            </p>
          </div>
        )}

        {selectedTool === "speed" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Speed</label>
                <span className="text-sm text-muted-foreground">{speed}x</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([v]) => setSpeed(v)}
                min={0.25}
                max={4}
                step={0.25}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={cn(
                    "rounded-lg border py-1.5 text-xs font-medium transition-colors",
                    speed === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 hover:bg-white/5"
                  )}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTool === "loop" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Loop Count</label>
                <span className="text-sm text-muted-foreground">{loopCount}x</span>
              </div>
              <Slider
                value={[loopCount]}
                onValueChange={([v]) => setLoopCount(v)}
                min={2}
                max={10}
              />
            </div>
          </div>
        )}

        {selectedTool === "effect" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Effect</label>
              <Select value={selectedEffect} onValueChange={setSelectedEffect}>
                <SelectTrigger className="bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EFFECTS.map((effect) => (
                    <SelectItem key={effect.id} value={effect.id}>
                      {effect.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {selectedTool === "interpolate" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Target FPS</label>
                <span className="text-sm text-muted-foreground">{targetFps}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[30, 60, 120].map((fps) => (
                  <button
                    key={fps}
                    onClick={() => setTargetFps(fps)}
                    className={cn(
                      "rounded-lg border py-2 text-sm font-medium transition-colors",
                      targetFps === fps
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 hover:bg-white/5"
                    )}
                  >
                    {fps}fps
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Process Button */}
        <Button
          onClick={handleProcess}
          disabled={!uploadedVideo || isProcessing}
          className="w-full"
          variant="gradient"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2Icon className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5" />
              Apply {VIDEO_TOOLS.find(t => t.id === selectedTool)?.name}
            </>
          )}
        </Button>
      </div>

      {/* Center - Video Preview */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative rounded-xl border border-white/10 bg-black overflow-hidden">
          {uploadedVideo ? (
            <video
              src={uploadedVideo}
              className="w-full h-full object-contain"
              controls={false}
            />
          ) : (
            <label className="flex h-full cursor-pointer flex-col items-center justify-center bg-white/5">
              <UploadIcon className="h-16 w-16 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Upload a video to edit</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Video Controls */}
        {uploadedVideo && (
          <div className="mt-4 space-y-4">
            {/* Timeline */}
            <div className="relative h-12 rounded-lg bg-white/5 border border-white/10">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-purple-500/30 rounded-l-lg" />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon">
                <RotateCcwIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="gradient"
                size="icon"
                className="h-12 w-12"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </Button>
              <Button variant="outline" size="icon">
                <RepeatIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Export */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <h3 className="font-medium">Export</h3>
        
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <Select defaultValue="mp4">
              <SelectTrigger className="bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4</SelectItem>
                <SelectItem value="webm">WebM</SelectItem>
                <SelectItem value="gif">GIF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quality</label>
            <Select defaultValue="high">
              <SelectTrigger className="bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (480p)</SelectItem>
                <SelectItem value="medium">Medium (720p)</SelectItem>
                <SelectItem value="high">High (1080p)</SelectItem>
                <SelectItem value="ultra">Ultra (4K)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button variant="outline" className="w-full" disabled={!uploadedVideo}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export Video
        </Button>
      </div>
    </div>
  );
}
