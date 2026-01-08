"use client";

import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Exam, Mcq } from "@workspace/db";
import { CheckCircle2, Send } from "lucide-react";
import { MCQ_TYPE } from "@workspace/utils/constant";
import { parseMathString } from "@/lib/katex";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";

interface ExamWithRelation extends Exam {
  subjects: {
    subjectId: string;
    subject: {
      name: string;
    };
  }[];
}

interface AssignQuestionViewProps {
  exam: ExamWithRelation;
}

interface SubjectFilters {
  hasReference: "all" | "with" | "without";
  type: string;
}

export const AssignQuestionView = ({ exam }: AssignQuestionViewProps) => {
  const [subjectFilters, setSubjectFilters] = useState<
    Record<string, SubjectFilters>
  >(() =>
    exam.subjects.reduce(
      (acc, subject) => ({
        ...acc,
        [subject.subjectId]: { hasReference: "all" as const, type: "all" },
      }),
      {} as Record<string, SubjectFilters>
    )
  );

  const trpc = useTRPC();
  const [selectedMcqs, setSelectedMcqs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: mcqsBySubject, isLoading } = useQuery(
    trpc.admin.mcq.getManyBySubjects.queryOptions({
      subjectIds: exam.subjects.map((subject) => subject.subjectId),
    })
  );

  const { mutate: assignQuestionToExam, isPending } = useMutation(
    trpc.admin.mcq.assignQuestionToExam.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }

        toast.success(data.message);
        router.push("/exam");
        // await queryClient.invalidateQueries({
        //   queryKey: trpc.admin.batch.getMany.queryKey(),
        // });
      },
    })
  );

  const handleSelectMcq = (mcqId: string) => {
    const newSelected = new Set(selectedMcqs);
    if (newSelected.has(mcqId)) {
      newSelected.delete(mcqId);
    } else {
      newSelected.add(mcqId);
    }
    setSelectedMcqs(newSelected);
  };

  const handleSelectAllInSubject = (subjectId: string) => {
    const subjectMcqs = mcqsBySubject?.[subjectId] || [];
    const filteredMcqs = filterMcqs(subjectMcqs, subjectId);
    const newSelected = new Set(selectedMcqs);

    const allSelected = filteredMcqs.every((mcq) => newSelected.has(mcq.id));

    if (allSelected) {
      if (
        Array.from(newSelected).length + Array.from(selectedMcqs).length >=
        exam.subjects.length
      ) {
        toast.error("You can't select more than one mcq from each subject");
        return;
      }
      filteredMcqs.forEach((mcq) => newSelected.delete(mcq.id));
    } else {
      if (
        Array.from(newSelected).length + Array.from(selectedMcqs).length >=
        exam.subjects.length
      ) {
        toast.error("You can't select more than one mcq from each subject");
        return;
      }
      filteredMcqs.forEach((mcq) => newSelected.add(mcq.id));
    }

    setSelectedMcqs(newSelected);
  };

  const updateSubjectFilter = (
    subjectId: string,
    filterKey: keyof SubjectFilters,
    value: string
  ) => {
    setSubjectFilters((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [filterKey]: value,
      } as SubjectFilters,
    }));
  };

  const filterMcqs = (mcqs: Mcq[], subjectId: string) => {
    const filters = subjectFilters[subjectId];
    if (!filters) return mcqs;

    return mcqs.filter((mcq) => {
      const matchesSearch =
        searchQuery === "" ||
        mcq.question.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filters.type === "all" || mcq.type === filters.type;

      const matchesReference =
        filters.hasReference === "all" ||
        (filters.hasReference === "with" && mcq.reference.length > 0) ||
        (filters.hasReference === "without" && mcq.reference.length === 0);

      return matchesSearch && matchesType && matchesReference;
    });
  };

  // Get statistics per subject
  const getSubjectStats = () => {
    if (!mcqsBySubject) return [];

    return exam.subjects.map((subject) => {
      const subjectMcqs = mcqsBySubject[subject.subjectId] || [];
      const selectedCount = subjectMcqs.filter((mcq) =>
        selectedMcqs.has(mcq.id)
      ).length;
      const totalCount = subjectMcqs.length;

      return {
        subjectId: subject.subjectId,
        name: subject.subject.name,
        selected: selectedCount,
        total: totalCount,
      };
    });
  };

  const handleAssign = () => {
    assignQuestionToExam({
      examId: exam.id,
      mcqIds: Array.from(selectedMcqs),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  const subjectStats = getSubjectStats();
  const totalSelected = selectedMcqs.size;

  return (
    <div className="space-y-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background border-b pb-4">
        <Card>
          <CardContent>
            <div className="space-y-4">
              {/* Overall Stats */}
              <div className="flex items-center justify-between border-b">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Selection</p>
                  <p className="text-2xl font-bold">
                    {totalSelected} / {exam?.mcq || 0}
                  </p>
                </div>
                <Badge
                  variant={totalSelected > 0 ? "default" : "secondary"}
                  className="text-lg px-4 py-2"
                >
                  {exam?.mcq && exam.mcq > 0
                    ? `${((totalSelected / exam.mcq) * 100).toFixed(1)}%`
                    : "0%"}
                </Badge>
              </div>

              {/* Per Subject Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {subjectStats.map((stat) => (
                  <div
                    key={stat.subjectId}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate">
                        {stat.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={stat.selected > 0 ? "default" : "outline"}
                          className="text-xs"
                        >
                          {stat.selected} / {stat.total}
                        </Badge>
                        {stat.total > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {((stat.selected / stat.total) * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                    {stat.selected === stat.total && stat.total > 0 && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleAssign}
                disabled={
                  isPending || selectedMcqs.size === 0
                  // Array.from(selectedMcqs).length != exam.subjects.length
                }
                className="w-full md:w-auto h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                {isPending ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <span className="flex items-center gap-2">
                    Assign questions
                    <Send className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Tabs */}
      <Tabs defaultValue={exam.subjects[0]?.subjectId || ""} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {exam.subjects.map((subject) => {
            const subjectMcqs = mcqsBySubject?.[subject.subjectId] || [];
            const filteredCount = filterMcqs(
              subjectMcqs,
              subject.subjectId
            ).length;
            const selectedCount = subjectMcqs.filter((mcq) =>
              selectedMcqs.has(mcq.id)
            ).length;

            return (
              <TabsTrigger
                key={subject.subjectId}
                value={subject.subjectId}
                className="relative"
              >
                {subject.subject.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {exam.subjects?.map((subject) => {
          const subjectMcqs = mcqsBySubject?.[subject.subjectId] || [];
          const filteredMcqs = filterMcqs(subjectMcqs, subject.subjectId);
          const allSelected =
            filteredMcqs.length > 0 &&
            filteredMcqs.every((mcq) => selectedMcqs.has(mcq.id));
          const currentFilters = subjectFilters[subject.subjectId];

          if (!currentFilters) return null;

          return (
            <TabsContent
              key={subject.subjectId}
              value={subject.subjectId}
              className="mt-4"
            >
              <Card>
                <CardHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {subject.subject.name}
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {filteredMcqs.length} questions
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleSelectAllInSubject(subject.subjectId)
                          }
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </Button>
                      </div>
                    </div>

                    {/* Subject-specific filters */}
                    <div className="flex flex-wrap gap-4 pt-2 border-t">
                      <Select
                        value={currentFilters.type}
                        onValueChange={(value) =>
                          updateSubjectFilter(subject.subjectId, "type", value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {Object.values(MCQ_TYPE).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={currentFilters.hasReference}
                        onValueChange={(value) =>
                          updateSubjectFilter(
                            subject.subjectId,
                            "hasReference",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select reference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Questions</SelectItem>
                          <SelectItem value="with">With Reference</SelectItem>
                          <SelectItem value="without">
                            Without Reference
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                      {filteredMcqs.map((mcq, index) => (
                        <div
                          key={mcq.id}
                          className={cn(
                            "flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors",
                            selectedMcqs.has(mcq.id) ? "bg-accent/30" : ""
                          )}
                        >
                          <Checkbox
                            checked={selectedMcqs.has(mcq.id)}
                            onCheckedChange={() => handleSelectMcq(mcq.id)}
                          />

                          <div className="flex-1 space-y-3">
                            {/* Context Section */}
                            {mcq.context && (
                              <div className="space-y-2 p-3 md:p-4 bg-muted/30 rounded-lg border">
                                <span className="text-sm block text-muted-foreground underline">
                                  উদ্দীপক
                                </span>
                                <span className="text-sm leading-relaxed">
                                  {mcq.isMath
                                    ? parseMathString(mcq.context)
                                    : mcq.context}
                                </span>
                              </div>
                            )}

                            {/* Statements Section */}
                            {mcq.statements && mcq.statements.length > 0 && (
                              <div className="space-y-2 p-3 md:p-4 bg-muted/30 rounded-lg border">
                                {mcq.statements.map((statement, idx) => (
                                  <div
                                    key={idx}
                                    className="flex gap-2 md:gap-3 text-sm"
                                  >
                                    <span className="font-semibold min-w-[20px] md:min-w-[24px] text-muted-foreground">
                                      {["i", "ii", "iii", "iv", "v"][idx] ||
                                        idx + 1}
                                      .
                                    </span>
                                    <span className="leading-relaxed">
                                      {mcq.isMath
                                        ? parseMathString(statement)
                                        : statement}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Question and Badges */}
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium">
                                {index + 1}.{" "}
                                {mcq.isMath
                                  ? parseMathString(mcq.question)
                                  : mcq.question}
                              </p>
                              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                                <Badge variant="outline">{mcq.type}</Badge>
                                <Badge variant="secondary">
                                  Session {mcq.session}
                                </Badge>
                                {mcq.isMath && <Badge>Math</Badge>}
                                {mcq.reference.length > 0 && (
                                  <Badge variant="default">Has Reference</Badge>
                                )}
                              </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-1 text-sm">
                              {mcq.options.map((option, i) => (
                                <div
                                  key={i}
                                  className={`pl-4 py-1 ${
                                    option === mcq.answer
                                      ? "text-green-600 font-medium"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {mcq.isMath
                                    ? parseMathString(option)
                                    : option}
                                </div>
                              ))}
                            </div>

                            {/* References */}
                            {mcq.reference.length > 0 && (
                              <div className="text-sm">
                                <span className="font-medium">
                                  References:{" "}
                                </span>
                                <span className="text-muted-foreground">
                                  {mcq.reference.join(", ")}
                                </span>
                              </div>
                            )}

                            {/* Explanation */}
                            {mcq.explanation && (
                              <p className="text-sm text-muted-foreground italic">
                                Explanation: {mcq.explanation}
                              </p>
                            )}

                            {/* Source */}
                            {mcq.source && (
                              <p className="text-xs text-muted-foreground">
                                Source: {mcq.source}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}

                      {filteredMcqs.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No questions found matching the filters
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
