"use client";

import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { TeacherSchema, TeacherSchemaType } from "@workspace/schema";
import { FormInput } from "@workspace/ui/shared/form-input";
import { FormSelect } from "@workspace/ui/shared/form-select";

import { Label } from "@workspace/ui/components/label";
import { CloudinaryUpload } from "@/components/form-image-uploader";
import { useEffect } from "react";

const SUBJECT_OPTIONS = [
  "Physics",
  "Chemistry",
  "Higher Math",
  "Biology",
  "Bengla",
  "English",
  "ICT",
].map((subject) => ({
  label: subject,
  value: subject,
}));

interface EditTeacherFormProps {
  id: string;
}

export const EditTeacherForm = ({ id }: EditTeacherFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: teacher } = useSuspenseQuery(
    trpc.admin.teacher.getOne.queryOptions({ id }),
  );

  const form = useForm<TeacherSchemaType>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      name: "",
      institute: "",
      imageUrl: "",
      subject: "",
    },
  });

  useEffect(() => {
    if (teacher) {
      form.reset({
        name: teacher.name,
        institute: teacher.institute,
        imageUrl: teacher.imageUrl,
        subject: teacher.subject,
      });
    }
  }, [teacher, form]);

  const { mutate: createTeacher, isPending } = useMutation(
    trpc.admin.teacher.updateOne.mutationOptions({
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
          queryKey: trpc.admin.teacher.getMany.queryKey(),
        });
        router.push(`/teachers`);
      },
    }),
  );

  const onSubmit = async (data: TeacherSchemaType) => {
    createTeacher({
      teacherId: id,
      ...data,
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-[120vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Edit Teacher Details</CardTitle>
              <CardDescription>
                Customize the teacher settings, schedule, and content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormInput
                name="name"
                label="Name"
                placeholder="Enter name"
                disabled={isPending}
              />
              <FormInput
                name="institute"
                label="Institute"
                placeholder="Enter institute"
                disabled={isPending}
              />
              <FormSelect
                name="subject"
                label="Subject"
                placeholder="Select subject"
                options={SUBJECT_OPTIONS}
                disabled={isPending}
              />
              <div className="space-y-2">
                <Label>Teacher Image</Label>
                <CloudinaryUpload
                  value={form.watch("imageUrl")}
                  onChange={(url) => {
                    form.setValue("imageUrl", url, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  disabled={isPending}
                  folder="teachers"
                  width={200}
                  height={200}
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Update Teacher
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};
