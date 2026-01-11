"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  User,
  GraduationCap,
  Phone,
  MapPin,
  Home,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { StudentSchema, StudentSchemaType } from "@workspace/schema";
import { groups } from "@workspace/utils/constant";

import { FormStepIndicator } from "../components/form-step-indicator";
import { MobileStepIndicator } from "../components/mobile-step-indicator";
import { StudentFormFields } from "../components/student-form-fields";

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic details about the student",
    icon: User,
    fields: [
      "studentId",
      "name",
      "nameBangla",
      "fName",
      "mName",
      "gender",
      "dob",
      "nationality",
      "religion",
    ] as (keyof StudentSchemaType)[],
  },
  {
    id: 2,
    title: "Academic Details",
    description: "Educational information",
    icon: GraduationCap,
    fields: [
      "classNameId",
      "batchId",
      "instituteId",
      "section",
      "shift",
      "group",
      "roll",
    ] as (keyof StudentSchemaType)[],
  },
  {
    id: 3,
    title: "Contact Information",
    description: "Phone numbers for parents",
    icon: Phone,
    fields: ["fPhone", "mPhone"] as (keyof StudentSchemaType)[],
  },
  {
    id: 4,
    title: "Present Address",
    description: "Current residential address",
    icon: MapPin,
    fields: [
      "presentHouseNo",
      "presentMoholla",
      "presentPost",
      "presentThana",
    ] as (keyof StudentSchemaType)[],
  },
  {
    id: 5,
    title: "Permanent Address",
    description: "Permanent residential address",
    icon: Home,
    fields: [
      "permanentVillage",
      "permanentPost",
      "permanentThana",
      "permanentDistrict",
    ] as (keyof StudentSchemaType)[],
  },
];

export const NewStudentForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<StudentSchemaType>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      studentId: "",
      name: "",
      nameBangla: "",
      fName: "",
      mName: "",
      gender: "Male",
      dob: "",
      nationality: "Bangladeshi",
      religion: "Islam",
      instituteId: "",
      classNameId: "",
      batchId: "",
      section: "",
      shift: "",
      group: groups[1],
      roll: "",
      fPhone: "",
      mPhone: "",
      presentHouseNo: "",
      presentMoholla: "",
      presentPost: "",
      presentThana: "",
      permanentVillage: "",
      permanentPost: "",
      permanentThana: "",
      permanentDistrict: "",
    },
    mode: "onChange",
  });

  const currentStepConfig = steps.find((s) => s.id === currentStep)!;

  const validateCurrentStep = async () => {
    const fieldsToValidate = currentStepConfig.fields;
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { mutate: createStudent } = useMutation(
    trpc.admin.student.createOne.mutationOptions({
      onMutate: () => {
        setIsSubmitting(true);
      },
      onError: (err) => {
        toast.error(err.message);
        setIsSubmitting(false);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          setIsSubmitting(false);
          return;
        }
        setIsSubmitting(false);
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.admin.student.getMany.queryKey(),
        });
        router.push("/students");
      },
    })
  );

  const handleSubmit = async (data: StudentSchemaType) => {
    createStudent(data);
  };

  const handleCancel = () => {
    router.push("/students");
  };

  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Add New Student
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in the student details step by step
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Step Indicator */}
        <FormStepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Form Content */}
        <div className="flex-1 min-w-0">
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              {/* Mobile Step Indicator */}
              <MobileStepIndicator
                steps={steps}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />

              {/* Desktop current step title */}
              <div className="hidden lg:block">
                <CardTitle className="flex items-center gap-3 text-lg">
                  {(() => {
                    const Icon = currentStepConfig.icon;
                    return (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                    );
                  })()}
                  <div>
                    <p className="font-semibold">{currentStepConfig.title}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {currentStepConfig.description}
                    </p>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  {/* Form Fields */}
                  <div className="min-h-[300px] sm:min-h-[280px]">
                    <StudentFormFields
                      form={form}
                      stepId={currentStep}
                      isSubmitting={isSubmitting}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="w-full sm:w-auto"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePrevious();
                        }}
                        disabled={isFirstStep || isSubmitting}
                        className="flex-1 sm:flex-none"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>

                      {isLastStep ? (
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 sm:flex-none min-w-[140px]"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Update
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNext();
                          }}
                          disabled={isSubmitting}
                          className="flex-1 sm:flex-none"
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
