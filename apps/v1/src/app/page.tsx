import Link from "next/link";
import { 
  ImageIcon, 
  VideoIcon, 
  WandIcon, 
  ScissorsIcon, 
  FolderIcon, 
  UsersIcon,
  SparklesIcon,
  ZapIcon,
  InfinityIcon
} from "lucide-react";

const features = [
  {
    title: "Image Generation",
    description: "Generate stunning images with multiple AI models including Stable Diffusion, Flux, and more.",
    icon: ImageIcon,
    href: "/generate/image",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Video Generation",
    description: "Create AI-powered videos with motion control, transitions, and cinematic effects.",
    icon: VideoIcon,
    href: "/generate/video",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Image Editor",
    description: "Edit images with AI-powered tools: inpaint, upscale, background removal, and more.",
    icon: WandIcon,
    href: "/edit/image",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Video Editor",
    description: "Edit videos with motion control, transitions, effects, and speed adjustments.",
    icon: ScissorsIcon,
    href: "/edit/video",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Asset Library",
    description: "Browse and download free stock images, videos, vectors, fonts, and icons.",
    icon: FolderIcon,
    href: "/assets",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Workspaces",
    description: "Collaborate in real-time with infinite canvas and shared creative spaces.",
    icon: UsersIcon,
    href: "/workspace",
    gradient: "from-indigo-500 to-purple-500",
  },
];

const highlights = [
  { icon: SparklesIcon, text: "Free Forever" },
  { icon: ZapIcon, text: "No Rate Limits" },
  { icon: InfinityIcon, text: "Unlimited Generations" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen mesh-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 py-20">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
              <SparklesIcon className="w-4 h-4 text-purple-400" />
              <span className="text-muted-foreground">100% Free • No Authentication Required</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="gradient-text">AI Creative Suite</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              The ultimate free AI-powered creative platform. Generate images, videos, 
              edit content, and collaborate—all without limits or accounts.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <item.icon className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-8">
              <Link
                href="/generate/image"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-semibold text-lg transition-all duration-300 glow-purple hover:scale-105"
              >
                <SparklesIcon className="w-5 h-5" />
                Start Creating
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative p-6 rounded-2xl glass hover:bg-white/5 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground">
                {feature.description}
              </p>
              
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>AI Creative Suite • Free & Open Source • No Authentication Required</p>
        </div>
      </footer>
    </main>
  );
}
