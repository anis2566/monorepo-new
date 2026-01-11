"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send, Loader2, ArrowLeft, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  useQueries,
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Collapsible,
  CollapsibleContent,
} from "@workspace/ui/components/collapsible";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { ExamSchema, ExamSchemaType } from "@workspace/schema";
import { FormMultiSelect } from "@workspace/ui/shared/form-multi-select";
import { FormCalendar } from "@workspace/ui/shared/form-calendar";
import { FormSwitch } from "@workspace/ui/shared/form-switch";

import { EXAM_TYPE } from "@workspace/utils/constant";

const EXAM_TYPE_OPTIONS = Object.values(EXAM_TYPE).map((type) => ({
  label: type,
  value: type,
}));

interface EditExamViewProps {
  examId: string;
}

export const EditExamView = ({ examId }: EditExamViewProps) => {
  const [enableCq, setEnableCq] = useState(false);
  const [enableMcq, setEnableMcq] = useState(false);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch exam data
  const { data: examData, isLoading: isLoadingExam } = useSuspenseQuery(
    trpc.admin.exam.getOne.queryOptions(examId)
  );

  const results = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.batch.getByClassNameIds.queryOptions(selectedClassIds),
      trpc.admin.subject.forSelect.queryOptions({ search: "" }),
      trpc.admin.chapter.getBySubjectIds.queryOptions(selectedSubjectIds),
    ],
  });

  const form = useForm<ExamSchemaType>({
    resolver: zodResolver(ExamSchema),
    defaultValues: {
      title: "",
      type: "",
      duration: "",
      cq: "",
      mcq: "",
      startDate: "",
      endDate: "",
      hasSuffle: true,
      hasRandom: true,
      hasNegativeMark: false,
      negativeMark: "",
      classNameIds: [],
      batchIds: [],
      subjectIds: [],
      chapterIds: [],
    },
  });

  // Populate form when exam data is loaded
  // In EditExamView component, update the useEffect:
  useEffect(() => {
    if (examData?.success && examData.data) {
      const exam = examData.data;

      // Extract IDs from nested relations
      const classNameIds = exam.classNames?.map((cn) => cn.className.id) || [];
      const batchIds = exam.batches?.map((b) => b.batch.id) || [];
      const subjectIds = exam.subjects?.map((s) => s.subject.id) || [];
      const chapterIds = exam.chapters?.map((c) => c.chapter.id) || [];

      // Set selected IDs for dependent dropdowns
      setSelectedClassIds(classNameIds);
      setSelectedSubjectIds(subjectIds);

      // Set checkbox states
      if (exam.cq) {
        setEnableCq(true);
      }
      if (exam.mcq) {
        setEnableMcq(true);
      }

      form.reset({
        title: exam.title || "",
        type: exam.type || "",
        duration: exam.duration?.toString() || "",
        cq: exam.cq?.toString() || "",
        mcq: exam.mcq?.toString() || "",
        startDate: exam.startDate || "",
        endDate: exam.endDate || "",
        hasSuffle: exam.hasSuffle ?? true,
        hasRandom: exam.hasRandom ?? true,
        hasNegativeMark: exam.hasNegativeMark ?? false,
        negativeMark: exam.negativeMark?.toString() || "",
        classNameIds,
        batchIds,
        subjectIds,
        chapterIds,
      });
    }
  }, [examData, form]);

  const classOptions =
    results[0]?.data?.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const batchOptions =
    results[1]?.data?.map((b) => ({
      label: b.name,
      value: b.id,
    })) || [];

  const subjectOptions =
    results[2]?.data?.map((s) => ({
      label: s.name,
      value: s.id,
    })) || [];

  const chapterOptions =
    results[3]?.data?.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const hasNegativeMark = form.watch("hasNegativeMark");

  const { mutate: updateExam, isPending } = useMutation(
    trpc.admin.exam.updateOne.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.exam.getMany.queryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.exam.getOne.queryKey(examId),
        });
        router.push(`/exams`);
      },
    })
  );

  const onSubmit = async (data: ExamSchemaType) => {
    updateExam({ id: examId, data });
  };

  if (isLoadingExam) {
    return (
      <div className="p-4 sm:p-6">
        <Card className="shadow-card">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Loading exam data...
            </span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/exams")}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Edit Exam
          </h1>
          <p className="text-sm text-muted-foreground">
            Update exam details and settings
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
              <CardDescription>
                Configure the exam settings, schedule, and content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter exam title"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full py-5">
                            <SelectValue placeholder="Select exam type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EXAM_TYPE_OPTIONS.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 60"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Target Audience */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Target Audience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormMultiSelect
                    name="classNameIds"
                    label="Class"
                    placeholder="Select class"
                    options={classOptions}
                    disabled={isPending}
                    onClick={(value) => {
                      setSelectedClassIds(value);
                    }}
                  />

                  <FormMultiSelect
                    name="batchIds"
                    label="Batch"
                    placeholder="Select batch"
                    options={batchOptions}
                    disabled={isPending}
                  />

                  <FormMultiSelect
                    name="subjectIds"
                    label="Subject"
                    placeholder="Select subject"
                    options={subjectOptions}
                    disabled={isPending}
                    onClick={(value) => {
                      setSelectedSubjectIds(value);
                    }}
                  />

                  <FormMultiSelect
                    name="chapterIds"
                    label="Chapter"
                    placeholder="Select chapter"
                    options={chapterOptions}
                    disabled={isPending}
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormCalendar
                    name="startDate"
                    label="Start Time"
                    placeholder="Select date"
                    disabled={isPending}
                    withTime
                  />

                  <FormCalendar
                    name="endDate"
                    label="End Time"
                    placeholder="Select date"
                    disabled={isPending}
                    withTime
                  />
                </div>
              </div>

              {/* Marks Allocation */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Marks Allocation
                </h3>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="enableCq"
                      checked={enableCq}
                      onCheckedChange={(checked) =>
                        setEnableCq(checked === true)
                      }
                      disabled={isPending}
                    />
                    <FormLabel htmlFor="enableCq" className="cursor-pointer">
                      CQ (Written)
                    </FormLabel>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="enableMcq"
                      checked={enableMcq}
                      onCheckedChange={(checked) =>
                        setEnableMcq(checked === true)
                      }
                      disabled={isPending}
                    />
                    <FormLabel htmlFor="enableMcq" className="cursor-pointer">
                      MCQ
                    </FormLabel>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Collapsible open={enableCq}>
                    <CollapsibleContent>
                      <FormField
                        control={form.control}
                        name="cq"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CQ Total Marks</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 50"
                                disabled={isPending}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={enableMcq}>
                    <CollapsibleContent>
                      <FormField
                        control={form.control}
                        name="mcq"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>MCQ Total Marks</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 30"
                                disabled={isPending}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>

              {/* Exam Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Exam Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 bg-muted/30">
                    <h4 className="text-sm font-medium mb-4">Transparency</h4>
                    <div className="space-y-4">
                      <FormSwitch
                        name="hasSuffle"
                        label="Shuffle Options"
                        description="Randomize questions for each student"
                        disabled={isPending}
                      />
                      <FormSwitch
                        name="hasRandom"
                        label="Random Questions"
                        description="Randomize question options for each student"
                        disabled={isPending}
                      />
                    </div>
                  </Card>

                  <Card className="p-4 bg-muted/30">
                    <h4 className="text-sm font-medium mb-4">
                      Negative Marking
                    </h4>
                    <div className="space-y-4">
                      <FormSwitch
                        name="hasNegativeMark"
                        label="Enable Negative Marking"
                        description="Deduct marks for wrong answers"
                        disabled={isPending}
                      />
                      <Collapsible open={hasNegativeMark}>
                        <CollapsibleContent>
                          <FormField
                            control={form.control}
                            name="negativeMark"
                            render={({ field }) => (
                              <FormItem className="pt-2">
                                <FormLabel>Negative Mark Value</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.25"
                                    placeholder="e.g., 0.25"
                                    disabled={isPending}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/exams")}
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Update Exam
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};
