"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  SearchIcon, 
  DownloadIcon, 
  HeartIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  TypeIcon,
  MusicIcon,
  BoxIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type AssetType = "all" | "image" | "video" | "vector" | "font" | "audio" | "3d";

const ASSET_TYPES: { id: AssetType; name: string; icon: React.ElementType }[] = [
  { id: "all", name: "All", icon: GridIcon },
  { id: "image", name: "Photos", icon: ImageIcon },
  { id: "video", name: "Videos", icon: VideoIcon },
  { id: "vector", name: "Vectors", icon: FileIcon },
  { id: "font", name: "Fonts", icon: TypeIcon },
  { id: "audio", name: "Audio", icon: MusicIcon },
  { id: "3d", name: "3D", icon: BoxIcon },
];

const ORIENTATIONS = [
  { id: "all", name: "All Orientations" },
  { id: "landscape", name: "Landscape" },
  { id: "portrait", name: "Portrait" },
  { id: "square", name: "Square" },
];

const COLORS = [
  { id: "all", name: "All Colors", color: "transparent" },
  { id: "red", name: "Red", color: "#ef4444" },
  { id: "orange", name: "Orange", color: "#f97316" },
  { id: "yellow", name: "Yellow", color: "#eab308" },
  { id: "green", name: "Green", color: "#22c55e" },
  { id: "blue", name: "Blue", color: "#3b82f6" },
  { id: "purple", name: "Purple", color: "#a855f7" },
  { id: "pink", name: "Pink", color: "#ec4899" },
  { id: "black", name: "Black", color: "#000000" },
  { id: "white", name: "White", color: "#ffffff" },
];

// Demo assets data
const DEMO_ASSETS = Array.from({ length: 24 }, (_, i) => ({
  id: `asset-${i}`,
  type: ["image", "video", "vector"][i % 3] as AssetType,
  title: `Asset ${i + 1}`,
  url: `https://picsum.photos/seed/${i + 100}/800/600`,
  thumbnailUrl: `https://picsum.photos/seed/${i + 100}/400/300`,
  width: 800,
  height: 600,
  downloads: Math.floor(Math.random() * 10000),
  likes: Math.floor(Math.random() * 1000),
  isPremium: i % 5 === 0,
}));

export function AssetLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<AssetType>("all");
  const [orientation, setOrientation] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAssets = DEMO_ASSETS.filter((asset) => {
    if (selectedType !== "all" && asset.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Search and Filters Bar */}
      <div className="flex items-center gap-4 pb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search free assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(showFilters && "bg-white/10")}
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          Filters
          <ChevronDownIcon className={cn(
            "h-4 w-4 ml-2 transition-transform",
            showFilters && "rotate-180"
          )} />
        </Button>

        <div className="flex items-center border border-white/10 rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={cn(viewMode === "grid" && "bg-white/10")}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("list")}
            className={cn(viewMode === "list" && "bg-white/10")}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid grid-cols-4 gap-6">
            {/* Orientation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Orientation</label>
              <Select value={orientation} onValueChange={setOrientation}>
                <SelectTrigger className="bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORIENTATIONS.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={cn(
                      "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                      selectedColor === color.id
                        ? "border-primary scale-110"
                        : "border-transparent",
                      color.id === "all" && "bg-gradient-to-br from-red-500 via-green-500 to-blue-500"
                    )}
                    style={{ backgroundColor: color.id !== "all" ? color.color : undefined }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* License */}
            <div className="space-y-2">
              <label className="text-sm font-medium">License</label>
              <Select defaultValue="free">
                <SelectTrigger className="bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select defaultValue="popular">
                <SelectTrigger className="bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Asset Type Tabs */}
      <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as AssetType)} className="flex-1 flex flex-col">
        <TabsList className="mb-6 w-fit">
          {ASSET_TYPES.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="gap-2">
              <type.icon className="h-4 w-4" />
              {type.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedType} className="flex-1 overflow-y-auto">
          {/* Asset Grid */}
          <div className={cn(
            "grid gap-4",
            viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
          )}>
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-white/20",
                  viewMode === "list" && "flex items-center gap-4 p-4"
                )}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={asset.thumbnailUrl}
                        alt={asset.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {asset.isPremium && (
                        <span className="absolute top-2 left-2 rounded bg-yellow-500 px-2 py-0.5 text-xs font-medium text-black">
                          Premium
                        </span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{asset.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DownloadIcon className="h-3 w-3" />
                          {asset.downloads.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <HeartIcon className="h-3 w-3" />
                          {asset.likes.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={asset.thumbnailUrl}
                        alt={asset.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{asset.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{asset.width} x {asset.height}</span>
                        <span>{asset.type}</span>
                        {asset.isPremium && (
                          <span className="text-yellow-500">Premium</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <HeartIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="gradient">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center py-8">
            <Button variant="outline" size="lg">
              Load More Assets
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
