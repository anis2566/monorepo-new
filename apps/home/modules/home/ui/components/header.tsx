"use client";

import Link from "next/link";

import { Button } from "@workspace/ui/components/button";

import { MobileNavDrawer } from "./mobile-nav-drawer";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

const navs = [
  { href: "/", label: "হোম" },
  { href: "/courses", label: "কোর্সসমূহ" },
  { href: "/about", label: "আমাদের সম্পর্কে" },
  { href: "/success-stories", label: "সাফল্য" },
  { href: "/contact", label: "যোগাযোগ" },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-red-400 text-white font-bold font-solaimanlipi">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
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
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navs.map((nav) => (
              <Link
                key={nav.label}
                href={nav.href}
                className={cn(
                  "text-sm font-bold text-primary-foreground/80 hover:text-primary-foreground transition-colors",
                  pathname === nav.href && "text-primary-foreground underline",
                )}
              >
                {nav.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <Link href="https://student.mrdr.education">
              <Button variant="secondary" size="sm" className="md:text-base">
                স্টুডেন্ট পোর্টাল
              </Button>
            </Link>
            <MobileNavDrawer />
          </div>
        </div>
      </div>
    </header>
  );
};
