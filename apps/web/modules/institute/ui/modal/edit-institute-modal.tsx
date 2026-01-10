"use client";

import { useEffect } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { FormInput } from "@workspace/ui/shared/form-input";
import { FormTextArea } from "@workspace/ui/shared/form-text-area";

import { useEditInstitute } from "@/hooks/use-institute";
import { InstituteSchema, InstituteSchemaType } from "@workspace/schema";
import { Button } from "@workspace/ui/components/button";

export const EditInstituteModal = () => {
  const { isOpen, onClose, instituteId, name } = useEditInstitute();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<InstituteSchemaType>({
    resolver: zodResolver(InstituteSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name,
      });
    }
  }, [isOpen, name, form]);

  const { mutate: updateInstitute, isPending } = useMutation(
    trpc.admin.institute.updateOne.mutationOptions({
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
          queryKey: trpc.admin.institute.getMany.queryKey(),
        });

        setTimeout(() => {
          onClose();
        }, 500);
      },
    })
  );

  const handleSubmit = (data: InstituteSchemaType) => {
    updateInstitute({
      ...data,
      instituteId,
    });
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
          <DialogTitle>Edit Institute</DialogTitle>
          <DialogDescription>
            Make changes to your institute details. Click save when you are
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormInput name="name" label="Name" type="text" />

            <FormTextArea name="description" label="Description" />

            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 flex-1"
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <span className="flex items-center gap-2">
                  Update institute
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
