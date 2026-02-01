import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyIcon, PaletteIcon, BellIcon, HardDriveIcon, InfoIcon } from "lucide-react";

export const metadata = {
  title: "Settings | AI Creative Suite",
  description: "Configure your AI Creative Suite preferences",
};

export default function SettingsPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* API Keys */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyIcon className="h-5 w-5" />
                API Keys (Optional)
              </CardTitle>
              <CardDescription>
                Add your own API keys for faster generation. All features work without keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hugging Face API Key</label>
                <Input
                  type="password"
                  placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
                  className="bg-white/5"
                />
                <p className="text-xs text-muted-foreground">
                  Get a free key at huggingface.co
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Replicate API Key</label>
                <Input
                  type="password"
                  placeholder="r8_xxxxxxxxxxxxxxxxxxxx"
                  className="bg-white/5"
                />
                <p className="text-xs text-muted-foreground">
                  Get a free key at replicate.com
                </p>
              </div>
              <Button variant="outline" size="sm">Save Keys</Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PaletteIcon className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <Select defaultValue="dark">
                  <SelectTrigger className="bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Accent Color</label>
                <div className="flex gap-2">
                  {["#8b5cf6", "#3b82f6", "#22c55e", "#ef4444", "#f97316", "#ec4899"].map((color) => (
                    <button
                      key={color}
                      className="h-8 w-8 rounded-full border-2 border-transparent hover:border-white/50 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Defaults */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellIcon className="h-5 w-5" />
                Default Settings
              </CardTitle>
              <CardDescription>
                Set default values for generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Image Model</label>
                <Select defaultValue="flux-schnell">
                  <SelectTrigger className="bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flux-schnell">FLUX.1 Schnell</SelectItem>
                    <SelectItem value="stable-diffusion-xl">Stable Diffusion XL</SelectItem>
                    <SelectItem value="sdxl-turbo">SDXL Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Video Model</label>
                <Select defaultValue="animatediff">
                  <SelectTrigger className="bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="animatediff">AnimateDiff</SelectItem>
                    <SelectItem value="stable-video-diffusion">Stable Video Diffusion</SelectItem>
                    <SelectItem value="zeroscope">Zeroscope v2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Aspect Ratio</label>
                <Select defaultValue="1:1">
                  <SelectTrigger className="bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Storage */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDriveIcon className="h-5 w-5" />
                Storage
              </CardTitle>
              <CardDescription>
                Manage your local storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">History Storage</p>
                  <p className="text-xs text-muted-foreground">Using 24.5 MB of local storage</p>
                </div>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-400">
                  Clear History
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Cache</p>
                  <p className="text-xs text-muted-foreground">Model cache and temporary files</p>
                </div>
                <Button variant="outline" size="sm">
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <InfoIcon className="h-5 w-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>AI Creative Suite</strong> v1.0.0</p>
                <p className="text-muted-foreground">
                  Free, unlimited AI image and video generation, editing tools, 
                  and creative workspace. No authentication required.
                </p>
                <p className="text-muted-foreground">
                  Built with Next.js, TypeScript, and open-source AI models.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
