"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Lock, Globe } from "lucide-react";

import { Header } from "../components/header";
import { Stats } from "../components/stats";
import { useGetExams } from "../../filters/use-get-exams";
import { ExamList } from "./exam-list";
import { Filter } from "../components/filter";
import { PublicExamsView } from "./public-exams-view";

export const ExamsView = () => {
  const trpc = useTRPC();
  const [filters] = useGetExams();

  const { data } = useSuspenseQuery(
    trpc.admin.exam.getMany.queryOptions(filters),
  );

  const {
    exams = [],
    totalCount = 0,
    totalExam = 0,
    activeExam = 0,
    upcomingExam = 0,
    completedExam = 0,
  } = data || {};

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Header />
      <Tabs defaultValue="exams">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="exams" className="gap-2">
            <Lock className="h-4 w-4" />
            <span>Regular Exams</span>
          </TabsTrigger>
          <TabsTrigger value="public" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>Public Exams</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="exams"></TabsContent>
        <TabsContent value="public">
          <PublicExamsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
