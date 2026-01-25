"use client";

import {
  Menu,
  BookOpen,
  Users,
  Trophy,
  Phone,
  Home,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

const navItems = [
  { href: "/", label: "হোম", icon: Home },
  { href: "/courses", label: "কোর্সসমূহ", icon: BookOpen },
  { href: "/about", label: "আমাদের সম্পর্কে", icon: Users },
  { href: "/success-stories", label: "সাফল্য", icon: Trophy },
  { href: "/contact", label: "যোগাযোগ", icon: Phone },
];

export const MobileNavDrawer = () => {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary-foreground hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">মেনু খুলুন</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] p-0 bg-gradient-to-b from-primary to-primary/95 font-solaimanlipi"
      >
        <SheetHeader className="p-6 border-b border-white/10">
          <SheetTitle className="flex items-center gap-3 text-primary-foreground">
            <Link href="/" className="flex items-center gap-1 md:gap-3">
              <div className="flex h-12 w-12 items-center justify-center bg-white/20 backdrop-blur">
                <Image src="/logo.jpg" alt="Logo" width={50} height={50} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Mr. Dr.</h1>
                <p className="text-xs text-primary-foreground/80">
                  SSC | HSC | Admission
                </p>
              </div>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col p-4 gap-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-4 px-4 py-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-xl transition-all group",
                pathname === item.href && "bg-white/10",
              )}
            >
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 space-y-3">
          <Button
            variant="secondary"
            className="w-full gap-2"
            size="lg"
            asChild
          >
            <Link href="https://student.mrdr.education" target="_blank">
              <GraduationCap className="h-5 w-5" />
              স্টুডেন্ট পোর্টাল
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
