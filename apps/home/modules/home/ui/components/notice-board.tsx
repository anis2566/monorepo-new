import {
  Calendar,
  Clock,
  Bell,
  BookOpen,
  FileText,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";

interface Notice {
  id: number;
  title: string;
  date: string;
  time?: string;
  category: "exam" | "schedule" | "announcement" | "result";
  isNew?: boolean;
  isPinned?: boolean;
  description?: string;
}

const notices: Notice[] = [
  {
    id: 1,
    title: "Medical Admission Mock Test - 2026",
    date: "২৫ জানুয়ারি, ২০২৬",
    time: "সকাল ১০:০০",
    category: "exam",
    isNew: true,
    isPinned: true,
    description: "সম্পূর্ণ সিলেবাস অনুযায়ী ফুল মক টেস্ট",
  },
  {
    id: 2,
    title: "HSC 2026 ব্যাচ - নতুন ক্লাস শিডিউল",
    date: "২০ জানুয়ারি, ২০২৬",
    category: "schedule",
    isNew: true,
    description: "পদার্থ, রসায়ন ও জীববিজ্ঞান ক্লাসের নতুন সময়সূচী",
  },
  {
    id: 3,
    title: "ক্র্যাশ কোর্স রেজিস্ট্রেশন শুরু",
    date: "১৫ জানুয়ারি, ২০২৬",
    category: "announcement",
    isPinned: true,
    description: "মেডিকেল ভর্তি পরীক্ষার জন্য ৩০ দিনের ক্র্যাশ কোর্স",
  },
  {
    id: 4,
    title: "সাপ্তাহিক পরীক্ষা - জীববিজ্ঞান",
    date: "২২ জানুয়ারি, ২০২৬",
    time: "বিকাল ৪:০০",
    category: "exam",
    description: "অধ্যায় ১-৫ থেকে MCQ পরীক্ষা",
  },
  {
    id: 5,
    title: "গত মাসের মক টেস্ট রেজাল্ট প্রকাশ",
    date: "১৮ জানুয়ারি, ২০২৬",
    category: "result",
    description: "ডিসেম্বর মাসের সকল মক টেস্টের ফলাফল",
  },
  {
    id: 6,
    title: "অভিভাবক সভা",
    date: "২৮ জানুয়ারি, ২০২৬",
    time: "সকাল ১১:০০",
    category: "announcement",
    description: "শিক্ষার্থীদের অগ্রগতি নিয়ে আলোচনা",
  },
];

const categoryConfig = {
  exam: {
    icon: FileText,
    label: "পরীক্ষা",
    color: "bg-red-500/10 text-red-600 border-red-200",
  },
  schedule: {
    icon: Calendar,
    label: "শিডিউল",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  announcement: {
    icon: Bell,
    label: "বিজ্ঞপ্তি",
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
  },
  result: {
    icon: BookOpen,
    label: "রেজাল্ট",
    color: "bg-green-500/10 text-green-600 border-green-200",
  },
};

export const NoticeBoard = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-700/10 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Bell className="h-4 w-4" />
            <span>নোটিশ বোর্ড</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            গুরুত্বপূর্ণ বিজ্ঞপ্তি
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            আসন্ন পরীক্ষা, ক্লাস শিডিউল এবং গুরুত্বপূর্ণ তারিখসমূহ সম্পর্কে
            আপডেট থাকুন
          </p>
        </div>

        {/* Notice Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {notices.map((notice) => {
            const config = categoryConfig[notice.category];
            const Icon = config.icon;

            return (
              <Card
                key={notice.id}
                className={`group relative overflow-hidden border-l-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  notice.isPinned
                    ? "border-l-red-700"
                    : "border-l-muted-foreground/20"
                }`}
              >
                {notice.isPinned && (
                  <div className="absolute top-0 right-0 bg-red-700 text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
                    📌 পিন করা
                  </div>
                )}

                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-lg ${config.color} shrink-0`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs ${config.color}`}
                        >
                          {config.label}
                        </Badge>
                        {notice.isNew && (
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs animate-pulse">
                            নতুন
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {notice.title}
                      </h3>

                      {notice.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {notice.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{notice.date}</span>
                        </div>
                        {notice.time && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{notice.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <button className="inline-flex items-center gap-2 text-red-700 hover:text-red-700/80 font-medium transition-colors group">
            <span>সকল বিজ্ঞপ্তি দেখুন</span>
            <AlertCircle className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
