import { ReactNode } from "react";
import { Sidebar, MobileHeader } from "../components/sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />
      <main className="pt-14 lg:pt-0 lg:ml-16 lg:ml-64 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
