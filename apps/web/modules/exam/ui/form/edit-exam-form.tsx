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

interface EditExamFormProps {
  examId: string;
}

export const EditExamForm = ({ examId }: EditExamFormProps) => {
  const [enableCq, setEnableCq] = useState<boolean>(false);
  const [enableMcq, setEnableMcq] = useState<boolean>(false);
  const [classNameIds, setClassNameIds] = useState<string[]>([]);

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
      classNameIds: [],
      subjectIds: [],
      batchIds: [],
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
      });
    }
  }, [examData, form]);

  const results = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.batch.getByClassNameIds.queryOptions(classNameIds),
      trpc.admin.subject.forSelect.queryOptions({ search: "" }),
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
            <FormInput
              name="title"
              label="Title"
              type="text"
              disabled={isPending}
            />

            <FormCalendar
              name="startDate"
              label="Start Time"
              placeholder="Select date"
              disabled={isPending}
              withTime
              disablePast
            />

            <FormCalendar
              name="endDate"
              label="End Time"
              placeholder="Select date"
              disabled={isPending}
              withTime
              disablePast
            />

            <FormMultiSelect
              name="classNameIds"
              label="Classes"
              placeholder="Select classes"
              options={CLASS_OPTIONS}
              disabled={isPending}
            />

            <FormMultiSelect
              name="batchIds"
              label="Batches"
              placeholder="Select batches"
              options={BATCH_OPTIONS}
              disabled={isPending || BATCH_OPTIONS.length === 0}
            />

            <FormMultiSelect
              name="subjectIds"
              label="Subjects"
              placeholder="Select subjects"
              options={SUBJECT_OPTIONS}
              disabled={isPending}
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
                      if (!checked) {
                        form.setValue("cq", "");
                      }
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
                      if (!checked) {
                        form.setValue("mcq", "");
                      }
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

            <FormInput
              name="duration"
              label="Duration"
              disabled={isPending}
              type="number"
            />

            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
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
