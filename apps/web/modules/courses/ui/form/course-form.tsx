"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Form, useForm, zodResolver } from "@workspace/ui/components/form";
import { CourseFormSchema, CourseFormSchemaType } from "@workspace/schema";
import { CourseBasicInfo } from "../components/course-basic-info";
import { CourseSchedule } from "../components/course-schedule";
import { CoursePricing } from "../components/course-pricing";
import { CourseFeatures } from "../components/course-features";
import { CourseAssociations } from "../components/course-association";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

const STEPS = [
  { id: 1, name: "Basic Info", description: "Course details" },
  { id: 2, name: "Schedule", description: "Dates & duration" },
  { id: 3, name: "Pricing", description: "Course pricing" },
  { id: 4, name: "Features", description: "Course features" },
  { id: 5, name: "Associations", description: "Classes & subjects" },
];

export default function CourseForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const router = useRouter();
  const trpc = useTRPC();

  const form = useForm<CourseFormSchemaType>({
    resolver: zodResolver(CourseFormSchema),
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
      price: "",
      originalPrice: "",
      discount: "",
      pricingLifeCycle: "MONTHLY",
      heroTitle: "",
      heroDescription: "",
      tagline: "",
      urgencyMessage: "",
      features: [],
      specialBenefits: [],
      classIds: [],
      subjectIds: [],
      subjectDetails: [],
    },
  });

  const { mutate: createCourse, isPending } = useMutation(
    trpc.admin.course.createOne.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error("Failed to create course. Please try again.");
          return;
        }
        toast.success("Course created successfully!");
        // await queryClient.invalidateQueries({
        //   queryKey: trpc.admin.program.getMany.queryKey(),
        // });
        router.push(`/courses`);
      },
    }),
  );

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof CourseFormSchemaType)[] = [];

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
        fieldsToValidate = ["price"];
        break;
      case 4:
        fieldsToValidate = ["features"];
        break;
      case 5:
        fieldsToValidate = ["classIds", "subjectIds"];
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

  const onSubmit = async (data: CourseFormSchemaType) => {
    // Only submit if we're on the last step
    if (currentStep !== STEPS.length) {
      return;
    }
    createCourse(data);
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background w-full max-w-5xl mx-auto py-6 px-4">
      {/* Progress Bar */}
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

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{STEPS[currentStep - 1]?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && <CourseBasicInfo />}
              {currentStep === 2 && <CourseSchedule form={form} />}
              {currentStep === 3 && <CoursePricing form={form} />}
              {currentStep === 4 && <CourseFeatures form={form} />}
              {currentStep === 5 && (
                <CourseAssociations isPending={isPending} />
              )}

              {/* Navigation Buttons */}
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
                        Create Course
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Step Preview (Mobile) */}
      <div className="sm:hidden mt-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
