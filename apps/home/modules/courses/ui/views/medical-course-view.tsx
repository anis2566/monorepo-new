"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import {
  BookOpen,
  Brain,
  LucideIcon,
  Target,
  Zap,
  Phone,
  CheckCircle2,
  Flame,
  Award,
  AlertTriangle,
  TrendingUp,
  Shield,
  Timer,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
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
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

import { monthsToDuration } from "@workspace/utils";

interface MedicalCourseViewProps {
  courseId: string;
}

const features = [
  {
    icon: Flame,
    title: "৪ মাসের Intensive",
    description: "প্রতিদিন ৩-৪ ঘণ্টা ক্লাস",
  },
  { icon: Target, title: "১০০+ Mock Test", description: "Real exam pattern এ" },
  { icon: Brain, title: "Smart Revision", description: "Priority based পড়া" },
  {
    icon: TrendingUp,
    title: "Performance Track",
    description: "Daily progress report",
  },
];

const strategies = [
  {
    title: "নেগেটিভ মার্কিং Strategy",
    desc: "কোন প্রশ্ন ছাড়বেন, কোনটা গেস করবেন - সঠিক সিদ্ধান্ত নেওয়ার কৌশল",
    icon: Shield,
  },
  {
    title: "Time Management",
    desc: "১০০ MCQ ৬০ মিনিটে - প্রতিটি প্রশ্নে কত সময় দেবেন",
    icon: Timer,
  },
  {
    title: "High Yield Topics",
    desc: "যে অধ্যায়গুলো থেকে বেশি প্রশ্ন আসে সেগুলোতে বেশি ফোকাস",
    icon: BarChart3,
  },
  {
    title: "Last Minute Revision",
    desc: "পরীক্ষার আগের রাতে কী পড়বেন, কী পড়বেন না",
    icon: Zap,
  },
];

const batches = [
  { id: "morning", name: "মর্নিং ব্যাচ (৯:০০ AM - ১২:০০ PM)", seats: 30 },
  { id: "evening", name: "ইভনিং ব্যাচ (৫:০০ PM - ৮:০০ PM)", seats: 35 },
  { id: "weekend", name: "উইকেন্ড ব্যাচ (শুক্র-শনি)", seats: 25 },
];

