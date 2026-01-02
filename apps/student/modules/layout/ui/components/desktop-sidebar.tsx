"use client";

import { Home, BookOpen, Trophy, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/exams", icon: BookOpen, label: "Exams" },
  { href: "/results", icon: Trophy, label: "Results" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="font-bold text-foreground">Mr. Dr.</h1>
          <p className="text-xs text-muted-foreground">Student Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="px-4 py-3 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground">Need help?</p>
          <Link
            href="/support"
            className="text-sm font-medium text-primary hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </aside>
  );
}
