"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Send,
  Loader2,
  ArrowLeft,
  Globe,
  Users,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useQueries, useQueryClient, useMutation } from "@tanstack/react-query";

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
import { PublicExamSchema, PublicExamSchemaType } from "@workspace/schema";
import { FormMultiSelect } from "@workspace/ui/shared/form-multi-select";
import { FormCalendar } from "@workspace/ui/shared/form-calendar";
import { FormSwitch } from "@workspace/ui/shared/form-switch";

import { EXAM_TYPE } from "@workspace/utils/constant";
import { Badge } from "@workspace/ui/components/badge";

const EXAM_TYPE_OPTIONS = Object.values(EXAM_TYPE).map((type) => ({
  label: type,
  value: type,
}));

export const NewPublicExamView = () => {
  const [enableCq, setEnableCq] = useState(false);
  const [enableMcq, setEnableMcq] = useState(false);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const results = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.subject.forSelect.queryOptions({ search: "" }),
      trpc.admin.chapter.getBySubjectIds.queryOptions(selectedSubjectIds),
    ],
  });

  const form = useForm<PublicExamSchemaType>({
    resolver: zodResolver(PublicExamSchema),
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
      subjectIds: [],
      chapterIds: [],
    },
  });

  const classOptions =
    results[0]?.data?.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const subjectOptions =
    results[1]?.data?.map((s) => ({
      label: s.name,
      value: s.id,
    })) || [];

  const chapterOptions =
    results[2]?.data?.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const hasNegativeMark = form.watch("hasNegativeMark");

  const { mutate: createExam, isPending } = useMutation(
    trpc.admin.publicExam.createOne.mutationOptions({
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
          queryKey: trpc.admin.publicExam.getMany.queryKey(),
        });
        router.push(`/exams`);
      },
    }),
  );

  const onSubmit = async (data: PublicExamSchemaType) => {
    createExam(data);
  };

  console.log(form.formState.errors);

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
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
              <Globe className="h-6 w-6 text-green-500" />
              Create Public Exam
            </h1>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            >
              <Users className="h-3 w-3 mr-1" />
              Open Access
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Create an exam that anyone can participate in without registration
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-800 dark:text-green-300">
                Public Exam Features
              </p>
              <ul className="mt-1 text-green-700 dark:text-green-400 space-y-0.5">
                <li>
                  • Participants only need to provide name, phone, college, and
                  class
                </li>
                <li>• No student account required to take the exam</li>
                <li>• Real-time leaderboard visible to all participants</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
              <CardDescription>
                Configure public exam settings, schedule, and content
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
                      <FormLabel>Title</FormLabel>
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
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}
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
                  Audience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormMultiSelect
                    name="classNameIds"
                    label="Class"
                    placeholder="Select class"
                    options={classOptions}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Create Exam
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
