"use client";

import { useEffect } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Sparkles, Users, Loader2, Save } from "lucide-react";

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

import { useEditBatch } from "@/hooks/use-batch";
import { BatchSchema, BatchSchemaType } from "@workspace/schema";

export const EditBatchModal = () => {
  const { isOpen, onClose, batchId, name, classNameId } = useEditBatch();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery(
    trpc.admin.class.forSelect.queryOptions({ search: "" })
  );

  const CLASS_OPTIONS =
    data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];

  const form = useForm<BatchSchemaType>({
    resolver: zodResolver(BatchSchema),
    defaultValues: {
      name: "",
      classNameId: "",
    },
  });

  const {
    formState: { isDirty },
  } = form;

  // Populate form when data changes
  useEffect(() => {
    if (isOpen && name && classNameId) {
      form.reset({
        name,
        classNameId,
      });
    }
  }, [isOpen, name, classNameId, form]);

  const { mutate: updateBatch, isPending } = useMutation(
    trpc.admin.batch.updateOne.mutationOptions({
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
          queryKey: trpc.admin.batch.getMany.queryKey(),
        });

        setTimeout(() => {
          onClose();
        }, 500);
      },
    })
  );

  const onSubmit = async (values: BatchSchemaType) => {
    if (!batchId) return;

    updateBatch({
      ...values,
      id: batchId,
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
                  Edit Batch
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Update your batch information
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
            {/* Class Field */}
            <FormField
              control={form.control}
              name="classNameId"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2 animate-fade-in">
                  <FormLabel className="text-sm font-medium">Class</FormLabel>
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
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASS_OPTIONS.map((option) => (
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

            {/* Batch Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: "50ms" }}
                >
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Batch Name
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Enter batch name"
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
