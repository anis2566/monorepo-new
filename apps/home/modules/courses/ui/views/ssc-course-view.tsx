"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Clock, GraduationCap, Target, Users } from "lucide-react";

interface SscCourseViewProps {
  courseId: string;
}

export const SscCourseView = ({ courseId }: SscCourseViewProps) => {
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.home.program.getOneProgram.queryOptions({ id: courseId }),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-600 to-green-700 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white/20 text-white border-0 mb-6 px-4 py-1 rounded-full flex items-center justify-center w-full max-w-fit mx-auto">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span className="text-sm">SSC 2028 ব্যাচ - ভর্তি চলছে</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              {data?.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              শক্তিশালী ভিত্তি গড়ে তুলুন Class 8-9 থেকেই। SSC পরীক্ষায় সাফল্য
              এবং ভবিষ্যতে Medical/Engineering এর জন্য প্রস্তুতি শুরু করুন।
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Clock className="h-5 w-5" />
                <span>৬ মাসের কোর্স</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Users className="h-5 w-5" />
                <span>ছোট ব্যাচ সাইজ</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Target className="h-5 w-5" />
                <span>১০০% ফোকাস</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="white"
                className="bg-white text-orange-500 gap-2"
              >
                <a href="#enrollment" className="flex items-center gap-2">
                  এখনই ভর্তি হন
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <a href="#syllabus" className="flex items-center gap-2">
                  সিলেবাস দেখুন
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
