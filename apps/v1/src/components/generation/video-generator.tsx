"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  SparklesIcon, 
  DownloadIcon, 
  PlayIcon,
  UploadIcon,
  Loader2Icon,
  VideoIcon,
  SettingsIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  useVideoGeneration,
  VIDEO_MODELS,
  MOTION_PRESETS,
  VIDEO_ASPECT_RATIOS,
} from "@/hooks/use-video-generation";
import type { VideoModel } from "@/types/api";

export function VideoGenerator() {
  // Form state
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState<VideoModel>("animatediff");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [motionPreset, setMotionPreset] = useState("static");
  const [duration, setDuration] = useState(4);
  const [motionStrength, setMotionStrength] = useState(0.5);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startFrame, setStartFrame] = useState<string | null>(null);

  // Generation hook
  const { generate, isGenerating, results, latestResult } = useVideoGeneration();

  // Get dimensions
  const selectedAspect = VIDEO_ASPECT_RATIOS.find(ar => ar.id === aspectRatio);
  const selectedModel = VIDEO_MODELS.find(m => m.id === model);
  const selectedMotion = MOTION_PRESETS.find(m => m.id === motionPreset);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    generate({
      prompt,
      negativePrompt: negativePrompt || undefined,
      model,
      duration: Math.min(duration, selectedModel?.maxDuration || 4),
      width: selectedAspect?.width || 1024,
      height: selectedAspect?.height || 576,
      motionPreset: selectedMotion,
      motionStrength,
      startFrame: startFrame || undefined,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setStartFrame(url);
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel - Controls */}
      <div className="w-96 flex-shrink-0 space-y-6 overflow-y-auto pb-6">
        {/* Start Frame Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Start Frame (Optional)</label>
          <div className="relative">
            {startFrame ? (
              <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={startFrame}
                  alt="Start frame"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setStartFrame(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 hover:bg-white/10">
                <UploadIcon className="h-8 w-8 text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">
                  Upload start frame
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Prompt</label>
          <Textarea
            placeholder="Describe the video you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-white/5"
          />
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Model</label>
          <Select value={model} onValueChange={(v) => setModel(v as VideoModel)}>
            <SelectTrigger className="bg-white/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIDEO_MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  <div className="flex items-center gap-2">
                    <span>{m.name}</span>
                    <span className="text-xs text-muted-foreground">
                      max {m.maxDuration}s
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {selectedModel?.description}
          </p>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Aspect Ratio</label>
          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger className="bg-white/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIDEO_ASPECT_RATIOS.map((ar) => (
                <SelectItem key={ar.id} value={ar.id}>
                  {ar.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Motion Preset */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Motion Preset</label>
          <div className="grid grid-cols-2 gap-2">
            {MOTION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setMotionPreset(preset.id)}
                className={cn(
                  "rounded-lg border p-3 text-left text-sm transition-colors",
                  motionPreset === preset.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 hover:bg-white/5"
                )}
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-muted-foreground">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Duration</label>
            <span className="text-sm text-muted-foreground">{duration}s</span>
          </div>
          <Slider
            value={[duration]}
            onValueChange={([v]) => setDuration(v)}
            min={1}
            max={selectedModel?.maxDuration || 4}
            step={1}
          />
        </div>

        {/* Advanced Settings */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
        >
          <span className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Advanced Settings
          </span>
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform",
              showAdvanced && "rotate-180"
            )}
          />
        </button>

        {showAdvanced && (
          <div className="space-y-4 rounded-lg border border-white/10 p-4">
            {/* Negative Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Negative Prompt</label>
              <Textarea
                placeholder="What to avoid..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="min-h-[60px] bg-white/5"
              />
            </div>

            {/* Motion Strength */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Motion Strength</label>
                <span className="text-sm text-muted-foreground">
                  {(motionStrength * 100).toFixed(0)}%
                </span>
              </div>
              <Slider
                value={[motionStrength]}
                onValueChange={([v]) => setMotionStrength(v)}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
          variant="gradient"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2Icon className="h-5 w-5 animate-spin" />
              Generating Video...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5" />
              Generate Video
            </>
          )}
        </Button>
      </div>

      {/* Right Panel - Results */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="results" className="h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="h-full">
            {isGenerating ? (
              <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Loader2Icon className="h-12 w-12 animate-spin text-purple-500" />
                <p className="mt-4 text-muted-foreground">Creating your video...</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This may take 30-60 seconds
                </p>
              </div>
            ) : latestResult?.videoUrl ? (
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <video
                    src={latestResult.videoUrl}
                    poster={latestResult.thumbnailUrl}
                    controls
                    className="h-full w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download MP4
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download GIF
                  </Button>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Prompt:</span>{" "}
                    {latestResult.prompt}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {latestResult.duration}s • {latestResult.fps}fps •{" "}
                    {latestResult.width}x{latestResult.height}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5">
                <VideoIcon className="h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No videos generated yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter a prompt and click Generate to create videos
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="group relative aspect-video overflow-hidden rounded-xl border border-white/10"
                  >
                    <Image
                      src={result.thumbnailUrl || ""}
                      alt={result.prompt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <PlayIcon className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-3">
                      <p className="line-clamp-1 text-xs">{result.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-white/20">
                <VideoIcon className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No video history</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
