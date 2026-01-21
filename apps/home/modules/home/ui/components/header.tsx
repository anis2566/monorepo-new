import Link from "next/link";

import { Button } from "@workspace/ui/components/button";

import { MobileNavDrawer } from "./mobile-nav-drawer";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
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

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/courses"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              কোর্সসমূহ
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              আমাদের সম্পর্কে
            </Link>
            <Link
              href="/success-stories"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              সাফল্য
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              যোগাযোগ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="https://student.mrdr.education" target="_blank">
              <Button variant="secondary" size="sm" className="hidden sm:flex">
                স্টুডেন্ট পোর্টাল
              </Button>
            </Link>
            <Link
              href="https://student.mrdr.education/auth/sign-in"
              target="_blank"
            >
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
