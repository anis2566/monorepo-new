"use client";

import * as React from "react";
import {
  ChevronRight,
  School,
  List,
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Layers,
  Megaphone,
  ClipboardPen,
  DollarSign,
  BringToFront,
  Users,
  FileQuestion,
  Trophy,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { Header } from "./header";
import { Separator } from "@workspace/ui/components/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

// Define types for navigation structure
type SubItem = {
  label: string;
  url: string;
  icon?: React.ComponentType;
};

type MenuItem = {
  label: string;
  url: string;
  icon?: React.ComponentType;
  subItems?: SubItem[];
};

type NavSection = {
  groupLabel: string;
  url: string;
  label: string;
  icon?: React.ComponentType;
  items: MenuItem[];
};

// Navigation data structure
const navData: NavSection[] = [
  {
    groupLabel: "",
    url: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    items: [],
  },
  {
    groupLabel: "Main",
    url: "",
    label: "Main",
    icon: School,
    items: [
      {
        label: "Class",
        url: "/class",
        icon: School,
        subItems: [],
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Helper function to check if a route is active
  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  // Helper function to check if any sub-item is active
  const hasActiveSubItem = (subItems?: SubItem[]) => {
    if (!subItems || subItems.length === 0) return false;
    return subItems.some((subItem) => isActive(subItem.url));
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Header />
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        {navData.map((section, index) => {
          // Handle items without groupLabel (like Dashboard)
          if (!section.groupLabel) {
            return (
              <SidebarGroup key={index} className="py-0">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={section.label}
                      className="tracking-wider"
                      isActive={isActive(section.url)}
                    >
                      <Link href={section.url}>
                        {section.icon && <section.icon />}
                        <span>{section.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            );
          }

          // Handle items with groupLabel (like Main section)
          return (
            <SidebarGroup key={index}>
              <SidebarGroupLabel>{section.groupLabel}</SidebarGroupLabel>
              <SidebarMenu>
                {section.items.map((menuItem) => {
                  // If menu item has sub-items, make it collapsible
                  if (menuItem.subItems && menuItem.subItems.length > 0) {
                    const hasActive = hasActiveSubItem(menuItem.subItems);

                    return (
                      <Collapsible
                        key={menuItem.label}
                        asChild
                        defaultOpen={hasActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={menuItem.label}
                              className="tracking-wider"
                              isActive={hasActive}
                            >
                              {menuItem.icon && <menuItem.icon />}
                              <span>{menuItem.label}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {menuItem.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.label}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className="tracking-wider"
                                    isActive={isActive(subItem.url)}
                                  >
                                    <Link href={subItem.url}>
                                      {subItem.icon && <subItem.icon />}
                                      <span>{subItem.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  // If no sub-items, render as simple link
                  return (
                    <SidebarMenuItem key={menuItem.label}>
                      <SidebarMenuButton
                        asChild
                        tooltip={menuItem.label}
                        className="tracking-wider"
                        isActive={isActive(menuItem.url)}
                      >
                        <Link href={menuItem.url}>
                          {menuItem.icon && <menuItem.icon />}
                          <span>{menuItem.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
