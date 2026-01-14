"use client";

import { Bell, LogOut, User, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@workspace/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/auth/client";
import Image from "next/image";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [unreadNotifications] = useState(3);
  const router = useRouter();
  const { data } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  const initials =
    data?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) || "U";

  const pathName = usePathname();
  const currentPage = pathName.split("/")[1];

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-14 lg:h-16 items-center justify-between px-4 lg:px-6 gap-4 lg:gap-6">
        {/* Mobile: Page Title (full width) */}
        <div className="flex-1 flex items-center gap-2 lg:hidden">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            size="icon"
            className={cn("", !currentPage && "hidden")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-x-2 md:hidden">
            <Image src="/logo.jpg" alt="Logo" width={36} height={36} />
            <div>
              <p className="text-primary font-bold text-xl text-red-600 tracking-widest">
                Mr. Dr.
              </p>
              <p className="text-xs text-muted-foreground -mt-1">
                Academic & Admission Care
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 gap-2 px-2 lg:px-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={data?.user?.image || undefined}
                    alt={data?.user?.name}
                  />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:block text-sm font-medium max-w-[120px] truncate">
                  {data?.user?.name?.split(" ")[0]}
                </span>
                <ChevronDown className="hidden lg:block h-4 w-4 opacity-50 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={data?.user?.image || undefined}
                      alt={data?.user?.name}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {data?.user?.name}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

// Notification Item Component
interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  isUnread?: boolean;
}

function NotificationItem({
  title,
  description,
  time,
  isUnread,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex gap-3 p-3 hover:bg-muted cursor-pointer transition-colors",
        isUnread && "bg-primary/5"
      )}
    >
      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}
