"use client";

import { SparklesIcon, MenuIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-[#030303]/80 backdrop-blur-xl px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      {title && (
        <h1 className="text-xl font-bold">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-4 py-1.5 border border-violet-500/30">
          <SparklesIcon className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-medium text-violet-300">Free & Unlimited</span>
        </div>
      </div>
    </header>
  );
}
