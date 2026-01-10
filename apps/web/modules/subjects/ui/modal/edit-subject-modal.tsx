"use client";

import { useEffect } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Sparkles, BookOpen, Loader2, Save } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

import { useEditSubject } from "@/hooks/use-subject";
import { SubjectSchema, SubjectSchemaType } from "@workspace/schema";
import { LEVEL } from "@workspace/utils/constant";

const LEVEL_OPTIONS = Object.values(LEVEL).map((level) => ({
  label: level,
  value: level,
}));

export const EditSubjectModal = () => {
  const { isOpen, onClose, subjectId, name, level } = useEditSubject();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<SubjectSchemaType>({
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      name: "",
      level: "",
    },
  });

  const {
    formState: { isDirty },
  } = form;

  // Populate form when data changes
  useEffect(() => {
    if (isOpen && name && level) {
      form.reset({
        name,
        level,
      });
    }
  }, [isOpen, name, level, form]);

  const { mutate: updateSubject, isPending } = useMutation(
    trpc.admin.subject.updateOne.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
        console.log(err);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        toast.success(data.message);

        await queryClient.invalidateQueries({
          queryKey: trpc.admin.subject.getMany.queryKey(),
        });

        setTimeout(() => {
          onClose();
        }, 500);
      },
    })
  );

  const onSubmit = async (values: SubjectSchemaType) => {
    if (!subjectId) return;

    updateSubject({
      ...values,
      id: subjectId,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)] p-0 gap-0 overflow-hidden border-border/50 shadow-lg">
        {/* Gradient Header - Using primary theme colors */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent px-6 py-8 text-white">
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 opacity-20">
            <Sparkles className="h-16 w-16" />
          </div>
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

          <DialogHeader className="relative z-10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Pencil className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Edit Subject
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Update your subject information
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form Content */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-5"
          >
            {/* Education Level Field */}
            <FormField
              control={form.control}
              name="level"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      Level
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger
                        className={`h-11 transition-all duration-200 w-full ${
                          fieldState.error
                            ? "border-destructive focus-visible:ring-destructive"
                            : "focus-visible:ring-primary/30"
                        }`}
                      >
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEVEL_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage className="text-xs animate-fade-in" />
                  )}
                </FormItem>
              )}
            />

            {/* Subject Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "50ms" }}
                >
                  <FormLabel className="text-sm font-medium">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter subject name"
                      {...field}
                      className={`h-11 transition-all duration-200 ${
                        fieldState.error
                          ? "border-destructive focus-visible:ring-destructive"
                          : "focus-visible:ring-primary/30"
                      }`}
                      disabled={isPending}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage className="text-xs animate-fade-in" />
                  )}
                </FormItem>
              )}
            />

            {/* Change Indicator */}
            {isDirty && (
              <div className="flex items-center gap-2 text-xs text-primary animate-fade-in">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                You have unsaved changes
              </div>
            )}

            {/* Submit Button */}
            <div
              className="pt-2 animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              <Button
                type="submit"
                disabled={isPending || !isDirty}
                className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving changes...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
