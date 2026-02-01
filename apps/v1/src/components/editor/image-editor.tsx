"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { 
  UploadIcon, 
  WandIcon, 
  ArrowUpIcon, 
  EraserIcon,
  PaletteIcon,
  SparklesIcon,
  Loader2Icon,
  DownloadIcon,
  UndoIcon,
  RedoIcon,
  ZoomInIcon,
  ZoomOutIcon,
  MoveIcon,
  PencilIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type EditTool = "inpaint" | "upscale" | "background-remove" | "enhance" | "colorize" | "style-transfer";

const EDIT_TOOLS: { id: EditTool; name: string; icon: React.ElementType; description: string }[] = [
  { id: "inpaint", name: "Inpaint", icon: PencilIcon, description: "Remove or replace objects" },
  { id: "upscale", name: "Upscale", icon: ArrowUpIcon, description: "Enhance resolution up to 4x" },
  { id: "background-remove", name: "Remove BG", icon: EraserIcon, description: "Remove background" },
  { id: "enhance", name: "Enhance", icon: SparklesIcon, description: "Improve quality" },
  { id: "colorize", name: "Colorize", icon: PaletteIcon, description: "Add color to B&W" },
  { id: "style-transfer", name: "Style", icon: WandIcon, description: "Apply artistic styles" },
];

const STYLE_OPTIONS = [
  "Photorealistic", "Oil Painting", "Watercolor", "Anime", "Comic Book",
  "Cyberpunk", "Fantasy", "Minimalist", "Vintage", "Neon",
];

export function ImageEditor() {
  const [selectedTool, setSelectedTool] = useState<EditTool>("inpaint");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [upscaleFactor, setUpscaleFactor] = useState(2);
  const [selectedStyle, setSelectedStyle] = useState("Photorealistic");
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maskData, setMaskData] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setEditedImage(null);
      setMaskData(null);
    }
  };

  const handleProcess = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // For demo, just show the original image
    // In production, this would call the actual AI editing APIs
    setEditedImage(uploadedImage);
    setIsProcessing(false);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== "inpaint") return;
    setIsDrawing(true);
    draw(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== "inpaint") return;
    draw(e);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setMaskData(canvasRef.current.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setMaskData(null);
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel - Tools */}
      <div className="w-80 flex-shrink-0 space-y-6 overflow-y-auto pb-6">
        {/* Tool Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Edit Tool</label>
          <div className="grid grid-cols-2 gap-2">
            {EDIT_TOOLS.map((tool) => (
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
        {selectedTool === "inpaint" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                placeholder="Describe what to fill in the masked area..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[80px] bg-white/5"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Brush Size</label>
                <span className="text-sm text-muted-foreground">{brushSize}px</span>
              </div>
              <Slider
                value={[brushSize]}
                onValueChange={([v]) => setBrushSize(v)}
                min={5}
                max={100}
              />
            </div>
            <Button variant="outline" size="sm" onClick={clearMask} className="w-full">
              Clear Mask
            </Button>
          </div>
        )}

        {selectedTool === "upscale" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Upscale Factor</label>
                <span className="text-sm text-muted-foreground">{upscaleFactor}x</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map((factor) => (
                  <button
                    key={factor}
                    onClick={() => setUpscaleFactor(factor)}
                    className={cn(
                      "rounded-lg border py-2 text-sm font-medium transition-colors",
                      upscaleFactor === factor
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 hover:bg-white/5"
                    )}
                  >
                    {factor}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTool === "style-transfer" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Style</label>
              <div className="grid grid-cols-2 gap-2">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs transition-colors",
                      selectedStyle === style
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 hover:bg-white/5"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Process Button */}
        <Button
          onClick={handleProcess}
          disabled={!uploadedImage || isProcessing}
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
              Apply {EDIT_TOOLS.find(t => t.id === selectedTool)?.name}
            </>
          )}
        </Button>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon">
            <UndoIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RedoIcon className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="icon">
            <ZoomOutIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">100%</span>
          <Button variant="outline" size="icon">
            <ZoomInIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 relative rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          {uploadedImage ? (
            <div className="relative w-full h-full">
              <Image
                src={uploadedImage}
                alt="Uploaded image"
                fill
                className="object-contain"
              />
              {selectedTool === "inpaint" && (
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
              )}
            </div>
          ) : (
            <label className="flex h-full cursor-pointer flex-col items-center justify-center">
              <UploadIcon className="h-16 w-16 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Upload an image to edit</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
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

      {/* Right Panel - Result */}
      <div className="w-80 flex-shrink-0 space-y-4">
        <h3 className="font-medium">Result</h3>
        <div className="relative aspect-square rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          {isProcessing ? (
            <div className="flex h-full items-center justify-center">
              <Loader2Icon className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : editedImage ? (
            <Image
              src={editedImage}
              alt="Edited result"
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <WandIcon className="h-12 w-12 opacity-50" />
              <p className="mt-2 text-sm">Result will appear here</p>
            </div>
          )}
        </div>

        {editedImage && (
          <Button variant="outline" className="w-full">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download Result
          </Button>
        )}
      </div>
    </div>
  );
}
