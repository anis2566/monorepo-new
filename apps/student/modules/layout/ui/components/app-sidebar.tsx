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
  UsersRound,
  Shapes,
  Layers3,
  Layers2,
  NotebookPen,
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
        icon: Shapes,
        subItems: [],
      },
      {
        label: "Institute",
        url: "/institute",
        icon: School,
        subItems: [],
      },
      {
        label: "Subject",
        url: "/subject",
        icon: BookOpen,
        subItems: [],
      },
      {
        label: "Chapter",
        url: "/chapter",
        icon: Layers3,
        subItems: [],
      },
      {
        label: "Student",
        url: "/student",
        icon: UsersRound,
        subItems: [
          {
            label: "New",
            url: "/student/new",
            icon: PlusCircle,
          },
          {
            label: "List",
            url: "/student",
            icon: List,
          },
        ],
      },
      {
        label: "Batch",
        url: "/batch",
        icon: Layers2,
        subItems: [],
      },
      {
        label: "Exam",
        url: "/exam",
        icon: NotebookPen,
        subItems: [
          {
            label: "New",
            url: "/exam/new",
            icon: PlusCircle,
          },
          {
            label: "List",
            url: "/exam",
            icon: List,
          },
        ],
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Improved helper function to check if a route is active
  const isActive = (url: string, subItems?: SubItem[]) => {
    // Exact match for root
    if (url === "/") {
      return pathname === "/";
    }

    // If item has sub-items, it should only be active if pathname matches exactly
    // or if one of its children is active
    if (subItems && subItems.length > 0) {
      // Check if any sub-item is active
      const hasActiveChild = subItems.some((subItem) => {
        if (subItem.url === url) {
          // If sub-item URL is same as parent, use exact match
          return pathname === url;
        }
        // For sub-items, check if pathname matches exactly or starts with the URL
        return (
          pathname === subItem.url || pathname.startsWith(subItem.url + "/")
        );
      });

      return hasActiveChild;
    }

    // For items without sub-items, use exact match or starts with
    return pathname === url || pathname.startsWith(url + "/");
  };

  // Improved helper function to check if a specific sub-item is active
  const isSubItemActive = (url: string, parentUrl: string) => {
    // If sub-item URL equals parent URL (like "List" with /student)
    if (url === parentUrl) {
      return pathname === url;
    }

    // For other sub-items, check exact match or starts with
    return pathname === url || pathname.startsWith(url + "/");
  };

  // Helper function to check if any sub-item is active (for parent highlighting)
  const hasActiveSubItem = (subItems?: SubItem[], parentUrl?: string) => {
    if (!subItems || subItems.length === 0) return false;

    return subItems.some((subItem) => {
      if (subItem.url === parentUrl) {
        return pathname === parentUrl;
      }
      return pathname === subItem.url || pathname.startsWith(subItem.url + "/");
    });
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
                    const hasActive = hasActiveSubItem(
                      menuItem.subItems,
                      menuItem.url
                    );

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
                              // isActive={hasActive}
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
                                    isActive={isSubItemActive(
                                      subItem.url,
                                      menuItem.url
                                    )}
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
