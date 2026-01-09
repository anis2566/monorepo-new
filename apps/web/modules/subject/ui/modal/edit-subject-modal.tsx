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

import { useEditSubject } from "@/hooks/use-subject";
import { SubjectSchema, SubjectSchemaType } from "@workspace/schema";
import { Button } from "@workspace/ui/components/button";
import { FormSelect } from "@workspace/ui/shared/form-select";

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

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name,
        level,
      });
    }
  }, [isOpen, name, form, level]);

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

  const handleSubmit = (data: SubjectSchemaType) => {
    updateSubject({
      ...data,
      id: subjectId,
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
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>
            Make changes to your subject details. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormSelect
              name="level"
              label="Level"
              placeholder="Select level"
              options={LEVEL_OPTIONS}
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
                  Update subject
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
