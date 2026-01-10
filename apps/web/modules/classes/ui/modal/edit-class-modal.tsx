"use client";

import { useEffect } from "react";
import { Pencil, Sparkles, BookOpen, Loader2, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";

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
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";

import { useEditClass } from "@/hooks/use-class";
import { ClassNameSchema, ClassNameSchemaType } from "@workspace/schema";

const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

export const EditClassModal = () => {
  const { isOpen, onClose, classId, name, description } = useEditClass();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<ClassNameSchemaType>({
    resolver: zodResolver(ClassNameSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    watch,
    formState: { isDirty },
  } = form;
  const nameValue = watch("name") || "";
  const descriptionValue = watch("description") || "";

  const { mutate: updateClass, isPending } = useMutation(
    trpc.admin.class.updateOne.mutationOptions({
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
          queryKey: trpc.admin.class.getMany.queryKey(),
        });

        setTimeout(() => {
          onClose();
        }, 500);
      },
    })
  );

  // Populate form when classData changes
  useEffect(() => {
    if (classId) {
      form.reset({
        name: name,
        description: description || "",
      });
    }
  }, [classId, form, name, description]);

  const onSubmit = async (values: ClassNameSchemaType) => {
    if (!classId) return;

    updateClass({
      ...values,
      classId,
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
                  Edit Class
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Update your class information
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
            {/* Class Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem className="animate-fade-in">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      Class Name
                    </FormLabel>
                    <span
                      className={`text-xs ${nameValue.length > MAX_NAME_LENGTH ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {nameValue.length}/{MAX_NAME_LENGTH}
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Enter class name"
                      {...field}
                      className={`h-11 transition-all duration-200 ${
                        fieldState.error
                          ? "border-destructive focus-visible:ring-destructive"
                          : "focus-visible:ring-primary/30"
                      }`}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-xs animate-fade-in" />
                </FormItem>
              )}
            />

            {/* Description Input */}
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem
                  className="animate-fade-in"
                  style={{ animationDelay: "50ms" }}
                >
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium">
                      Description
                      <span className="text-muted-foreground ml-1">
                        (optional)
                      </span>
                    </FormLabel>
                    <span
                      className={`text-xs ${descriptionValue.length > MAX_DESCRIPTION_LENGTH ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {descriptionValue.length}/{MAX_DESCRIPTION_LENGTH}
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this class is about..."
                      {...field}
                      className={`min-h-[100px] resize-none transition-all duration-200 ${
                        fieldState.error
                          ? "border-destructive focus-visible:ring-destructive"
                          : "focus-visible:ring-primary/30"
                      }`}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-xs animate-fade-in" />
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
