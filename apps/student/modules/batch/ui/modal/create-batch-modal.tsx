"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { BatchSchema, BatchSchemaType } from "@workspace/schema";
import { useTRPC } from "@/trpc/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { FormInput } from "@workspace/ui/shared/form-input";
import { Button } from "@workspace/ui/components/button";
import { FormSelect } from "@workspace/ui/shared/form-select";

import { useCreateBatch } from "@/hooks/use-batch";

const DEFAULT_VALUES: BatchSchemaType = {
  name: "",
  classNameId: "",
};

export const CreateBatchModal = () => {
  const { isOpen, onClose } = useCreateBatch();
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
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate: createBatch, isPending } = useMutation(
    trpc.admin.batch.createOne.mutationOptions({
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
          queryKey: trpc.admin.batch.getMany.queryKey(),
        });
        form.reset(DEFAULT_VALUES);

        setTimeout(() => {
          onClose();
        }, 500);
      },
    })
  );

  const handleSubmit = (data: BatchSchemaType) => {
    createBatch(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create batch</DialogTitle>
          <DialogDescription>
            This information will be used to create your batch.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormSelect
              name="classNameId"
              label="Class"
              placeholder="Select class"
              options={CLASS_OPTIONS}
            />

            <FormInput name="name" label="Name" type="text" />

            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 flex-1"
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <span className="flex items-center gap-2">
                  Create batch
                  <Send className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
