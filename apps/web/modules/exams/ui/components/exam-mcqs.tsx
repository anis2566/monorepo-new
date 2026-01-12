"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Separator } from "@workspace/ui/components/separator";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Eye,
  BookOpen,
  Calculator,
  Image as ImageIcon,
  FileText,
  Link2,
  CheckCircle2,
  Search,
  Filter,
  ListChecks,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import { parseMathString } from "@/lib/katex";

interface ExamMcq {
  id: string;
  question: string;
  options: string[];
  statements: string[];
  answer: string;
  type: string;
  reference: string[];
  explanation: string | null;
  isMath: boolean;
  session: number;
  source: string | null;
  questionUrl: string | null;
  context: string | null;
  contextUrl: string | null;
  subject: string;
  chapter: string;
  order: number;
}

interface ExamMcqsCardViewProps {
  mcqs: ExamMcq[];
}

export function ExamMcqsCardView({ mcqs }: ExamMcqsCardViewProps) {
  const [selectedMcq, setSelectedMcq] = useState<ExamMcq | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Get unique subjects and types
  const subjects = Array.from(new Set(mcqs.map((m) => m.subject)));
  const types = Array.from(new Set(mcqs.map((m) => m.type)));

  // Filter MCQs
  const filteredMcqs = mcqs.filter((mcq) => {
    const matchesSearch =
      searchQuery === "" ||
      mcq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mcq.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      filterSubject === "all" || mcq.subject === filterSubject;
    const matchesType = filterType === "all" || mcq.type === filterType;

    return matchesSearch && matchesSubject && matchesType;
  });

  const handleViewMcq = (mcq: ExamMcq) => {
    setSelectedMcq(mcq);
    setIsDialogOpen(true);
  };

  if (mcqs.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground">No MCQs found for this exam</p>
      </div>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListChecks className="h-5 w-5 text-primary" />
          Questions ({mcqs.length})
        </CardTitle>
        <CardDescription>MCQs included in this examination</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredMcqs.length} of {mcqs.length} questions
          </span>
        </div>

        {/* MCQ Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMcqs.map((mcq) => (
            <Card
              key={mcq.id}
              className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer"
              onClick={() => handleViewMcq(mcq)}
            >
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="font-mono font-bold text-primary"
                    >
                      #{mcq.order}
                    </Badge>
                    {mcq.isMath && (
                      <Badge variant="secondary" className="gap-1">
                        <Calculator className="h-3 w-3" />
                        Math
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewMcq(mcq);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Question Preview */}
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    {mcq.questionUrl && (
                      <ImageIcon className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    )}
                    {mcq.context && (
                      <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground line-clamp-3 leading-relaxed">
                    {mcq.isMath ? parseMathString(mcq.question) : mcq.question}
                  </p>
                </div>

                {/* Metadata */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">
                      {mcq.subject}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {mcq.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="line-clamp-1">{mcq.chapter}</span>
                    <span className="shrink-0">{mcq.reference.join(", ")}</span>
                  </div>
                </div>

                {/* Options Count */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {mcq.options.length} options
                    {mcq.statements.length > 0 &&
                      ` • ${mcq.statements.length} statements`}
                  </span>
                  {mcq.explanation && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-primary/5 text-primary border-primary/20"
                    >
                      Has explanation
                    </Badge>
                  )}
                </div>

                {/* Source & Reference */}
                {(mcq.source || mcq.reference.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                    {mcq.source && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Link2 className="h-3 w-3" />
                        {mcq.source}
                      </Badge>
                    )}
                    {mcq.reference.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {mcq.reference.length} refs
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMcqs.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">
              No questions match your filters
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setFilterSubject("all");
                setFilterType("all");
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* MCQ Detail Dialog */}
        {selectedMcq && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle>Question #{selectedMcq.order}</DialogTitle>
                  <Badge variant="outline">{selectedMcq.type}</Badge>
                  {selectedMcq.isMath && (
                    <Badge variant="secondary" className="gap-1">
                      <Calculator className="h-3 w-3" />
                      Math
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    Session {selectedMcq.session}
                  </Badge>
                </div>
                <DialogDescription>
                  {selectedMcq.subject} • {selectedMcq.chapter}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Context */}
                {selectedMcq.context && (
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">Context</p>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {selectedMcq.isMath
                        ? parseMathString(selectedMcq.context)
                        : selectedMcq.context}
                    </p>
                    {selectedMcq.contextUrl && (
                      <div className="mt-4">
                        <Image
                          src={selectedMcq.contextUrl}
                          alt="Context"
                          width={500}
                          height={500}
                          className="rounded-lg border border-border max-w-full"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Question */}
                <div>
                  <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Question
                  </p>
                  <p className="text-base font-medium text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedMcq.isMath
                      ? parseMathString(selectedMcq.question)
                      : selectedMcq.question}
                  </p>
                  {selectedMcq.questionUrl && (
                    <div className="mt-4">
                      <Image
                        src={selectedMcq.questionUrl}
                        alt="Question"
                        width={500}
                        height={500}
                        className="rounded-lg border border-border max-w-full shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Statements */}
                {selectedMcq.statements.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                        Statements
                      </p>
                      <div className="space-y-3">
                        {selectedMcq.statements.map((statement, index) => (
                          <div
                            key={index}
                            className="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border"
                          >
                            <span className="font-mono text-sm font-bold text-primary shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <p className="text-sm text-foreground leading-relaxed">
                              {selectedMcq.isMath
                                ? parseMathString(statement)
                                : statement}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Options */}
                <Separator />
                <div>
                  <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Options
                  </p>
                  <div className="grid gap-3">
                    {selectedMcq.options.map((option, index) => {
                      const optionLetter = String.fromCharCode(65 + index);
                      const isCorrect = selectedMcq.answer === option;

                      return (
                        <div
                          key={index}
                          className={cn(
                            "flex gap-3 p-4 rounded-lg border-2 transition-all",
                            isCorrect
                              ? "bg-success/10 border-success shadow-sm"
                              : "bg-card border-border hover:border-primary/50"
                          )}
                        >
                          <span
                            className={cn(
                              "font-mono text-sm font-bold shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all",
                              isCorrect
                                ? "bg-success text-white"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {optionLetter}
                          </span>
                          <p
                            className={cn(
                              "text-sm flex-1 leading-relaxed",
                              isCorrect
                                ? "text-foreground font-medium"
                                : "text-foreground"
                            )}
                          >
                            {selectedMcq.isMath
                              ? parseMathString(option)
                              : option}
                          </p>
                          {isCorrect && (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-success" />
                              <Badge
                                variant="outline"
                                className="bg-success/20 text-success border-success"
                              >
                                Correct
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                {selectedMcq.explanation && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                        Explanation
                      </p>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                          {selectedMcq.isMath
                            ? parseMathString(selectedMcq.explanation)
                            : selectedMcq.explanation}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* References */}
                {selectedMcq.reference.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                        References
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMcq.reference.map((ref, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="gap-1.5"
                          >
                            <Link2 className="h-3 w-3" />
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Source */}
                {selectedMcq.source && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                        Source
                      </p>
                      <Badge variant="secondary" className="gap-1.5">
                        <BookOpen className="h-3 w-3" />
                        {selectedMcq.source}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
