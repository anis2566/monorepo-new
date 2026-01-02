"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { ClassNameSchema, ClassNameSchemaType } from "@workspace/schema";
import { useCreateClass } from "@/hooks/use-class";
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
import { FormTextArea } from "@workspace/ui/shared/form-text-area";
import { Button } from "@workspace/ui/components/button";

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

  const handleSubmit = (data: ClassNameSchemaType) => {
    createClass(data);
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
          <DialogTitle>Set up your class</DialogTitle>
          <DialogDescription>
            This information will be used to create your class.
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
                  Create class
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
