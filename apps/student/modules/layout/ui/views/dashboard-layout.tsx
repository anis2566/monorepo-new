import { ReactNode } from "react";
import { BottomNav } from "../components/bottom-nav";
import { DesktopSidebar } from "../components/desktop-sidebar";
import { Navbar } from "../components/navbar";
import { cn } from "@workspace/ui/lib/utils";

interface ResponsiveLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function ResponsiveLayout({
  children,
  hideNav = false,
}: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!hideNav && <DesktopSidebar />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        {!hideNav && <Navbar />}

        {/* Main Content */}
        <main
          className={cn(
            "flex-1",
            !hideNav && "pb-20 lg:pb-0" // Space for bottom nav on mobile
          )}
        >
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        {!hideNav && (
          <div className="lg:hidden">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}