const enrollmentSchema = z.object({
  studentName: z
    .string()
    .min(1, "নাম আবশ্যক")
    .max(100, "নাম ১০০ অক্ষরের কম হতে হবে"),
  phone: z.string().min(11, "সঠিক ফোন নম্বর দিন").max(15),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  hscYear: z.string().min(1, "HSC বছর নির্বাচন করুন"),
  hscResult: z.string().min(1, "HSC ফলাফল আবশ্যক"),
  college: z.string().min(1, "কলেজের নাম আবশ্যক").max(150),
  batch: z.string().min(1, "ব্যাচ নির্বাচন করুন"),
  targetCollege: z.string().optional(),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export const MedicalCourseView = ({ courseId }: MedicalCourseViewProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.home.course.getOneCourse.queryOptions({ id: courseId }),
  );

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentName: "",
      phone: "",
      email: "",
      hscYear: "",
      hscResult: "",
      college: "",
      batch: "",
      targetCollege: "",
    },
  });

  const onSubmit = async (data: EnrollmentFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success("আবেদন সফলভাবে জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-red-600 to-red-700 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2 animate-pulse">
              <Flame className="h-4 w-4 mr-2" />
              {data?.tagline}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              {data?.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {data?.heroDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <BookOpen className="h-5 w-5" />
                <span>{monthsToDuration(data?.duration ?? 0)} কোর্স</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Target className="h-5 w-5" />
                <span>১০০+ Mock Test</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Award className="h-5 w-5" />
                <span>৯৫% সাফল্য</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="white"
                className="bg-white text-orange-500 gap-2"
              >
                <a href="#enrollment" className="flex items-center gap-2">
                  এখনই ভর্তি হন
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Banner */}
      {data?.urgencyMessage && (
        <section className="py-4 bg-yellow-500 text-yellow-950">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 text-center">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="font-medium text-sm md:text-base">
                ⚡ {data?.urgencyMessage}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon as LucideIcon;
              return (
                <Card key={index} className="text-center border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Exam Strategy Section */}
      <section className="py-12 bg-gradient-to-r from-red-500/5 to-orange-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-red-500/10 text-red-600 border-red-500/30">
              <Brain className="h-4 w-4 mr-2" />
              Exam Strategy
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              পরীক্ষার হলে জেতার কৌশল
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {strategies.map((strategy, index) => (
              <Card
                key={index}
                className="border-red-500/20 hover:border-red-500/40 transition-colors"
              >
                <CardContent className="pt-6">
                  <strategy.icon className="h-8 w-8 text-red-600 mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">
                    {strategy.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {strategy.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Negative Markings */}
      <Card className="mt-8 bg-red-50 dark:bg-red-950/20 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">
                নেগেটিভ মার্কিং সতর্কতা
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                প্রতিটি ভুল উত্তরে ০.২৫ মার্কস কাটা যাবে। তাই নিশ্চিত না হলে
                উত্তর না দেওয়াই ভালো।
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  সঠিক উত্তর: +১ মার্কস
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  ভুল উত্তর: -০.২৫ মার্কস
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Form */}
      <section id="enrollment" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-red-500/10 text-red-600 border-red-500/30">
                ভর্তি ফর্ম
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Medical Admission Course-এ ভর্তি হন
              </h2>
              <p className="text-muted-foreground">
                নিচের ফর্মটি পূরণ করুন, আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব
              </p>
            </div>

            <Card>
              <CardContent className="p-6 md:p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="studentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>শিক্ষার্থীর নাম *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="সম্পূর্ণ নাম লিখুন"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>মোবাইল নম্বর *</FormLabel>
                            <FormControl>
                              <Input placeholder="০১XXXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ইমেইল (ঐচ্ছিক)</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>কলেজের নাম *</FormLabel>
                            <FormControl>
                              <Input placeholder="HSC কলেজের নাম" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="hscYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>HSC পরীক্ষার বছর *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="বছর নির্বাচন করুন" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="2026">HSC 2026</SelectItem>
                                <SelectItem value="2025">
                                  HSC 2025 (পাস)
                                </SelectItem>
                                <SelectItem value="2024">
                                  HSC 2024 (পাস)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hscResult"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>HSC ফলাফল/প্রত্যাশিত *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="ফলাফল নির্বাচন করুন" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gpa5">GPA 5.00</SelectItem>
                                <SelectItem value="gpa4.5+">
                                  GPA 4.50+
                                </SelectItem>
                                <SelectItem value="gpa4+">GPA 4.00+</SelectItem>
                                <SelectItem value="appearing">
                                  পরীক্ষা দেব
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="batch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>পছন্দের ব্যাচ *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="ব্যাচ নির্বাচন করুন" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {batches.map((batch) => (
                                  <SelectItem key={batch.id} value={batch.id}>
                                    {batch.name}
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
                        name="targetCollege"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>টার্গেট Medical College</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="যেমন: ঢাকা মেডিকেল"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-700 hover:bg-red-800 text-white "
                      size="lg"
                      variant="ghost"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      ফর্ম জমা দেওয়ার পর আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ
                      করবে
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                সাধারণ প্রশ্নাবলী
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Medical Admission এ কত নম্বর পেলে চান্স হবে?
                </AccordionTrigger>
                <AccordionContent>
                  সাধারণত ৭০-৭৫+ নম্বর পেলে Government Medical College-এ চান্স
                  হয়। তবে এটি প্রতি বছর কাটঅফ মার্কস অনুযায়ী পরিবর্তন হয়।
                  Dental এ সাধারণত ৬৫+ এ চান্স হয়।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  নেগেটিভ মার্কিং কীভাবে কাজ করে?
                </AccordionTrigger>
                <AccordionContent>
                  প্রতিটি সঠিক উত্তরে +১ মার্কস এবং প্রতিটি ভুল উত্তরে -০.২৫
                  মার্কস কাটা হয়। তাই ৪টি ভুল = ১টি সঠিক উত্তরের সমান ক্ষতি।
                  নিশ্চিত না হলে উত্তর না দেওয়াই ভালো।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  HSC পরীক্ষার আগে কি ভর্তি হতে পারব?
                </AccordionTrigger>
                <AccordionContent>
                  হ্যাঁ, HSC পরীক্ষার্থীরাও ভর্তি হতে পারবেন। HSC পরীক্ষার পর
                  থেকে মূল Intensive ক্লাস শুরু হবে। তার আগে Foundation ক্লাস
                  চলবে।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Private Medical College-এর জন্যও কি এই কোর্স কাজে লাগবে?
                </AccordionTrigger>
                <AccordionContent>
                  হ্যাঁ, একই পরীক্ষার মাধ্যমে Government ও Private দুই ধরনের
                  Medical College-এ ভর্তি হওয়া যায়। আমাদের কোর্স উভয়ের জন্যই
                  প্রযোজ্য।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  Mock Test কি Real Exam এর মতো হবে?
                </AccordionTrigger>
                <AccordionContent>
                  হ্যাঁ, আমাদের Mock Test গুলো Real Medical Admission Exam এর
                  Pattern এ তৈরি করা হয়। ১০০ MCQ, ৬০ মিনিট সময়, নেগেটিভ
                  মার্কিং সহ - সবকিছু Real Exam এর মতোই।
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            স্বপ্নের Medical College তোমার জন্য অপেক্ষা করছে
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            সঠিক প্রস্তুতি, সঠিক গাইডেন্স - সাফল্য নিশ্চিত
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="white"
              className="bg-white text-orange-500 gap-2"
            >
              <a href="#enrollment" className="flex items-center gap-2">
                এখনই ভর্তি হন
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4 mr-2" />
              কল করুন
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
