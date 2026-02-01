import { Header } from "@/components/layout/header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadIcon, TrashIcon, ImageIcon, VideoIcon } from "lucide-react";

// Demo history data
const historyItems = Array.from({ length: 12 }, (_, i) => ({
  id: `history-${i}`,
  type: i % 3 === 0 ? "video" : "image",
  prompt: `A beautiful ${["sunset", "mountain", "ocean", "forest", "city", "abstract"][i % 6]} scene with dramatic lighting`,
  model: ["flux-schnell", "stable-diffusion-xl", "animatediff"][i % 3],
  thumbnailUrl: `https://picsum.photos/seed/${i + 200}/400/300`,
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

export const metadata = {
  title: "History | AI Creative Suite",
  description: "View your generation history",
};

export default function HistoryPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="Generation History" />
      <div className="flex-1 overflow-hidden p-6">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-400">
              <TrashIcon className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>

          <TabsContent value="all" className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.prompt}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-2 left-2">
                      {item.type === "video" ? (
                        <VideoIcon className="h-5 w-5 text-white drop-shadow" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-white drop-shadow" />
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="sm" variant="secondary">
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="text-red-500">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm line-clamp-2">{item.prompt}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{item.model}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images" className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {historyItems.filter(i => i.type === "image").map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.prompt}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm line-clamp-2">{item.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {historyItems.filter(i => i.type === "video").map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.prompt}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <VideoIcon className="absolute top-2 left-2 h-5 w-5 text-white drop-shadow" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm line-clamp-2">{item.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
