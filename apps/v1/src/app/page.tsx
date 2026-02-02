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
  InfinityIcon,
  ArrowRightIcon,
  StarIcon,
  RocketIcon,
  MessageSquareIcon,
} from "lucide-react";

const features = [
  {
    title: "AI Chat",
    description: "Chat with powerful LLMs like Qwen 72B, Llama 3, Mistral, and Gemma - completely free with streaming.",
    icon: MessageSquareIcon,
    href: "/chat",
    gradient: "from-emerald-500 to-cyan-600",
    stats: "5+ Models",
  },
  {
    title: "Image Generation",
    description: "Generate stunning images with FLUX, Stable Diffusion XL, SDXL Turbo, and more AI models.",
    icon: ImageIcon,
    href: "/generate/image",
    gradient: "from-violet-600 to-fuchsia-600",
    stats: "7+ Models",
  },
  {
    title: "Video Generation", 
    description: "Create AI-powered videos with motion control, camera presets, and cinematic effects.",
    icon: VideoIcon,
    href: "/generate/video",
    gradient: "from-cyan-500 to-blue-600",
    stats: "4+ Models",
  },
  {
    title: "Image Editor",
    description: "AI inpainting, 4x upscaling, background removal, style transfer, and enhancement.",
    icon: WandIcon,
    href: "/edit/image",
    gradient: "from-orange-500 to-rose-600",
    stats: "10+ Tools",
  },
  {
    title: "Video Editor",
    description: "Trim, speed control, reverse, effects, stabilization, and frame interpolation.",
    icon: ScissorsIcon,
    href: "/edit/video",
    gradient: "from-emerald-500 to-teal-600",
    stats: "8+ Tools",
  },
  {
    title: "Asset Library",
    description: "Browse and download free stock photos, videos, vectors, fonts, and icons.",
    icon: FolderIcon,
    href: "/assets",
    gradient: "from-amber-500 to-orange-600",
    stats: "Free Assets",
  },
  {
    title: "Workspaces",
    description: "Infinite canvas for real-time collaboration with text, shapes, and images.",
    icon: UsersIcon,
    href: "/workspace",
    gradient: "from-indigo-500 to-purple-600",
    stats: "Collaborate",
  },
];

const highlights = [
  { icon: SparklesIcon, text: "Free Forever", color: "text-violet-400" },
  { icon: ZapIcon, text: "No Rate Limits", color: "text-cyan-400" },
  { icon: InfinityIcon, text: "Unlimited", color: "text-fuchsia-400" },
  { icon: RocketIcon, text: "No Sign Up", color: "text-emerald-400" },
];

const models = [
  "FLUX.1 Schnell", "Stable Diffusion XL", "SDXL Turbo", "SD 3.5", 
  "AnimateDiff", "Qwen 72B", "Llama 3", "Mistral", "MusicGen"
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-6 pt-20 pb-16">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm text-gray-300">100% Free • No Authentication Required</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                AI Creative
              </span>
              <br />
              <span className="text-white">Suite</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              The ultimate free AI-powered creative platform. Generate images, videos, 
              edit content, and collaborate — <span className="text-white font-medium">all without limits or accounts.</span>
            </p>
            
            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-medium text-gray-200">{item.text}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                href="/generate/image"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-bold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105"
              >
                <SparklesIcon className="w-5 h-5" />
                Start Creating
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/assets"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-lg transition-all duration-300"
              >
                <FolderIcon className="w-5 h-5" />
                Browse Assets
              </Link>
            </div>

            {/* Model Tags */}
            <div className="pt-12">
              <p className="text-sm text-gray-500 mb-4">Powered by free open-source AI models</p>
              <div className="flex flex-wrap justify-center gap-2">
                {models.map((model) => (
                  <span 
                    key={model}
                    className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-400 text-lg">Professional AI creative tools, completely free</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Stats Badge */}
              <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                {feature.stats}
              </span>
              
              {/* Content */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-violet-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Arrow */}
              <div className="flex items-center gap-2 mt-4 text-sm font-medium text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Get Started <ArrowRightIcon className="w-4 h-4" />
              </div>
              
              {/* Hover Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black text-emerald-400">5+</div>
            <div className="text-gray-400 mt-2">Chat Models</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-violet-400">7+</div>
            <div className="text-gray-400 mt-2">Image Models</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-cyan-400">4+</div>
            <div className="text-gray-400 mt-2">Video Models</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-fuchsia-400">20+</div>
            <div className="text-gray-400 mt-2">Editing Tools</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-amber-400">∞</div>
            <div className="text-gray-400 mt-2">Free Forever</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">AI Creative Suite</span>
            </div>
            <p className="text-gray-500 text-sm">
              Free & Open Source • No Authentication Required • Unlimited Usage
            </p>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
              <Link href="/history" className="hover:text-white transition-colors">History</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
