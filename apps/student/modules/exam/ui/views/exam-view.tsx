"use client";

import { useState } from "react";
import { ExamCard } from "@/components/exam-card";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { isAfter, isBefore } from "date-fns";
import { Search, BookOpen, Clock, CheckCircle2, XCircle } from "lucide-react";
import { mockExams } from "@/data/mock";
import { PageHeader } from "@/modules/layout/ui/components/page-header";

export const ExamView = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const now = new Date();

  const filteredExams = mockExams.filter((exam) => {
    const isActive =
      isAfter(now, exam.startDate) && isBefore(now, exam.endDate);
    const isUpcoming = isBefore(now, exam.startDate);
    const isExpired = isAfter(now, exam.endDate);

    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subjects.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTab = (() => {
      switch (activeTab) {
        case "active":
          return isActive;
        case "upcoming":
          return isUpcoming;
        case "expired":
          return isExpired;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesTab;
  });

  const stats = {
    total: mockExams.length,
    active: mockExams.filter(
      (e) => isAfter(now, e.startDate) && isBefore(now, e.endDate)
    ).length,
    upcoming: mockExams.filter((e) => isBefore(now, e.startDate)).length,
    expired: mockExams.filter((e) => isAfter(now, e.endDate)).length,
  };

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
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
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
              <p className="text-2xl font-bold text-success">{stats.active}</p>
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
              <p className="text-2xl font-bold text-warning">
                {stats.upcoming}
              </p>
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
                {stats.expired}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </Card>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
            onValueChange={setActiveTab}
            className="lg:hidden"
          >
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Soon</TabsTrigger>
              <TabsTrigger value="expired">Past</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Desktop Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="hidden lg:block"
          >
            <TabsList>
              <TabsTrigger value="all">All Exams</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="expired">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Exam Grid */}
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => <ExamCard key={exam.id} exam={exam} />)
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
