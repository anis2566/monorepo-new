import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import { AppSidebar } from "../components/app-sidebar";
import Link from "next/link";
import Image from "next/image";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/40 backdrop-blur-lg border-border/50 px-6">
          <SidebarTrigger />
          <Link href="/">
            <Image
              src="/logo.jjpg"
              alt="Logo"
              width={30}
              height={30}
              className="md:hidden"
            />
          </Link>
          <div className="flex-1" />

          <div className="flex items-center gap-2">{/* <UserNav /> */}</div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
