"use client";

import { useState } from "react";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { MCQ_TYPE } from "@workspace/utils/constant";
import { parseMathString } from "@/lib/katex";

type QuestionType = (typeof MCQ_TYPE)[keyof typeof MCQ_TYPE];

interface MCQ {
  question: string;
  options: string[];
  type: QuestionType;
  answer: string;
  statements?: string[];
  context?: string;
  isMath: boolean;
  explanation?: string;
  reference?: string[];
  subjectId: string;
  chapterId: string;
}

type EditingField =
  | { type: "question"; mcqIndex: number }
  | { type: "option"; mcqIndex: number; optionIndex: number }
  | { type: "answer"; mcqIndex: number }
  | { type: "statement"; mcqIndex: number; statementIndex: number }
  | { type: "reference"; mcqIndex: number; referenceIndex: number }
  | { type: "context"; mcqIndex: number }
  | null;

interface MCQFormProps {
  chapterId: string;
  subjectId: string;
}

export const MCQForm = ({ chapterId, subjectId }: MCQFormProps) => {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [editing, setEditing] = useState<EditingField>(null);
  const [jsonInput, setJsonInput] = useState("");

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createMCQ, isPending } = useMutation(
    trpc.admin.mcq.createMany.mutationOptions({
      onSuccess: async (data) => {
        if (data.message) {
          toast.success(data.message);
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: trpc.admin.chapter.getMany.queryKey(),
            }),
          ]);
          router.push(`/chapter`);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleChange = (
    value: string,
    mcqIndex: number,
    field: EditingField
  ) => {
    if (!field) return;

    const newMcqs = [...mcqs];

    switch (field.type) {
      case "question":
        if (newMcqs[mcqIndex]) {
          newMcqs[mcqIndex].question = value;
        }
        break;
      case "option":
        if (newMcqs[mcqIndex] && field.optionIndex !== undefined) {
          newMcqs[mcqIndex].options[field.optionIndex] = value;
        }
        break;
      case "answer":
        if (newMcqs[mcqIndex]) {
          newMcqs[mcqIndex].answer = value;
        }
        break;
      case "statement":
        if (newMcqs[mcqIndex] && !newMcqs[mcqIndex].statements)
          newMcqs[mcqIndex].statements = [];
        if (newMcqs[mcqIndex] && field.statementIndex !== undefined)
          newMcqs[mcqIndex].statements![field.statementIndex] = value;
        break;
      case "reference":
        if (newMcqs[mcqIndex] && !newMcqs[mcqIndex].reference)
          newMcqs[mcqIndex].reference = [];
        if (newMcqs[mcqIndex] && field.referenceIndex !== undefined)
          newMcqs[mcqIndex].reference![field.referenceIndex] = value;
        break;
      case "context":
        if (newMcqs[mcqIndex]) {
          newMcqs[mcqIndex].context = value;
        }
        break;
    }

    setMcqs(newMcqs);
  };

  const handleDelete = (mcqIndex: number) => {
    const newMcqs = mcqs.filter((_, i) => i !== mcqIndex);
    setMcqs(newMcqs);
    toast.success("MCQ deleted");
  };

  const handleAddOption = (mcqIndex: number) => {
    const newMcqs = [...mcqs];
    if (newMcqs[mcqIndex]) {
      newMcqs[mcqIndex].options.push("New Option");
    }
    setMcqs(newMcqs);
  };

  const handleAddStatement = (mcqIndex: number) => {
    const newMcqs = [...mcqs];
    if (newMcqs[mcqIndex] && !newMcqs[mcqIndex].statements) {
      newMcqs[mcqIndex].statements = [];
    }
    if (newMcqs[mcqIndex]) {
      newMcqs[mcqIndex].statements!.push("New Statement");
    }
    setMcqs(newMcqs);
  };

  const handleAddReference = (mcqIndex: number) => {
    const newMcqs = [...mcqs];
    if (newMcqs[mcqIndex] && !newMcqs[mcqIndex].reference) {
      newMcqs[mcqIndex].reference = [];
    }
    if (newMcqs[mcqIndex]) {
      newMcqs[mcqIndex].reference!.push("New Reference");
    }
    setMcqs(newMcqs);
  };

  const handleDeleteStatement = (mcqIndex: number, statementIndex: number) => {
    const newMcqs = [...mcqs];
    if (newMcqs[mcqIndex] && newMcqs[mcqIndex].statements) {
      newMcqs[mcqIndex].statements.splice(statementIndex, 1);
    }
    setMcqs(newMcqs);
  };

  const handleDeleteOption = (mcqIndex: number, optionIndex: number) => {
    const newMcqs = [...mcqs];
    if (newMcqs[mcqIndex] && newMcqs[mcqIndex].options) {
      newMcqs[mcqIndex].options.splice(optionIndex, 1);
    }
    setMcqs(newMcqs);
  };

  const handleDeleteReference = (mcqIndex: number, referenceIndex: number) => {
    const newMcqs = [...mcqs];
    if (newMcqs[mcqIndex] && newMcqs[mcqIndex].reference) {
      newMcqs[mcqIndex].reference.splice(referenceIndex, 1);
    }
    setMcqs(newMcqs);
  };

  const handleTypeChange = (mcqIndex: number, type: QuestionType) => {
    const newMcqs = [...mcqs];
    if (newMcqs[mcqIndex]) {
      newMcqs[mcqIndex].type = type;
    }
    setMcqs(newMcqs);
  };

  const handleIsMathChange = (mcqIndex: number, isMath: boolean) => {
    const newMcqs = [...mcqs];
    if (newMcqs[mcqIndex]) {
      newMcqs[mcqIndex].isMath = isMath;
    }
    setMcqs(newMcqs);
  };

  const handleBlur = () => setEditing(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setEditing(null);
    if (e.key === "Escape") setEditing(null);
  };

  const handleJsonPaste = () => {
    try {
      let parsed;
      try {
        parsed = JSON.parse(jsonInput);
      } catch {
        // Attempt to fix common JSON escape issues for LaTeX
        // We replace backslashes that are NOT followed by characters that indicate a valid JSON escape for structure (", \, /)
        // This ensures \f, \n, \r, \t, etc. (common in LaTeX like \frac, \not) become \\f, \\n which parse to literal \f, \n
        const fixedJson = jsonInput.replace(/\\(?!["\\/])/g, "\\\\");
        parsed = JSON.parse(fixedJson);
        toast.info("Auto-corrected invalid JSON escape characters");
      }

      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array");
      }

      const completed = parsed.map((item) => ({
        question: item.question || "",
        options: item.options || [],
        type: item.type || MCQ_TYPE.Single,
        answer: item.answer || "",
        statements: item.statements || undefined,
        context: item.context || undefined,
        isMath: item.isMath || false,
        explanation: undefined,
        reference: item.reference || undefined,
        subjectId: item.subjectId || subjectId,
        chapterId: item.chapterId || chapterId,
      }));

      setMcqs(completed);
      toast.success("MCQs imported from JSON");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Invalid JSON format"
      );
    }
  };

  const handleSave = async () => {
    try {
      await createMCQ(mcqs);

      toast.success("MCQs saved successfully");
      setMcqs([]);
      setJsonInput("");
    } catch (error) {
      toast.error("Failed to save MCQs");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* JSON Import Section */}
      <div className="space-y-2">
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Paste your JSON array of MCQs here, e.g.: [{"question": "What is 2+2?", "options": ["3", "4", "5"], "answer": "4", "type": "MCQ", "isMath": false, "reference": ["Textbook pg 10", "Notes"]}]'
          rows={10}
          className="font-mono"
        />
        <Button
          type="button"
          onClick={handleJsonPaste}
          disabled={!jsonInput.trim()}
        >
          Import from JSON
        </Button>
      </div>

      {/* MCQ List */}
      {mcqs.map((mcq, mcqIndex) => (
        <div
          key={mcqIndex}
          className="p-3 rounded-md border border-gray-600 space-y-2"
        >
          {/* Question */}
          <div>
            <div className="flex items-center justify-between gap-2">
              {editing?.type === "question" && editing.mcqIndex === mcqIndex ? (
                <Input
                  autoFocus
                  type="text"
                  value={mcq.question}
                  onChange={(e) =>
                    handleChange(e.target.value, mcqIndex, {
                      type: "question",
                      mcqIndex,
                    })
                  }
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="w-full font-semibold"
                />
              ) : (
                <p
                  className="font-semibold cursor-pointer"
                  onDoubleClick={() =>
                    setEditing({ type: "question", mcqIndex })
                  }
                >
                  {mcq.isMath ? parseMathString(mcq.question) : mcq.question}
                </p>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(mcqIndex)}
                className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Type and Math Controls */}
            <div className="mt-2 flex items-center gap-2">
              <Badge>{mcq.type}</Badge>

              <Select
                value={mcq.type}
                onValueChange={(type) =>
                  handleTypeChange(mcqIndex, type as QuestionType)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MCQ_TYPE).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={mcq.isMath ? "true" : "false"}
                onValueChange={(value) =>
                  handleIsMathChange(mcqIndex, value === "true")
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Math Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Math Enabled</SelectItem>
                  <SelectItem value="false">Math Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* Statements */}
          {mcq.statements && mcq.statements.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Statements</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddStatement(mcqIndex)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                {mcq.statements.map((statement, statementIndex) => (
                  <div key={statementIndex} className="flex items-center gap-2">
                    {editing?.type === "statement" &&
                    editing.mcqIndex === mcqIndex &&
                    editing.statementIndex === statementIndex ? (
                      <Input
                        autoFocus
                        type="text"
                        value={statement}
                        onChange={(e) =>
                          handleChange(e.target.value, mcqIndex, {
                            type: "statement",
                            mcqIndex,
                            statementIndex,
                          })
                        }
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="flex-1 text-sm"
                      />
                    ) : (
                      <p
                        className="flex-1 text-sm cursor-pointer"
                        onDoubleClick={() =>
                          setEditing({
                            type: "statement",
                            mcqIndex,
                            statementIndex,
                          })
                        }
                      >
                        {mcq.isMath ? parseMathString(statement) : statement}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteStatement(mcqIndex, statementIndex)
                      }
                      className="text-rose-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Separator className="bg-gray-600" />
            </>
          )}

          {/* Add Statement Button (if no statements exist) */}
          {(!mcq.statements || mcq.statements.length === 0) && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddStatement(mcqIndex)}
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Statement
              </Button>
              <Separator className="bg-gray-600" />
            </>
          )}

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Options</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleAddOption(mcqIndex)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            {mcq.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                {editing?.type === "option" &&
                editing.mcqIndex === mcqIndex &&
                editing.optionIndex === optionIndex ? (
                  <Input
                    autoFocus
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleChange(e.target.value, mcqIndex, {
                        type: "option",
                        mcqIndex,
                        optionIndex,
                      })
                    }
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="flex-1 text-sm"
                  />
                ) : (
                  <p
                    className="flex-1 text-sm cursor-pointer"
                    onDoubleClick={() =>
                      setEditing({
                        type: "option",
                        mcqIndex,
                        optionIndex,
                      })
                    }
                  >
                    {mcq.isMath ? parseMathString(option) : option}
                  </p>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteOption(mcqIndex, optionIndex)}
                  className="text-rose-500 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator className="bg-gray-600" />

          {/* Answer */}
          <div>
            <span className="text-sm text-muted-foreground font-medium">
              Answer
            </span>
            {editing?.type === "answer" && editing.mcqIndex === mcqIndex ? (
              <Input
                autoFocus
                type="text"
                value={mcq.answer}
                onChange={(e) =>
                  handleChange(e.target.value, mcqIndex, {
                    type: "answer",
                    mcqIndex,
                  })
                }
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="mt-1 font-semibold"
              />
            ) : (
              <p
                className="mt-1 text-muted-foreground font-semibold cursor-pointer"
                onDoubleClick={() => setEditing({ type: "answer", mcqIndex })}
              >
                {mcq.isMath ? parseMathString(mcq.answer) : mcq.answer}
              </p>
            )}
          </div>

          {/* Explanation */}
          {mcq.explanation && (
            <>
              <Separator className="bg-gray-600" />
              <div>
                <span className="text-xs text-muted-foreground font-medium">
                  Explanation
                </span>
                <p className="mt-1 text-xs text-muted-foreground italic">
                  {mcq.isMath
                    ? parseMathString(mcq.explanation)
                    : mcq.explanation}
                </p>
              </div>
            </>
          )}

          <Separator className="bg-gray-600" />

          {/* Reference Array */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                References
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleAddReference(mcqIndex)}
              >
                <PlusCircle className="h-3 w-3" />
              </Button>
            </div>
            {mcq.reference && mcq.reference.length > 0 ? (
              mcq.reference.map((ref, referenceIndex) => (
                <div key={referenceIndex} className="flex items-center gap-2">
                  {editing?.type === "reference" &&
                  editing.mcqIndex === mcqIndex &&
                  editing.referenceIndex === referenceIndex ? (
                    <Input
                      autoFocus
                      type="text"
                      value={ref}
                      onChange={(e) =>
                        handleChange(e.target.value, mcqIndex, {
                          type: "reference",
                          mcqIndex,
                          referenceIndex,
                        })
                      }
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      className="flex-1 text-xs"
                    />
                  ) : (
                    <p
                      className="flex-1 text-xs text-muted-foreground cursor-pointer"
                      onDoubleClick={() =>
                        setEditing({
                          type: "reference",
                          mcqIndex,
                          referenceIndex,
                        })
                      }
                    >
                      {ref}
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDeleteReference(mcqIndex, referenceIndex)
                    }
                    className="text-rose-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No references</p>
            )}
          </div>

          <Separator className="bg-gray-600" />

          {/* Context */}
          <div>
            <span className="text-xs text-muted-foreground font-medium">
              Context
            </span>
            {editing?.type === "context" && editing.mcqIndex === mcqIndex ? (
              <Input
                autoFocus
                type="text"
                value={mcq.context || ""}
                onChange={(e) =>
                  handleChange(e.target.value, mcqIndex, {
                    type: "context",
                    mcqIndex,
                  })
                }
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="mt-1 text-xs"
              />
            ) : (
              <p
                className="mt-1 text-xs text-muted-foreground cursor-pointer"
                onDoubleClick={() => setEditing({ type: "context", mcqIndex })}
              >
                {mcq.isMath && mcq.context
                  ? parseMathString(mcq.context)
                  : mcq.context || "—"}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Save Button */}
      {mcqs.length > 0 && (
        <Button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="max-w-fit"
        >
          <Save className="h-4 w-4 mr-2" />
          {isPending
            ? "Saving..."
            : `Save ${mcqs.length} MCQ${mcqs.length > 1 ? "s" : ""}`}
        </Button>
      )}

      {/* Empty State */}
      {mcqs.length === 0 && jsonInput.trim() === "" && (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-gray-600 rounded-md">
          <p>No MCQs loaded. Paste JSON above to import MCQs.</p>
        </div>
      )}
    </div>
  );
};
