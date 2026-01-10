"use client";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  FileText,
  ClipboardList,
  BarChart3,
  Settings,
  ChevronLeft,
  LogOut,
  Menu,
  X,
  School,
  Layers3,
  FileStack,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Classes", url: "/classes", icon: School },
  { title: "Subjects", url: "/subjects", icon: BookOpen },
  { title: "Chapters", url: "/chapters", icon: Layers3 },
  { title: "Institutes", url: "/institutes", icon: Building2 },
  { title: "Batches", url: "/batches", icon: FileStack },
  { title: "Students", url: "/students", icon: GraduationCap },
  { title: "Exams", url: "/exams", icon: ClipboardList },
  { title: "MCQ Bank", url: "/mcqs", icon: FileText },
  { title: "Results", url: "/results", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

function SidebarContent({
  collapsed,
  onItemClick,
}: {
  collapsed: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  return (
    <>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.url === "/"
                ? pathname === item.url
                : pathname.startsWith(item.url);

            return (
              <li key={item.url}>
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <Link
          href="/"
          onClick={onItemClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Back to App</span>}
        </Link>
      </div>
    </>
  );
}

// Mobile Header with Sheet
export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center px-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            {/* Sheet Header */}
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    A
                  </span>
                </div>
                <span className="font-semibold text-foreground">
                  Admin Panel
                </span>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
            <SidebarContent
              collapsed={false}
              onItemClick={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 ml-3">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">A</span>
        </div>
        <span className="font-semibold text-foreground text-sm">
          Admin Panel
        </span>
      </div>
    </header>
  );
}

// Desktop Sidebar
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:block fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  A
                </span>
              </div>
              <span className="font-semibold text-foreground">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("h-8 w-8", collapsed && "mx-auto")}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
        <SidebarContent collapsed={collapsed} />
      </div>
    </aside>
  );
}
