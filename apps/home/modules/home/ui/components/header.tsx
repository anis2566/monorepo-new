import { Stethoscope } from "lucide-react";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";

import { MobileNavDrawer } from "./mobile-nav-drawer";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-red-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Mr. Dr.</h1>
              <p className="text-xs text-white/80">মেডিকেল অ্যাডমিশন কোচিং</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#courses"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              কোর্সসমূহ
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              আমাদের সম্পর্কে
            </a>
            <a
              href="#success"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              সাফল্য
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              যোগাযোগ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="secondary" size="sm" className="hidden sm:flex">
                স্টুডেন্ট পোর্টাল
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                size="sm"
                variant="outline"
                className="hidden sm:flex bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                লগ ইন
              </Button>
            </Link>
            <MobileNavDrawer />
          </div>
        </div>
      </div>
    </header>
  );
};
