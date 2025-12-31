import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Plus, Check, Trash2, PenLine, Send } from "lucide-react";
import { MCQ_TYPE } from "@workspace/utils/constant";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseMathString } from "@/lib/katex";

interface Mcq {
  id: string;
  question: string;
  options: string[];
  statements: string[];
  answer: string;
  type: string;
  session: number;
  isMath: boolean;
  explanation: string | null;
  context: string | null;
  reference: string[] | null;
  source?: string | null;
}

interface MCQListProps {
  mcqs: Mcq[];
}

type EditingField =
  | { type: "question"; mcqId: string }
  | { type: "option"; mcqId: string; optionIndex: number }
  | { type: "statement"; mcqId: string; statementIndex: number }
  | { type: "reference"; mcqId: string; referenceIndex: number }
  | { type: "explanation"; mcqId: string }
  | { type: "context"; mcqId: string }
  | null;

const MCQ_TYPES = Object.values(MCQ_TYPE).map((type) => type);

const MCQCard = ({ mcq, index }: { mcq: Mcq; index: number }) => {
  const [editedMcq, setEditedMcq] = useState<Mcq>(mcq);
  const [hasChanges, setHasChanges] = useState(false);
  const [editing, setEditing] = useState<EditingField>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const trpc = useTRPC();

  const { mutate: updateMcq, isPending } = useMutation(
    trpc.admin.mcq.updateOne.mutationOptions({
      onSuccess: async (data) => {
        if (data.message) {
          toast.success(data.message);
          setHasChanges(false);
          setValidationErrors({});
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case "question":
        return !value || value.trim() === ""
          ? "Question cannot be empty"
          : null;
      case "answer":
        return !value || value.trim() === "" ? "Answer must be selected" : null;
      case "options":
        if (!Array.isArray(value) || value.length < 2) {
          return "At least 2 options are required";
        }
        if (value.some((opt) => !opt || opt.trim() === "")) {
          return "All options must have content";
        }
        return null;
      default:
        return null;
    }
  };

  const handleChange = (field: keyof Mcq, value: any) => {
    setEditedMcq((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);

    // Clear validation error for this field
    const error = validateField(field, value);
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...editedMcq.options];
    newOptions[idx] = value;
    handleChange("options", newOptions);
  };

  const handleStatementChange = (idx: number, value: string) => {
    const newStatements = [...editedMcq.statements];
    newStatements[idx] = value;
    handleChange("statements", newStatements);
  };

  const handleReferenceChange = (idx: number, value: string) => {
    const references = editedMcq.reference || [];
    const newReferences = [...references];
    newReferences[idx] = value;
    handleChange("reference", newReferences);
  };

  const addOption = () => {
    handleChange("options", [...editedMcq.options, ""]);
  };

  const removeOption = (idx: number) => {
    if (editedMcq.options.length <= 2) {
      toast.error("Must have at least 2 options");
      return;
    }
    const newOptions = editedMcq.options.filter((_, i) => i !== idx);
    handleChange("options", newOptions);
  };

  const addStatement = () => {
    handleChange("statements", [...editedMcq.statements, ""]);
  };

  const removeStatement = (idx: number) => {
    const newStatements = editedMcq.statements.filter((_, i) => i !== idx);
    handleChange("statements", newStatements);
  };

  const addReference = () => {
    const references = editedMcq.reference || [];
    handleChange("reference", [...references, ""]);
  };

  const removeReference = (idx: number) => {
    const references = editedMcq.reference || [];
    const newReferences = references.filter((_, i) => i !== idx);
    handleChange("reference", newReferences.length > 0 ? newReferences : null);
  };

  const handleBlur = () => setEditing(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setEditing(null);
    }
    if (e.key === "Escape") {
      setEditing(null);
    }
  };

  const handleSave = () => {
    // Validate all required fields
    const errors: Record<string, string> = {};

    const questionError = validateField("question", editedMcq.question);
    if (questionError) errors.question = questionError;

    const answerError = validateField("answer", editedMcq.answer);
    if (answerError) errors.answer = answerError;

    const optionsError = validateField("options", editedMcq.options);
    if (optionsError) errors.options = optionsError;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fix validation errors before saving");
      return;
    }

    updateMcq({
      id: mcq.id,
      data: {
        ...editedMcq,
        reference: editedMcq.reference || [],
      },
    });
  };

  const handleCancel = () => {
    setEditedMcq(mcq);
    setHasChanges(false);
    setValidationErrors({});
    setEditing(null);
  };

  const renderText = (text: string | null, isMath: boolean) => {
    if (!text) return "—";
    return isMath ? parseMathString(text) : text;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">
              Question #{index + 1}
            </span>

            <Select
              value={editedMcq.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MCQ_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge variant="secondary" className="text-xs">
              Session {mcq.session}
            </Badge>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`math-${mcq.id}`}
                checked={editedMcq.isMath}
                onCheckedChange={(checked) => handleChange("isMath", checked)}
              />
              <Label
                htmlFor={`math-${mcq.id}`}
                className="text-xs font-medium cursor-pointer"
              >
                Math Mode
              </Label>
            </div>
          </div>

          {hasChanges && (
            <Badge
              variant="outline"
              className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300"
            >
              Unsaved changes
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              Question
              {validationErrors.question && (
                <span className="text-xs text-red-500">
                  ({validationErrors.question})
                </span>
              )}
            </Label>
            <PenLine className="h-3 w-3 text-muted-foreground" />
          </div>
          {editing?.type === "question" && editing.mcqId === mcq.id ? (
            <Textarea
              autoFocus
              value={editedMcq.question}
              onChange={(e) => handleChange("question", e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Enter question text..."
              className={`min-h-[80px] ${
                validationErrors.question ? "border-red-500" : ""
              }`}
            />
          ) : (
            <div
              className={`p-3 rounded-md border cursor-pointer hover:bg-gray-50 transition-colors min-h-[80px] ${
                validationErrors.question
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
              onDoubleClick={() =>
                setEditing({ type: "question", mcqId: mcq.id })
              }
            >
              <p className="whitespace-pre-wrap">
                {renderText(editedMcq.question, editedMcq.isMath)}
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Double-click to edit</p>
        </div>

        {/* Statements */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Statements</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addStatement}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {editedMcq.statements.map((stmt, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-sm text-muted-foreground mt-2 w-6 shrink-0">
                  {idx + 1}.
                </span>
                {editing?.type === "statement" &&
                editing.mcqId === mcq.id &&
                editing.statementIndex === idx ? (
                  <Input
                    autoFocus
                    value={stmt}
                    onChange={(e) => handleStatementChange(idx, e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={`Statement ${idx + 1}`}
                    className="flex-1"
                  />
                ) : (
                  <div
                    className="flex-1 p-2 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onDoubleClick={() =>
                      setEditing({
                        type: "statement",
                        mcqId: mcq.id,
                        statementIndex: idx,
                      })
                    }
                  >
                    <p className="text-sm">
                      {renderText(stmt, editedMcq.isMath)}
                    </p>
                  </div>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeStatement(idx)}
                  className="h-10 w-10 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {editedMcq.statements.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No statements added
              </p>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              Options
              {validationErrors.options && (
                <span className="text-xs text-red-500">
                  ({validationErrors.options})
                </span>
              )}
            </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addOption}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {editedMcq.options.map((option, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="font-medium text-gray-700 w-6 shrink-0 mt-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {editing?.type === "option" &&
                editing.mcqId === mcq.id &&
                editing.optionIndex === idx ? (
                  <Input
                    autoFocus
                    value={option}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className={
                      option === editedMcq.answer
                        ? "border-green-500 bg-green-50 flex-1"
                        : "flex-1"
                    }
                  />
                ) : (
                  <div
                    className={`flex-1 p-2 rounded border cursor-pointer hover:bg-gray-50 transition-colors ${
                      option === editedMcq.answer
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onDoubleClick={() =>
                      setEditing({
                        type: "option",
                        mcqId: mcq.id,
                        optionIndex: idx,
                      })
                    }
                  >
                    <p className="text-sm">
                      {renderText(option, editedMcq.isMath)}
                    </p>
                  </div>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant={option === editedMcq.answer ? "default" : "outline"}
                  onClick={() => handleChange("answer", option)}
                  className="shrink-0 h-10"
                >
                  {option === editedMcq.answer ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Answer
                    </>
                  ) : (
                    "Set Answer"
                  )}
                </Button>
                {editedMcq.options.length > 2 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeOption(idx)}
                    className="h-10 w-10 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Answer Display */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Correct Answer
            {validationErrors.answer && (
              <span className="text-xs text-red-500">
                ({validationErrors.answer})
              </span>
            )}
          </Label>
          <div
            className={`p-3 rounded-md border ${
              validationErrors.answer
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <p
              className={`font-medium ${
                validationErrors.answer ? "text-red-700" : "text-green-700"
              }`}
            >
              {editedMcq.answer
                ? renderText(editedMcq.answer, editedMcq.isMath)
                : "No answer selected"}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Explanation (Optional)</Label>
            <PenLine className="h-3 w-3 text-muted-foreground" />
          </div>
          {editing?.type === "explanation" && editing.mcqId === mcq.id ? (
            <Textarea
              autoFocus
              value={editedMcq.explanation || ""}
              onChange={(e) =>
                handleChange("explanation", e.target.value || null)
              }
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Enter explanation (optional)..."
              className="min-h-[80px]"
            />
          ) : (
            <div
              className="p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors min-h-[80px]"
              onDoubleClick={() =>
                setEditing({ type: "explanation", mcqId: mcq.id })
              }
            >
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {renderText(editedMcq.explanation, editedMcq.isMath)}
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Double-click to edit</p>
        </div>

        {/* Context */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Context (Optional)</Label>
            <PenLine className="h-3 w-3 text-muted-foreground" />
          </div>
          {editing?.type === "context" && editing.mcqId === mcq.id ? (
            <Textarea
              autoFocus
              value={editedMcq.context || ""}
              onChange={(e) => handleChange("context", e.target.value || null)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Enter context (optional)..."
              className="min-h-[80px]"
            />
          ) : (
            <div
              className="p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors min-h-[80px]"
              onDoubleClick={() =>
                setEditing({ type: "context", mcqId: mcq.id })
              }
            >
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {renderText(editedMcq.context, editedMcq.isMath)}
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Double-click to edit</p>
        </div>

        {/* References */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>References</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addReference}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {editedMcq.reference && editedMcq.reference.length > 0 ? (
            <div className="space-y-2">
              {editedMcq.reference.map((ref, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-sm text-muted-foreground mt-2 w-6 shrink-0">
                    {idx + 1}.
                  </span>
                  {editing?.type === "reference" &&
                  editing.mcqId === mcq.id &&
                  editing.referenceIndex === idx ? (
                    <Input
                      autoFocus
                      value={ref}
                      onChange={(e) =>
                        handleReferenceChange(idx, e.target.value)
                      }
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder={`Reference ${idx + 1}`}
                      className="flex-1"
                    />
                  ) : (
                    <div
                      className="flex-1 p-2 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                      onDoubleClick={() =>
                        setEditing({
                          type: "reference",
                          mcqId: mcq.id,
                          referenceIndex: idx,
                        })
                      }
                    >
                      <p className="text-sm text-muted-foreground">{ref}</p>
                    </div>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeReference(idx)}
                    className="h-10 w-10 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No references added
            </p>
          )}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          {mcq.source && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Source</p>
              <p className="text-sm">{mcq.source}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground mb-1">ID</p>
            <p className="text-xs font-mono">{mcq.id}</p>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        {hasChanges && (
          <div className="flex gap-3 pt-4 border-t bg-yellow-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              variant="default"
              className="w-full md:w-fit"
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <span className="flex items-center gap-2">
                  Save Changes
                  <Send className="h-4 w-4" />
                </span>
              )}
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const MCQList = ({ mcqs }: MCQListProps) => {
  if (mcqs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No MCQs available
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">MCQ List ({mcqs.length})</h2>
        <Badge variant="secondary" className="text-sm">
          Double-click any field to edit
        </Badge>
      </div>

      {mcqs.map((mcq, index) => (
        <MCQCard key={mcq.id} mcq={mcq} index={index} />
      ))}
    </div>
  );
};
