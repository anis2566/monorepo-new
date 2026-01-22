"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { CourseHeader } from "../components/course-header";
import { CourseQuickStats } from "../components/course-quick-stat";
import { CourseInfoCard } from "../components/course-info";
import { CourseFeaturesCard } from "../components/course-features-card";
import { CourseAssociationsCard } from "../components/course-association-card";
import { CoursePricingCard } from "../components/course-pricing-card";

interface CourseViewProps {
  courseId: string;
}

export const CourseView = ({ courseId }: CourseViewProps) => {
  const trpc = useTRPC();

  const { data: course, isLoading } = useQuery(
    trpc.admin.course.getOne.queryOptions({ id: courseId }),
  );

  if (!isLoading && !course) {
    return redirect("/courses");
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      {/* Header */}
      <CourseHeader course={course} />

      {/* Quick Stats */}
      <CourseQuickStats course={course} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <CourseInfoCard course={course} />
          <CourseAssociationsCard
            classes={course?.classes ?? []}
            subjects={course?.subjects ?? []}
          />
        </div>

        {/* Sidebar - Takes 1 column on large screens */}
        <div className="space-y-4 sm:space-y-6">
          <CoursePricingCard course={course} />
          <CourseFeaturesCard course={course} />
        </div>
      </div>
    </div>
  );
};
