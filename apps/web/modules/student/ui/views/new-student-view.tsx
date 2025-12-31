"use client";

import { useState } from "react";
import * as z from "zod";
import {
  User,
  GraduationCap,
  Phone,
  MapPin,
  Home,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Users,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { cn } from "@workspace/ui/lib/utils";
import { genders, religions } from "@workspace/utils/constant";
import { nationalities } from "@workspace/utils";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StudentSchema, StudentSchemaType } from "@workspace/schema";
import { useRouter } from "next/navigation";

type StudentFormData = z.infer<typeof StudentSchema>;

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic details about the student",
    icon: User,
    fields: [
      "session",
      "studentId",
      "name",
      "nameBangla",
      "fName",
      "mName",
      "gender",
      "dob",
      "nationality",
      "religion",
    ] as (keyof StudentFormData)[],
  },
  {
    id: 2,
    title: "Academic Details",
    description: "Educational information",
    icon: GraduationCap,
    fields: [
      "instituteId",
      "classNameId",
      "section",
      "shift",
      "group",
      "roll",
    ] as (keyof StudentFormData)[],
  },
  {
    id: 3,
    title: "Contact Information",
    description: "Phone numbers for parents",
    icon: Phone,
    fields: ["fPhone", "mPhone"] as (keyof StudentFormData)[],
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
    ] as (keyof StudentFormData)[],
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
    ] as (keyof StudentFormData)[],
  },
];

export default function StudentRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const queries = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.institute.forSelect.queryOptions({ search: "" }),
      trpc.admin.batch.forSelect.queryOptions({ search: "" }),
    ],
  });

  const classOptions =
    queries[0].data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const instituteOptions =
    queries[1].data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const batchOptions =
    queries[2].data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const { mutate: createStudent, isPending } = useMutation(
    trpc.admin.student.createOne.mutationOptions({
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
          queryKey: trpc.admin.student.getMany.queryKey(),
        });
        router.push("/student");
      },
    })
  );

  const form = useForm<StudentSchemaType>({
    resolver: zodResolver(StudentSchema),
    mode: "onChange",
    defaultValues: {
      studentId: "",
      name: "",
      nameBangla: "",
      fName: "",
      mName: "",
      dob: "",
      gender: "Male",
      religion: "Islam",
      nationality: "Bangladeshi",
      instituteId: "",
      classNameId: "",
      section: "",
      shift: "",
      group: "",
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
      batchId: "",
    },
  });

  const nextStep = async () => {
    const currentStepFields = steps[currentStep]?.fields;
    if (!currentStepFields) return;

    const isValid = await form.trigger(currentStepFields);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: StudentFormData) => {
    createStudent(data);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen pb-12 px-4 sm:px-6 lg:px-8">
      <div className="">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            Student Registration
          </h1>
          <p className="text-lg text-slate-600">
            Complete all steps to register a new student
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-top duration-700 delay-100">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.id} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
                        isCompleted &&
                          "bg-emerald-500 shadow-lg shadow-emerald-200",
                        isCurrent &&
                          "bg-indigo-600 shadow-lg shadow-indigo-200 scale-110",
                        !isCompleted && !isCurrent && "bg-slate-200"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <Icon
                          className={cn(
                            "w-6 h-6",
                            isCurrent ? "text-white" : "text-slate-400"
                          )}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2 font-medium hidden sm:block text-center",
                        isCurrent ? "text-indigo-600" : "text-slate-500"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-6 left-1/2 w-full h-0.5 -z-0 transition-all duration-300",
                        isCompleted ? "bg-emerald-500" : "bg-slate-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-0 overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2" />

          <CardHeader className="bg-white border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <StepIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl text-slate-900">
                  {currentStepData.title}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {currentStepData.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 bg-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Step 1: Personal Information */}
                {currentStep === 0 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Student ID{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="batchId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Batch
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-[22px] w-full">
                                  <SelectValue placeholder="Select batch" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {batchOptions.map((batch) => (
                                  <SelectItem
                                    key={batch.value}
                                    value={batch.value}
                                  >
                                    {batch.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Full Name (English){" "}
                            <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter full name"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nameBangla"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Full Name (বাংলা){" "}
                            <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="সম্পূর্ণ নাম লিখুন"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Father&apos;s Name{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter father's name"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Mother&apos;s Name{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter mother's name"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Gender <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-[22px] w-full">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {genders.map((gender) => (
                                  <SelectItem key={gender} value={gender}>
                                    {gender}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Date of Birth{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="date"
                                  className="h-11"
                                  {...field}
                                />
                                <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="religion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Religion <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-[22px] w-full">
                                  <SelectValue placeholder="Select religion" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {religions.map((religion) => (
                                  <SelectItem key={religion} value={religion}>
                                    {religion}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Nationality{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-[22px] w-full">
                                  <SelectValue placeholder="Select nationality" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {nationalities.map((nationality) => (
                                  <SelectItem
                                    key={nationality}
                                    value={nationality}
                                  >
                                    {nationality}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Academic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="instituteId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Institute <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-[22px] w-full">
                                  <SelectValue placeholder="Select institute" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {instituteOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="classNameId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Class <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-[22px] w-full">
                                  <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {classOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="section"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Section
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., A"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shift"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Shift
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-[22px] w-full">
                                  <SelectValue placeholder="Select shift" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Morning">Morning</SelectItem>
                                <SelectItem value="Day">Day</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="roll"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Roll <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter roll"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="group"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Group <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-[22px] w-full">
                                  <SelectValue placeholder="Select group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Science">Science</SelectItem>
                                <SelectItem value="Commerce">
                                  Commerce
                                </SelectItem>
                                <SelectItem value="Arts">Arts</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Father&apos;s Phone{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <Input
                                  type="tel"
                                  placeholder="01XXXXXXXXX"
                                  className="h-11 pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Mother&apos;s Phone{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <Input
                                  type="tel"
                                  placeholder="01XXXXXXXXX"
                                  className="h-11 pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <div className="flex gap-3">
                        <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">
                            Guardian Contact Information
                          </h4>
                          <p className="text-sm text-blue-700">
                            Please provide valid contact numbers for both
                            parents. These will be used for emergency
                            communications and important notifications.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Present Address */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <FormField
                      control={form.control}
                      name="presentHouseNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            House/Holding No{" "}
                            <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter house number"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="presentMoholla"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Moholla/Area{" "}
                            <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter moholla"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="presentPost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Post Office{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter post office"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="presentThana"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Thana/Upazila{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter thana"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Permanent Address */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <FormField
                      control={form.control}
                      name="permanentVillage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Village/Area{" "}
                            <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter village"
                              className="h-11"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="permanentPost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Post Office{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter post office"
                                className="h-11"
                                {...field}
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permanentThana"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">
                              Thana/Upazila{" "}
                              <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter thana"
                                className="h-11"
                                {...field}
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="permanentDistrict"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            District <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter district"
                              className="h-11"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                  <Button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0 || isPending}
                    variant="outline"
                    size="lg"
                    className="h-12 px-6"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>

                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      size="lg"
                      className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isPending}
                      size="lg"
                      className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Submit Registration
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 mt-8 text-sm">
          All fields marked with <span className="text-rose-500">*</span> are
          required
        </p>
      </div>
    </div>
  );
}
