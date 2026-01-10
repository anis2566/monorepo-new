"use client";

import { BookOpen, Sparkles, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

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
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";

import { ClassNameSchema, ClassNameSchemaType } from "@workspace/schema";
import { useCreateClass } from "@/hooks/use-class";

const DEFAULT_VALUES: ClassNameSchemaType = {
  name: "",
  description: "",
};

export const CreateClassModal = () => {
  const { isOpen, onClose } = useCreateClass();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<ClassNameSchemaType>({
    resolver: zodResolver(ClassNameSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const nameValue = form.watch("name");
  const descriptionValue = form.watch("description");

  const { mutate: createClass, isPending } = useMutation(
    trpc.admin.class.createOne.mutationOptions({
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
          queryKey: trpc.admin.class.getMany.queryKey(),
        });
        form.reset(DEFAULT_VALUES);

        setTimeout(() => {
          onClose();
        }, 500);
      },
    })
  );

  const onSubmit = async (values: ClassNameSchemaType) => {
    createClass(values);

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
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-white/80 animate-pulse" />
                <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                  New Class
                </span>
              </div>
            </div>

            <DialogTitle className="text-xl font-bold text-white">
              Create Your Class
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              Set up a new class with a name and optional description.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Content */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-5 animate-fade-in"
          >
            {/* Class Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    Class Name
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Mathematics 101"
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-success rounded-full animate-scale-in" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs animate-slide-up" />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    Description
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a brief description of your class..."
                      {...field}
                      rows={4}
                      className={`
                        resize-none bg-secondary/50 border-border/50
                        focus:bg-background focus:border-primary/50
                        transition-all duration-200
                        ${fieldState.error ? "border-destructive focus:border-destructive" : ""}
                      `}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage className="text-xs animate-slide-up" />
                    <span
                      className={`text-xs ${
                        descriptionValue && descriptionValue.length > 450
                          ? "text-warning"
                          : "text-muted-foreground"
                      }`}
                    >
                      {descriptionValue?.length}/450
                    </span>
                  </div>
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
                    <span>Create Class</span>
                    <Send className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-center text-muted-foreground">
              You can edit class details anytime after creation.
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
