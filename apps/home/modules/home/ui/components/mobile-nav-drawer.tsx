"use client";

import {
  Menu,
  Stethoscope,
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

const navItems = [
  { href: "#", label: "হোম", icon: Home },
  { href: "#courses", label: "কোর্সসমূহ", icon: BookOpen },
  { href: "#about", label: "আমাদের সম্পর্কে", icon: Users },
  { href: "#success", label: "সাফল্য", icon: Trophy },
  { href: "#contact", label: "যোগাযোগ", icon: Phone },
];

export const MobileNavDrawer = () => {
  const [open, setOpen] = useState(false);

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
        className="w-[300px] p-0 bg-gradient-to-b from-primary to-primary/95"
      >
        <SheetHeader className="p-6 border-b border-white/10">
          <SheetTitle className="flex items-center gap-3 text-primary-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold">Mr. Dr.</h2>
              <p className="text-xs text-primary-foreground/70 font-normal">
                মেডিকেল অ্যাডমিশন কোচিং
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col p-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className="flex items-center gap-4 px-4 py-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-xl transition-all group"
            >
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-lg">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 space-y-3">
          <Link href="/dashboard" onClick={handleNavClick}>
            <Button variant="secondary" className="w-full gap-2" size="lg">
              <GraduationCap className="h-5 w-5" />
              স্টুডেন্ট পোর্টাল
            </Button>
          </Link>
          <Link href="/admin" onClick={handleNavClick}>
            <Button
              className="w-full bg-white text-primary hover:bg-white/90 gap-2"
              size="lg"
            >
              লগ ইন
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
