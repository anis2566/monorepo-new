"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import { useGetCourses } from "../../filters/use-get-courses";
import { Header } from "../components/header";
import { Stats } from "../components/stats";
import { CoursesList } from "../components/course-list";

export const CoursesView = () => {
  const trpc = useTRPC();
  const [filters] = useGetCourses();

  const { data } = useQuery(trpc.admin.course.getMany.queryOptions(filters));

  const {
    courses = [],
    totalCount = 0,
    totalCourse = 0,
    activeCourse = 0,
    popularCourse = 0,
  } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Stats
        totalCourse={totalCourse}
        activeCourse={activeCourse}
        popularCourse={popularCourse}
      />
      <CoursesList courses={courses} totalCount={totalCount} />
    </div>
  );
};
