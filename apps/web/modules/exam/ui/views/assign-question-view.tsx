"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
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

interface AssignQuestionViewProps {
  subjectIds: string[];
  examId: string;
  onAssign?: (selectedMcqs: string[]) => void;
}

export const AssignQuestionView = ({
  subjectIds,
  examId,
  onAssign,
}: AssignQuestionViewProps) => {
  const trpc = useTRPC();
  const [selectedMcqs, setSelectedMcqs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSession, setFilterSession] = useState<number | "all">("all");

  const { data: mcqsBySubject, isLoading } = useQuery(
    trpc.admin.mcq.getManyBySubjects.queryOptions({
      subjectIds,
    })
  );

  const { data: subjects } = useQuery(
    trpc.admin.subject.forSelect.queryOptions({
      search: "",
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
    const filteredMcqs = filterMcqs(subjectMcqs);
    const newSelected = new Set(selectedMcqs);

    const allSelected = filteredMcqs.every((mcq) => newSelected.has(mcq.id));

    if (allSelected) {
      filteredMcqs.forEach((mcq) => newSelected.delete(mcq.id));
    } else {
      filteredMcqs.forEach((mcq) => newSelected.add(mcq.id));
    }

    setSelectedMcqs(newSelected);
  };

  const handleSelectAll = () => {
    if (!mcqsBySubject) return;

    const allMcqs = Object.values(mcqsBySubject).flat();
    const filteredMcqs = filterMcqs(allMcqs);
    const newSelected = new Set(selectedMcqs);

    const allSelected = filteredMcqs.every((mcq) => newSelected.has(mcq.id));

    if (allSelected) {
      filteredMcqs.forEach((mcq) => newSelected.delete(mcq.id));
    } else {
      filteredMcqs.forEach((mcq) => newSelected.add(mcq.id));
    }

    setSelectedMcqs(newSelected);
  };

  const filterMcqs = (mcqs: any[]) => {
    return mcqs.filter((mcq) => {
      const matchesSearch =
        searchQuery === "" ||
        mcq.question.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || mcq.type === filterType;
      const matchesSession =
        filterSession === "all" || mcq.session === filterSession;

      return matchesSearch && matchesType && matchesSession;
    });
  };

  const handleAssign = () => {
    onAssign?.(Array.from(selectedMcqs));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  const allMcqs = mcqsBySubject ? Object.values(mcqsBySubject).flat() : [];
  const uniqueTypes = [...new Set(allMcqs.map((mcq) => mcq.type))];
  const uniqueSessions = [...new Set(allMcqs.map((mcq) => mcq.session))].sort(
    (a, b) => a - b
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assign Questions to Exam</h1>
          <p className="text-sm text-muted-foreground">
            Selected: {selectedMcqs.size} questions
          </p>
        </div>
        <Button onClick={handleAssign} disabled={selectedMcqs.size === 0}>
          Assign Selected ({selectedMcqs.size})
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2 border rounded-md"
                value={filterSession}
                onChange={(e) =>
                  setFilterSession(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
              >
                <option value="all">All Sessions</option>
                {uniqueSessions.map((session) => (
                  <option key={session} value={session}>
                    Session {session}
                  </option>
                ))}
              </select>

              <Button variant="outline" onClick={handleSelectAll}>
                {selectedMcqs.size === filterMcqs(allMcqs).length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Tabs */}
      <Tabs defaultValue={subjectIds[0]} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {subjects?.map((subject) => {
            const subjectMcqs = mcqsBySubject?.[subject.id] || [];
            const filteredCount = filterMcqs(subjectMcqs).length;
            const selectedCount = subjectMcqs.filter((mcq) =>
              selectedMcqs.has(mcq.id)
            ).length;

            return (
              <TabsTrigger
                key={subject.id}
                value={subject.id}
                className="relative"
              >
                {subject.name}
                <Badge variant="secondary" className="ml-2">
                  {selectedCount}/{filteredCount}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {subjects?.map((subject) => {
          const subjectMcqs = mcqsBySubject?.[subject.id] || [];
          const filteredMcqs = filterMcqs(subjectMcqs);
          const allSelected =
            filteredMcqs.length > 0 &&
            filteredMcqs.every((mcq) => selectedMcqs.has(mcq.id));

          return (
            <TabsContent key={subject.id} value={subject.id} className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {filteredMcqs.length} questions
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAllInSubject(subject.id)}
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                      {filteredMcqs.map((mcq, index) => (
                        <div
                          key={mcq.id}
                          className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <Checkbox
                            checked={selectedMcqs.has(mcq.id)}
                            onCheckedChange={() => handleSelectMcq(mcq.id)}
                          />

                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium">
                                {index + 1}. {mcq.question}
                              </p>
                              <div className="flex gap-2 flex-shrink-0">
                                <Badge variant="outline">{mcq.type}</Badge>
                                <Badge variant="secondary">
                                  Session {mcq.session}
                                </Badge>
                                {mcq.isMath && <Badge>Math</Badge>}
                              </div>
                            </div>

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
                                  {String.fromCharCode(65 + i)}. {option}
                                </div>
                              ))}
                            </div>

                            {mcq.explanation && (
                              <p className="text-sm text-muted-foreground italic">
                                Explanation: {mcq.explanation}
                              </p>
                            )}

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
