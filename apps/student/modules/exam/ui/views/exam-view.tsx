"use client";

import { useState } from "react";
import { ExamCard } from "@/components/exam-card";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Search, BookOpen, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetExams } from "../../filters/use-get-exams";
import { EXAM_STATUS } from "@workspace/utils/constant";
import { useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { PageHeader } from "@/modules/layout/ui/components/page-header";

export const ExamView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useGetExams();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const debounceSearchValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    setFilters({ ...filters, search: debounceSearchValue });
  }, [debounceSearchValue, setFilters, filters]);

  const { data } = useSuspenseQuery(
    trpc.student.exam.getMany.queryOptions(filters)
  );

  const {
    totalExam = 0,
    upcomingExam = 0,
    activeExam = 0,
    completedExam = 0,
    exams = [],
  } = data || {};

  return (
    <>
      <PageHeader title="Exams" subtitle="View and take your exams" />

      <div className="px-4 lg:px-8 py-4 lg:py-6 max-w-7xl mx-auto">
        {/* Desktop Stats Cards */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 mb-6">
          <Card
            className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("all")}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalExam}</p>
              <p className="text-sm text-muted-foreground">Total Exams</p>
            </div>
          </Card>
          <Card
            className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("active")}
          >
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{activeExam}</p>
              <p className="text-sm text-muted-foreground">Active Now</p>
            </div>
          </Card>
          <Card
            className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("upcoming")}
          >
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{upcomingExam}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </Card>
          <Card
            className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab("expired")}
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <XCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground">
                {completedExam}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </Card>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              type="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            />
            <Input
              placeholder="Search exams by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Mobile Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setFilters({
                ...filters,
                status: value,
              });
            }}
            className="lg:hidden"
          >
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value={EXAM_STATUS.Ongoing}>Active</TabsTrigger>
              <TabsTrigger value={EXAM_STATUS.Upcoming}>Soon</TabsTrigger>
              <TabsTrigger value={EXAM_STATUS.Completed}>Past</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Desktop Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setFilters({
                ...filters,
                status: value,
              });
            }}
            className="hidden lg:block"
          >
            <TabsList>
              <TabsTrigger value="all">All Exams</TabsTrigger>
              <TabsTrigger value={EXAM_STATUS.Ongoing}>Active</TabsTrigger>
              <TabsTrigger value={EXAM_STATUS.Upcoming}>Upcoming</TabsTrigger>
              <TabsTrigger value={EXAM_STATUS.Completed}>Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Exam Grid */}
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {exams.length > 0 ? (
            exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                totalQuestions={exam._count.mcqs}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 text-center text-muted-foreground">
                <p className="text-5xl mb-4">📚</p>
                <p className="font-medium text-lg">No exams found</p>
                <p className="text-sm mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
