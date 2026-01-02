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
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
} from "@workspace/ui/components/collapsible";
import { FormCalendar } from "@workspace/ui/shared/form-calendar";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { FormMultiSelect } from "@workspace/ui/shared/form-multi-select";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormSwitch } from "@workspace/ui/shared/form-switch";

export const NewExamForm = () => {
  const [enableCq, setEnableCq] = useState<boolean>(false);
  const [enableMcq, setEnableMcq] = useState<boolean>(false);
  const [classNameIds, setClassNameIds] = useState<string[]>([]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

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

  const { mutate: createExam, isPending } = useMutation(
    trpc.admin.exam.createOne.mutationOptions({
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
        // router.push(`/exam`);
      },
    })
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
    },
  });

  const onSubmit = (data: ExamSchemaType) => {
    createExam(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">New Exam</CardTitle>
        <CardDescription>Fill the form to create a new exam</CardDescription>
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
              onClick={(value) => {
                setClassNameIds(value);
              }}
            />

            <FormMultiSelect
              name="batchIds"
              label="Batches"
              placeholder="Select batches"
              options={BATCH_OPTIONS}
              disabled={isPending}
            />

            <FormMultiSelect
              name="subjectIds"
              label="Subjects"
              placeholder="Select subjects"
              options={SUBJECT_OPTIONS}
              disabled={isPending}
            />

            <FormInput
              name="duration"
              label="Duration"
              disabled={isPending}
              type="number"
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
              disabled={isPending || !form.formState.isValid}
              className="w-full md:w-auto h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <span className="flex items-center gap-2">
                  Create exam
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
