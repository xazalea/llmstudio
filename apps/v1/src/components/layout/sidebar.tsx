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
  ChevronLeftIcon,
  MessageSquareIcon,
  MusicIcon,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "AI Chat", href: "/chat", icon: MessageSquareIcon, badge: "NEW" },
  { name: "Image Generation", href: "/generate/image", icon: ImageIcon, badge: "AI" },
  { name: "Video Generation", href: "/generate/video", icon: VideoIcon, badge: "AI" },
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                AI Suite
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ChevronLeftIcon className={cn(
              "h-4 w-4 text-gray-400 transition-transform",
              collapsed && "rotate-180"
            )} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {!collapsed && (
            <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Create
            </div>
          )}
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-violet-500/10 text-violet-400 shadow-lg shadow-violet-500/5"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-violet-400")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-violet-500/20 text-violet-400">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {!collapsed && (
            <div className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              More
            </div>
          )}
          {collapsed && <div className="my-4 mx-3 border-t border-white/10" />}
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-violet-500/10 text-violet-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-white/10 p-4">
            <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-4 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold text-violet-400">Free Forever</span>
              </div>
              <p className="text-xs text-gray-400">
                No account needed. Unlimited generations.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
