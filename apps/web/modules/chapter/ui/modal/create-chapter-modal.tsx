"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";

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
import { ChapterSchema, ChapterSchemaType } from "@workspace/schema";

import { useCreateChapter } from "@/hooks/use-chapter";

const DEFAULT_VALUES: ChapterSchemaType = {
  name: "",
  position: "",
  subjectId: "",
};

export const CreateChapterModal = () => {
  const { isOpen, onClose } = useCreateChapter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery(trpc.admin.subject.forSelect.queryOptions({ search: "" }))

  const SUBJECT_OPTIONS = data?.map((item) => ({
    value: item.id,
    label: item.name,
  })) || [];

  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(ChapterSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate: createChapter, isPending } = useMutation(
    trpc.admin.chapter.createOne.mutationOptions({
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
          queryKey: trpc.admin.chapter.getMany.queryKey(),
        });
        form.reset(DEFAULT_VALUES);

        setTimeout(() => {
          onClose();
        }, 500);
      },
    })
  );

  const handleSubmit = (data: ChapterSchemaType) => {
    createChapter(data);
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
          <DialogTitle>Set up your chapter</DialogTitle>
          <DialogDescription>
            This information will be used to create your chapter.
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
                  Create chapter
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
