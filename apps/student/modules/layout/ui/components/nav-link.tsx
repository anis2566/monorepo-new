"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, AnchorHTMLAttributes } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface NavLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  href: string;
  className?: string;
  activeClassName?: string;
  exact?: boolean; // Optional: for exact path matching
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, exact = false, ...props }, ref) => {
    const pathname = usePathname();

    // Determine if the link is active
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
