"use client";

import { FadeUp } from "@/components/scroll-animation";
import {
  Video,
  BookOpen,
  FileQuestion,
  Target,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    id: 1,
    label: "লাইভ ক্লাস",
    icon: Video,
    color: "bg-red-500",
    hoverColor: "group-hover:bg-red-600",
    link: "/services/live-class",
  },
  {
    id: 2,
    label: "ম্যাটারিয়ালস",
    icon: BookOpen,
    color: "bg-blue-500",
    hoverColor: "group-hover:bg-blue-600",
    link: "/services/materials",
  },
  {
    id: 3,
    label: "প্রশ্ন ব্যাংক",
    icon: FileQuestion,
    color: "bg-green-500",
    hoverColor: "group-hover:bg-green-600",
    link: "/services/question-bank",
  },
  {
    id: 4,
    label: "MCQ প্র্যাকটিস",
    icon: Target,
    color: "bg-purple-500",
    hoverColor: "group-hover:bg-purple-600",
    link: "/services/mcq-practice",
  },
];

export const QuickActionsBar = () => {
  return (
    <section className="py-6 -mt-8 relative z-10">
      <div className="container mx-auto px-4">
        <FadeUp>
          <div className="bg-card rounded-2xl shadow-lg border p-4 md:p-6">
            <div className="grid grid-cols-4 gap-3 md:gap-6">
              {actions.map((action) => (
                <Link
                  key={action.id}
                  href={action.link}
                  className="group flex flex-col items-center gap-2 md:gap-3 p-2 md:p-4 rounded-xl hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="relative">
                    <div
                      className={`${action.color} ${action.hoverColor} p-3 md:p-4 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                    >
                      <action.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full p-0.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs md:text-sm font-medium text-foreground text-center leading-tight">
                      {action.label}
                    </span>
                    <ArrowRight className="hidden md:flex h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
