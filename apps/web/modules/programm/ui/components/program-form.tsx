"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { ProgramFormSchema, ProgramFormSchemaType } from "@workspace/schema";

import { ProgramBasicInfo } from "./program-basic-info";
import { ProgramSchedule } from "./program-schedule";
import { ProgramFeatures } from "./program-features";
import { ProgramAssociations } from "./program-associations";
import { ProgramPackages } from "./program-packages";
import { ProgramAdvanced } from "./program-advanced";

const STEPS = [
  { id: 1, name: "Basic Info", description: "Program details" },
  { id: 2, name: "Schedule", description: "Dates & duration" },
  { id: 3, name: "Features", description: "Program features" },
  { id: 4, name: "Associations", description: "Classes & subjects" },
  { id: 5, name: "Packages", description: "Pricing plans" },
];

export const ProgramForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const form = useForm<ProgramFormSchemaType>({
    resolver: zodResolver(ProgramFormSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      duration: "",
      totalClasses: "",
      isActive: true,
      isPopular: false,
      startDate: "",
      endDate: "",
      imageUrl: "",
      heroTitle: "",
      heroDescription: "",
      tagline: "",
      urgencyMessage: "",
      hasNegativeMarking: false,
      negativeMarks: "",
      examDuration: "",
      totalMarks: "",
      totalQuestions: "",
      features: [],
      classIds: [],
      batchIds: [],
      subjectIds: [],
      packages: [],
      syllabus: [],
      schedule: [],
      mockTestPlan: [],
      examStrategies: [],
      medicalTopics: [],
      specialBenefits: [],
      faqs: [],
      batchDetails: [],
    },
  });

  const { mutate: createProgram, isPending } = useMutation(
    trpc.admin.program.createOne.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error("Failed to create program. Please try again.");
          return;
        }
        toast.success("Program created successfully!");
        // await queryClient.invalidateQueries({
        //   queryKey: trpc.admin.program.getMany.queryKey(),
        // });
        router.push(`/programs`);
      },
    }),
  );

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof ProgramFormSchemaType)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "name",
          "type",
          "description",
          "duration",
          "totalClasses",
        ];
        break;
      case 2:
        fieldsToValidate = ["startDate"];
        break;
      case 3:
        fieldsToValidate = ["features"];
        break;
      case 4:
        fieldsToValidate = ["classIds", "subjectIds"];
        break;
      case 5:
        fieldsToValidate = ["packages"];
        break;
    }
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ProgramFormSchemaType) => {
    createProgram(data);
  };

  return (
    <div className="min-h-screen bg-background w-full max-w-5xl mx-auto py-6">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex-1 ${index !== STEPS.length - 1 ? "mr-2" : ""}`}
            >
              <div
                className={`h-2 rounded-full transition-all ${
                  step.id <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex-1 text-center ${
                step.id === currentStep ? "opacity-100" : "opacity-50"
              }`}
            >
              <div
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                  step.id < currentStep
                    ? "bg-primary text-primary-foreground"
                    : step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-semibold">{step.id}</span>
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium">{step.name}</p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{STEPS[currentStep - 1]?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && <ProgramBasicInfo form={form} />}
              {currentStep === 2 && <ProgramSchedule form={form} />}
              {currentStep === 3 && <ProgramFeatures form={form} />}
              {currentStep === 4 && <ProgramAssociations />}
              {currentStep === 5 && (
                <ProgramPackages form={form} isPending={isPending} />
              )}
              {currentStep === 6 && (
                <ProgramAdvanced form={form} isPending={isPending} />
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isPending}
                    className="w-full sm:w-auto gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
                <div className="flex-1" />
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isPending}
                    className="w-full sm:w-auto gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
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
                        Create Program
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};
