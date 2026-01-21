"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import {
  BookOpen,
  Brain,
  FileText,
  GraduationCap,
  LucideIcon,
  Stethoscope,
  Target,
  Users,
  Activity,
  Video,
  Microscope,
  FlaskConical,
  Zap,
  Phone,
  Star,
  CheckCircle2,
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

interface HscCourseViewProps {
  courseId: string;
}

const features = [
  {
    icon: Video,
    title: "৫+ লাইভ ক্লাস/সপ্তাহ",
    description: "বিজ্ঞান বিষয়ে নিবিড় ক্লাস",
  },
  {
    icon: FileText,
    title: "MCQ + CQ Practice",
    description: "বোর্ড ও মেডিকেল প্যাটার্নে",
  },
  {
    icon: Activity,
    title: "Progress Tracking",
    description: "বিস্তারিত পারফরম্যান্স রিপোর্ট",
  },
  {
    icon: Brain,
    title: "Medical Focus",
    description: "ভর্তি পরীক্ষার প্রস্তুতি একসাথে",
  },
];

const medicalTopics = [
  {
    title: "Biology Mastery",
    desc: "Medical এ ৫০% মার্কস Biology থেকে",
    icon: Microscope,
  },
  {
    title: "Chemistry Excellence",
    desc: "Organic ও Inorganic Chemistry Focus",
    icon: FlaskConical,
  },
  {
    title: "Physics Precision",
    desc: "Medical Physics এর জন্য বিশেষ প্রস্তুতি",
    icon: Zap,
  },
  { title: "MCQ Strategy", desc: "নেগেটিভ মার্কিং এড়ানোর কৌশল", icon: Target },
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
  guardianName: z.string().min(1, "অভিভাবকের নাম আবশ্যক").max(100),
  phone: z.string().min(11, "সঠিক ফোন নম্বর দিন").max(15),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  currentClass: z.string().min(1, "বর্তমান শ্রেণী নির্বাচন করুন"),
  college: z.string().min(1, "কলেজের নাম আবশ্যক").max(150),
  sscResult: z.string().min(1, "SSC ফলাফল আবশ্যক"),
  batch: z.string().min(1, "ব্যাচ নির্বাচন করুন"),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export const HscCourseView = ({ courseId }: HscCourseViewProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.home.course.getOneCourse.queryOptions({ id: courseId }),
  );

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentName: "",
      guardianName: "",
      phone: "",
      email: "",
      currentClass: "",
      college: "",
      sscResult: "",
      batch: "",
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
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-700 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white/20 text-white border-0 mb-6 px-4 py-1 rounded-full flex items-center justify-center w-full max-w-fit mx-auto">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span className="text-sm">{data?.tagline}</span>
            </div>
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
                <Users className="h-5 w-5" />
                <span>বিজ্ঞান শাখা</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Stethoscope className="h-5 w-5" />
                <span>Medical Focus</span>
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

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon as LucideIcon;
              return (
                <Card key={index} className="text-center border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-blue-600" />
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

      {/* Medical Focus Section */}
      <section className="py-12 bg-gradient-to-r from-red-700/5 to-red-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-red-500/10 text-red-600 border-red-500/30">
              <Stethoscope className="h-4 w-4 mr-2" />
              Medical Admission Ready
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              HSC পড়তে পড়তেই Medical প্রস্তুতি
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {medicalTopics.map((topic, index) => (
              <Card
                key={index}
                className="border-red-500/20 hover:border-red-500/40 transition-colors"
              >
                <CardContent className="pt-6">
                  <topic.icon className="h-8 w-8 text-red-600 mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{topic.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Benefits */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">বিশেষ সুবিধা</h3>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  HSC বোর্ড প্রশ্ন বিশ্লেষণ
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  Medical MCQ Practice
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  CQ লেখার কৌশল
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  Chapter-wise Test
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  রেকর্ডেড ক্লাস অ্যাক্সেস
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  PDF নোটস ও শীট
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
              <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/30">
                ভর্তি ফর্ম
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                HSC Academic-এ ভর্তি হন
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
                        name="guardianName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>অভিভাবকের নাম *</FormLabel>
                            <FormControl>
                              <Input placeholder="অভিভাবকের নাম" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="currentClass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>বর্তমান শ্রেণী *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="10">
                                  দশম শ্রেণী (SSC পরীক্ষার্থী)
                                </SelectItem>
                                <SelectItem value="11">একাদশ শ্রেণী</SelectItem>
                                <SelectItem value="12">
                                  দ্বাদশ শ্রেণী
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sscResult"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SSC ফলাফল/প্রত্যাশিত *</FormLabel>
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
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>কলেজের নাম *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="বর্তমান/ভর্তি হতে চান এমন কলেজ"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
                  HSC এবং Medical একসাথে প্রস্তুতি কীভাবে সম্ভব?
                </AccordionTrigger>
                <AccordionContent>
                  আমাদের সিলেবাস এমনভাবে সাজানো যে HSC পড়তে পড়তেই Medical এর
                  সিলেবাস কভার হয়ে যায়। বিশেষ করে Biology, Chemistry, Physics
                  - এই তিনটি বিষয়ে গভীরভাবে পড়ানো হয় যা Medical Admission এ
                  সরাসরি কাজে লাগে।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  SSC পাস করার আগেই কি ভর্তি হতে পারব?
                </AccordionTrigger>
                <AccordionContent>
                  হ্যাঁ, দশম শ্রেণীতে পড়ার সময়ই ভর্তি হতে পারবেন। SSC পরীক্ষার
                  পর থেকে মূল ক্লাস শুরু হবে। তবে SSC এর আগে থেকেই Foundation
                  Building শুরু করতে পারবেন।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  কোন কলেজে পড়লে এই কোর্সে ভর্তি হতে পারব?
                </AccordionTrigger>
                <AccordionContent>
                  যেকোনো কলেজে বিজ্ঞান বিভাগে পড়লে এই কোর্সে ভর্তি হতে পারবেন।
                  আমাদের অনলাইন ক্লাস সব জায়গা থেকে অ্যাক্সেস করা যায়।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Medical না হলে কি কোর্সের টাকা ফেরত পাব?
                </AccordionTrigger>
                <AccordionContent>
                  আমরা ১০০% সাফল্যের গ্যারান্টি দিতে পারি না, তবে আমাদের ৯৫%+
                  শিক্ষার্থী Medical বা Dental এ চান্স পায়। কোর্স ফি ফেরত পলিসি
                  নেই, তবে পরের বছর বিনামূল্যে রিপিট করার সুযোগ আছে।
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            HSC থেকে Medical - সম্পূর্ণ যাত্রায় আমরা আছি
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            বিজ্ঞান বিষয়ে দক্ষতা অর্জন করুন এবং স্বপ্নের Medical College-এ
            চান্স পান
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
