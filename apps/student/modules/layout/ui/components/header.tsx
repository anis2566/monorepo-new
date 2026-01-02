"use client";

import Image from "next/image";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";

export const Header = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={cn(
        "flex items-center gap-3 transition-all duration-300 ease-in-out",
        isCollapsed ? "justify-center px-0" : "px-2 py-1"
      )}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 shadow-lg shadow-primary/5 ring-1 ring-white/10 transition-all duration-300 hover:scale-105 active:scale-95">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={40}
          height={40}
          className="object-cover"
        />
        {/* Subtle glass effect highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
      </div>

      <div
        className={cn(
          "flex flex-col items-start overflow-hidden transition-all duration-300",
          isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
        )}
      >
        <h1 className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-base font-bold tracking-tight text-transparent leading-none mb-1 whitespace-nowrap">
          Mr. Dr.
        </h1>
        <div className="flex items-center gap-1.5 leading-none">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary/80"></span>
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 whitespace-nowrap">
            Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
};
