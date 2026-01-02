import { ReactNode } from "react";
import { BottomNav } from "../components/bottom-nav";
import { DesktopSidebar } from "../components/desktop-sidebar";

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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className={!hideNav ? "pb-20 lg:pb-0" : ""}>{children}</main>

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
