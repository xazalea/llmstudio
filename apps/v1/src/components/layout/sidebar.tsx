"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  VideoIcon,
  WandIcon,
  ScissorsIcon,
  FolderIcon,
  UsersIcon,
  HomeIcon,
  SparklesIcon,
  SettingsIcon,
  HistoryIcon,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Image Generation", href: "/generate/image", icon: ImageIcon },
  { name: "Video Generation", href: "/generate/video", icon: VideoIcon },
  { name: "Image Editor", href: "/edit/image", icon: WandIcon },
  { name: "Video Editor", href: "/edit/video", icon: ScissorsIcon },
  { name: "Assets Library", href: "/assets", icon: FolderIcon },
  { name: "Workspaces", href: "/workspace", icon: UsersIcon },
];

const secondaryNav = [
  { name: "History", href: "/history", icon: HistoryIcon },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <SparklesIcon className="h-6 w-6 text-purple-500" />
          <span className="text-lg font-bold gradient-text">AI Suite</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
            Create
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}

          <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase text-muted-foreground">
            More
          </div>
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4">
            <p className="text-xs text-muted-foreground">
              Free & Unlimited
              <br />
              No account required
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
