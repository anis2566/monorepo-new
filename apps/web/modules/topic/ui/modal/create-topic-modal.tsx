"use client";

import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sparkles, Send, Loader2, ListOrdered, Layers3 } from "lucide-react";
import { useState } from "react";

import { useTRPC } from "@/trpc/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { TopicSchema, TopicSchemaType } from "@workspace/schema";

import { useCreateTopic } from "@/hooks/use-topic";

const DEFAULT_VALUES: TopicSchemaType = {
  name: "",
  position: "",
  subjectId: "",
  chapterId: "",
};

export const CreateTopicModal = () => {
  const [subjectId, setSubjectId] = useState<string>("");

  const { isOpen, onClose } = useCreateTopic();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const results = useQueries({
    queries: [
      trpc.admin.subject.forSelect.queryOptions({ search: "" }),
      trpc.admin.chapter.getBySubject.queryOptions({ subjectId }),
    ],
  });

  const SUBJECT_OPTIONS =
    results[0].data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const CHAPTER_OPTIONS =
    results[1].data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const form = useForm<TopicSchemaType>({
    resolver: zodResolver(TopicSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const nameValue = form.watch("name");
  const subjectValue = form.watch("subjectId");
  const positionValue = form.watch("position");

  const { mutate: createTopic, isPending } = useMutation(
    trpc.admin.topic.createOne.mutationOptions({
      onError: (err) => {
        console.log(err.message);
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }

        toast.success(data.message);

        await queryClient.invalidateQueries({
          queryKey: trpc.admin.topic.getMany.queryKey(),
        });
        form.reset(DEFAULT_VALUES);

        setTimeout(() => {
          onClose();
        }, 500);
      },
    }),
  );

  const onSubmit = async (values: TopicSchemaType) => {
    createTopic(values);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden border-border/50 shadow-lg">
        {/* Gradient Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent p-6 pb-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <DialogHeader className="relative z-10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <Layers3 className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-white/80 animate-pulse" />
                <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                  New Topic
                </span>
              </div>
            </div>

            <DialogTitle className="text-xl font-bold text-white">
              Create Your Topic
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              Set up a new topic with name, subject, chapter and position.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Content */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-5 animate-fade-in"
          >
            {/* Subject Select Field */}
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    Subject
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSubjectId(value);
                        }}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <SelectTrigger
                          className={`
                            h-12 bg-secondary/50 border-border/50
                            focus:bg-background focus:border-primary/50
                            transition-all duration-200 w-full
                            ${fieldState.error ? "border-destructive focus:border-destructive" : ""}
                          `}
                        >
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {subjectValue && !fieldState.error && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                          <div className="w-2 h-2 bg-success rounded-full animate-scale-in" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage className="text-xs animate-slide-up" />
                  )}
                </FormItem>
              )}
            />

            {/* Chapter Select Field */}
            <FormField
              control={form.control}
              name="chapterId"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    Chapter
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <SelectTrigger
                          className={`
                            h-12 bg-secondary/50 border-border/50
                            focus:bg-background focus:border-primary/50
                            transition-all duration-200 w-full
                            ${fieldState.error ? "border-destructive focus:border-destructive" : ""}
                          `}
                        >
                          <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {CHAPTER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {subjectValue && !fieldState.error && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                          <div className="w-2 h-2 bg-success rounded-full animate-scale-in" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage className="text-xs animate-slide-up" />
                  )}
                </FormItem>
              )}
            />

            {/* Chapter Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    Name
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Introduction to Algebra"
                        {...field}
                        className={`
                          h-12 pl-4 pr-4 bg-secondary/50 border-border/50
                          focus:bg-background focus:border-primary/50
                          transition-all duration-200
                          ${fieldState.error ? "border-destructive focus:border-destructive" : ""}
                        `}
                        disabled={isPending}
                      />
                      {nameValue && !fieldState.error && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <div className="w-2 h-2 bg-success rounded-full animate-scale-in" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage className="text-xs animate-slide-up" />
                  )}
                </FormItem>
              )}
            />

            {/* Position Field */}
            <FormField
              control={form.control}
              name="position"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ListOrdered className="h-4 w-4 text-muted-foreground" />
                    Position
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="e.g., 1"
                        {...field}
                        className={`
                          h-12 pl-4 pr-4 bg-secondary/50 border-border/50
                          focus:bg-background focus:border-primary/50
                          transition-all duration-200
                          ${fieldState.error ? "border-destructive focus:border-destructive" : ""}
                        `}
                        disabled={isPending}
                        min={0}
                      />
                      {positionValue && !fieldState.error && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <div className="w-2 h-2 bg-success rounded-full animate-scale-in" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage className="text-xs animate-slide-up" />
                  )}
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Create Chapter</span>
                    <Send className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-center text-muted-foreground">
              You can edit topic details anytime after creation.
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
