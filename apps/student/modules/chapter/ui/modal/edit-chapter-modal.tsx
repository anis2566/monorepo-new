"use client";

import { useEffect } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

import { useEditChapter } from "@/hooks/use-chapter";
import { ChapterSchema, ChapterSchemaType } from "@workspace/schema";
import { Button } from "@workspace/ui/components/button";
import { FormSelect } from "@workspace/ui/shared/form-select";

export const EditChapterModal = () => {
  const { isOpen, onClose, chapterId, name, subjectId, position } = useEditChapter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery(trpc.admin.subject.forSelect.queryOptions({ search: "" }))

  const SUBJECT_OPTIONS = data?.map((item) => ({
    value: item.id,
    label: item.name,
  })) || [];

  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(ChapterSchema),
    defaultValues: {
      name: "",
      subjectId: "",
      position: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name,
        subjectId,
        position,
      });
    }
  }, [isOpen, name, subjectId, position, form]);

  const { mutate: updateChapter, isPending } = useMutation(
    trpc.admin.chapter.updateOne.mutationOptions({
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
          queryKey: trpc.admin.chapter.getMany.queryKey(),
        });

        setTimeout(() => {
          onClose();
        }, 500);
      },
    })
  );

  const handleSubmit = (data: ChapterSchemaType) => {
    updateChapter({
      ...data,
      id: chapterId,
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
            <FormSelect
              name="subjectId"
              label="Subject"
              placeholder="Select subject"
              options={SUBJECT_OPTIONS}
            />

            <FormInput name="name" label="Name" type="text" />

            <FormInput name="position" label="Position" type="number" />

            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 flex-1"
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <span className="flex items-center gap-2">
                  Update chapter
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
