"use client";

import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { FormInput } from "@workspace/ui/shared/form-input";
import { Button } from "@workspace/ui/components/button";
import { ExamSchema, ExamSchemaType } from "@workspace/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
} from "@workspace/ui/components/collapsible";
import { FormCalendar } from "@workspace/ui/shared/form-calendar";
import { useTRPC } from "@/trpc/react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FormMultiSelect } from "@workspace/ui/shared/form-multi-select";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormSwitch } from "@workspace/ui/shared/form-switch";
import { FormSelect } from "@workspace/ui/shared/form-select";
import { EXAM_TYPE } from "@workspace/utils/constant";

const EXAM_TYPES = Object.values(EXAM_TYPE).map((item) => ({
  label: item,
  value: item,
}));

interface EditExamFormProps {
  examId: string;
}

export const EditExamForm = ({ examId }: EditExamFormProps) => {
  const [enableCq, setEnableCq] = useState<boolean>(false);
  const [enableMcq, setEnableMcq] = useState<boolean>(false);
  const [classNameIds, setClassNameIds] = useState<string[]>([]);
  const [subjectIds, setSubjectIds] = useState<string[]>([]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: examData, isLoading: isLoadingExam } = useQuery(
    trpc.admin.exam.getOne.queryOptions(examId)
  );

  const form = useForm<ExamSchemaType>({
    resolver: zodResolver(ExamSchema),
    defaultValues: {
      title: "",
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
      subjectIds: [],
      batchIds: [],
      chapterIds: [],
      type: "",
    },
  });

  // Update form values when exam data is loaded
  useEffect(() => {
    if (examData) {
      const classIds =
        examData.classNames?.map((item) => item.className.id) || [];
      const batchIds = examData.batches?.map((item) => item.batch.id) || [];
      const subjectIds =
        examData.subjects?.map((item) => item.subject.id) || [];

      // Set class name IDs for batch fetching
      setClassNameIds(classIds);

      // Enable checkboxes if values exist
      if (examData.cq && examData.cq > 0) {
        setEnableCq(true);
      }
      if (examData.mcq && examData.mcq > 0) {
        setEnableMcq(true);
      }

      // Reset form with exam data
      form.reset({
        title: examData.title || "",
        duration: examData.duration ? examData.duration.toString() : "",
        cq: examData.cq ? examData.cq.toString() : "",
        mcq: examData.mcq ? examData.mcq.toString() : "",
        startDate: examData.startDate ? examData.startDate.toISOString() : "",
        endDate: examData.endDate ? examData.endDate.toISOString() : "",
        classNameIds: classIds,
        subjectIds: subjectIds,
        batchIds: batchIds,
        hasSuffle: examData?.hasSuffle,
        hasRandom: examData?.hasRandom,
        hasNegativeMark: examData?.hasNegativeMark,
        negativeMark: examData?.negativeMark?.toString() || "",
        chapterIds: examData?.chapters?.map((item) => item.chapter.id) || [],
        type: examData?.type || "",
      });
    }
  }, [examData, form]);

  const results = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.batch.getByClassNameIds.queryOptions(classNameIds),
      trpc.admin.subject.forSelect.queryOptions({ search: "" }),
      trpc.admin.chapter.getBySubjectIds.queryOptions(subjectIds),
    ],
  });

  const CLASS_OPTIONS =
    results[0]?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];

  const BATCH_OPTIONS =
    results[1]?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];

  const SUBJECT_OPTIONS =
    results[2]?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];

  const CHAPTER_OPTIONS =
    results[3]?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];

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
        router.push(`/exam`);
      },
    })
  );

  console.log(form.formState.errors);

  const onSubmit = (data: ExamSchemaType) => {
    updateExam({ id: examId, data });
  };

  // Watch classNameIds changes to update batch options
  const watchedClassNameIds = form.watch("classNameIds");
  useEffect(() => {
    if (watchedClassNameIds && watchedClassNameIds.length > 0) {
      setClassNameIds(watchedClassNameIds);
    }
  }, [watchedClassNameIds]);

  if (isLoadingExam) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Exam</CardTitle>
        <CardDescription>Update the exam details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormSelect
              name="type"
              label="Type"
              placeholder="Select type"
              options={EXAM_TYPES}
            />

            <FormInput
              name="title"
              label="Title"
              type="text"
              disabled={isPending}
            />

            <FormMultiSelect
              name="classNameIds"
              label="Class"
              placeholder="Select classes"
              options={CLASS_OPTIONS}
              disabled={isPending}
              onClick={(value) => {
                setClassNameIds(value);
              }}
            />

            <FormMultiSelect
              name="batchIds"
              label="Batch"
              placeholder="Select batches"
              options={BATCH_OPTIONS}
              disabled={isPending}
            />

            <FormMultiSelect
              name="subjectIds"
              label="Subject"
              placeholder="Select subjects"
              options={SUBJECT_OPTIONS}
              disabled={isPending}
              onClick={(value) => {
                setSubjectIds(value);
              }}
            />

            <FormMultiSelect
              name="chapterIds"
              label="Chapter"
              placeholder="Select chapters"
              options={CHAPTER_OPTIONS}
              disabled={isPending}
            />

            <FormInput
              name="duration"
              label="Duration"
              disabled={isPending}
              type="number"
            />

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

            <div className="space-y-2 p-4 border rounded-md">
              <Label>Marks Allocation</Label>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cq"
                    checked={enableCq}
                    onCheckedChange={(checked) => {
                      setEnableCq(checked === true);
                    }}
                    disabled={isPending}
                  />
                  <Label htmlFor="cq">CQ</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mcq"
                    checked={enableMcq}
                    onCheckedChange={(checked) => {
                      setEnableMcq(checked === true);
                    }}
                    disabled={isPending}
                  />
                  <Label htmlFor="mcq">MCQ</Label>
                </div>
              </div>
              <Collapsible open={enableCq}>
                <CollapsibleContent>
                  <FormInput
                    name="cq"
                    label="CQ"
                    disabled={isPending}
                    type="number"
                  />
                </CollapsibleContent>
              </Collapsible>
              <Collapsible open={enableMcq}>
                <CollapsibleContent>
                  <FormInput
                    name="mcq"
                    label="MCQ"
                    disabled={isPending}
                    type="number"
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="space-y-2 p-4 border rounded-md">
              <Label>Transparency</Label>
              <FormSwitch
                name="hasSuffle"
                label="Suffling"
                description="Turn on shuffle to suffle the questions"
                onCheckedChange={(checked) => {
                  console.log("Feature toggled:", checked);
                }}
              />

              <FormSwitch
                name="hasRandom"
                label="Randomizing"
                description="Turn on random to randomize the question options"
                onCheckedChange={(checked) => {
                  console.log("Feature toggled:", checked);
                }}
              />
            </div>

            <div className="space-y-2 p-4 border rounded-md">
              <Label>Negative Marking</Label>
              <FormSwitch
                name="hasNegativeMark"
                label="Negative Marking"
                description="Turn on negative marking to apply negative marking"
                onCheckedChange={(checked) => {
                  console.log("Feature toggled:", checked);
                }}
              />

              <Collapsible open={form.watch("hasNegativeMark")}>
                <CollapsibleContent>
                  <FormInput
                    name="negativeMark"
                    label="Negative Mark"
                    disabled={isPending}
                    type="text"
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <span className="flex items-center gap-2">
                  Update exam
                  <Send className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
