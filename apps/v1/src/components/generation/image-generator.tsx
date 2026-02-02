"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  SparklesIcon, 
  DownloadIcon, 
  CopyIcon, 
  RefreshCwIcon,
  SettingsIcon,
  ImageIcon,
  Loader2Icon,
  ChevronDownIcon,
  Dices,
  ZapIcon,
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
  useImageGeneration,
  AVAILABLE_MODELS,
  ASPECT_RATIOS,
  STYLE_PRESETS,
} from "@/hooks/use-image-generation";
import type { ImageModel, AspectRatio } from "@/types/api";

export function ImageGenerator() {
  // Form state
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState<ImageModel>("flux-schnell");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [stylePreset, setStylePreset] = useState("none");
  const [steps, setSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generation hook
  const { generate, isGenerating, results, latestResult } = useImageGeneration();

  // Get dimensions for selected aspect ratio
  const selectedAspect = ASPECT_RATIOS.find(ar => ar.id === aspectRatio);
  const width = selectedAspect?.width || 1024;
  const height = selectedAspect?.height || 1024;

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    generate({
      prompt: stylePreset !== "none" ? `${prompt}, ${stylePreset} style` : prompt,
      negativePrompt: negativePrompt || undefined,
      model,
      width,
      height,
      aspectRatio,
      steps,
      guidanceScale,
      seed,
      stylePreset: stylePreset !== "none" ? stylePreset : undefined,
    });
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel - Controls */}
      <div className="w-96 flex-shrink-0 space-y-6 overflow-y-auto pb-6">
        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Prompt</label>
          <Textarea
            placeholder="Describe what you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] bg-white/5"
          />
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Model</label>
          <Select value={model} onValueChange={(v) => setModel(v as ImageModel)}>
            <SelectTrigger className="bg-white/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  <div className="flex items-center gap-2">
                    <span>{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.speed}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {AVAILABLE_MODELS.find(m => m.id === model)?.description}
          </p>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Aspect Ratio</label>
          <div className="grid grid-cols-4 gap-2">
            {ASPECT_RATIOS.map((ar) => (
              <button
                key={ar.id}
                onClick={() => setAspectRatio(ar.id as AspectRatio)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-colors",
                  aspectRatio === ar.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 hover:bg-white/5"
                )}
              >
                <div
                  className={cn(
                    "rounded border border-current",
                    ar.id === "1:1" && "h-6 w-6",
                    ar.id === "16:9" && "h-4 w-7",
                    ar.id === "9:16" && "h-7 w-4",
                    ar.id === "4:3" && "h-5 w-6",
                    ar.id === "3:4" && "h-6 w-5",
                    ar.id === "21:9" && "h-3 w-7",
                    ar.id === "3:2" && "h-4 w-6",
                    ar.id === "2:3" && "h-6 w-4"
                  )}
                />
                <span>{ar.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style Preset */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Style</label>
          <Select value={stylePreset} onValueChange={setStylePreset}>
            <SelectTrigger className="bg-white/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STYLE_PRESETS.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Settings Toggle */}
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

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="space-y-4 rounded-lg border border-white/10 p-4">
            {/* Negative Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Negative Prompt</label>
              <Textarea
                placeholder="What to avoid in the image..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="min-h-[80px] bg-white/5"
              />
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Steps</label>
                <span className="text-sm text-muted-foreground">{steps}</span>
              </div>
              <Slider
                value={[steps]}
                onValueChange={([v]) => setSteps(v)}
                min={1}
                max={50}
                step={1}
              />
            </div>

            {/* Guidance Scale */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Guidance Scale</label>
                <span className="text-sm text-muted-foreground">{guidanceScale}</span>
              </div>
              <Slider
                value={[guidanceScale]}
                onValueChange={([v]) => setGuidanceScale(v)}
                min={1}
                max={20}
                step={0.5}
              />
            </div>

            {/* Seed */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Seed</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={seed || ""}
                  onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Random"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                />
                <Button variant="outline" size="icon" onClick={handleRandomSeed}>
                  <Dices className="h-4 w-4" />
                </Button>
              </div>
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
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5" />
              Generate
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
                <p className="mt-4 text-muted-foreground">Creating your images...</p>
                <p className="mt-1 text-sm text-muted-foreground">This may take a few seconds</p>
              </div>
            ) : latestResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {latestResult.images.map((image, i) => (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
                    >
                      <Image
                        src={image.url}
                        alt={`Generated image ${i + 1}`}
                        width={image.width}
                        height={image.height}
                        className="w-full object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <RefreshCwIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Prompt:</span> {latestResult.prompt}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Model: {latestResult.model} • Generated at {new Date(latestResult.completedAt || 0).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5">
                <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No images generated yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter a prompt and click Generate to create images
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result, idx) => (
                  <div key={result.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Generation #{results.length - idx}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.completedAt || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {result.images.map((image, i) => (
                        <Image
                          key={i}
                          src={image.url}
                          alt={`Generated image ${i + 1}`}
                          width={image.width}
                          height={image.height}
                          className="w-full rounded-lg object-cover"
                          unoptimized
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {result.prompt}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-white/20">
                <HistoryIcon className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No generation history</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function HistoryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
