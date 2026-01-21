"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Headphones,
  LucideIcon,
  Phone,
  Star,
  Target,
  Users,
  Video,
} from "lucide-react";
import z from "zod";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
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
import { Badge } from "@workspace/ui/components/badge";
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

interface SscCourseViewProps {
  courseId: string;
}

const features = [
  {
    icon: Video,
    title: "লাইভ ক্লাস",
    description: "সপ্তাহে ৪টি ইন্টারঅ্যাক্টিভ লাইভ ক্লাস",
  },
  {
    icon: FileText,
    title: "সাপ্তাহিক পরীক্ষা",
    description: "প্রতি সপ্তাহে অ্যাসেসমেন্ট ও ফিডব্যাক",
  },
  {
    icon: Headphones,
    title: "২৪/৭ সাপোর্ট",
    description: "যেকোনো সময় প্রশ্ন করুন",
  },
  {
    icon: Award,
    title: "প্রগ্রেস রিপোর্ট",
    description: "অভিভাবকদের জন্য মাসিক রিপোর্ট",
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
  guardianName: z.string().min(1, "অভিভাবকের নাম আবশ্যক").max(100),
  phone: z.string().min(11, "সঠিক ফোন নম্বর দিন").max(15),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  currentClass: z.string().min(1, "বর্তমান শ্রেণী নির্বাচন করুন"),
  school: z.string().min(1, "স্কুলের নাম আবশ্যক").max(150),
  batch: z.string().min(1, "ব্যাচ নির্বাচন করুন"),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

export const SscCourseView = ({ courseId }: SscCourseViewProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.home.course.getOneCourse.queryOptions({ id: courseId }),
  );

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentName: "",
      guardianName: "",
      phone: "",
      email: "",
      currentClass: "",
      school: "",
      batch: "",
    },
  });

  const onSubmit = async (data: EnrollmentFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success("আবেদন সফলভাবে জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-600 to-green-700 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920')] bg-cover bg-center opacity-10" />
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
                <Clock className="h-5 w-5" />
                <span>{monthsToDuration(data?.duration ?? 0)} কোর্স</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Users className="h-5 w-5" />
                <span>ছোট ব্যাচ সাইজ</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Target className="h-5 w-5" />
                <span>১০০% ফোকাস</span>
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
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-green-600" />
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

      {/* Special Benefits*/}
      <Card className="mt-8 bg-green-50 dark:bg-green-950/20 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">বিশেষ সুবিধা</h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  রেকর্ডেড ক্লাস অ্যাক্সেস
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  PDF নোটস ও শীট
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  অনলাইন MCQ প্র্যাকটিস
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  মক টেস্ট সিরিজ
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
              <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/30">
                ভর্তি ফর্ম
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                SSC Foundation-এ ভর্তি হন
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
                                <SelectItem value="7">সপ্তম শ্রেণী</SelectItem>
                                <SelectItem value="8">অষ্টম শ্রেণী</SelectItem>
                                <SelectItem value="9">নবম শ্রেণী</SelectItem>
                              </SelectContent>
                            </Select>
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

                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>স্কুলের নাম *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="বর্তমান স্কুলের নাম লিখুন"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-green-700 hover:bg-green-800 text-white"
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
                <AccordionTrigger>কোর্সটি কাদের জন্য উপযোগী?</AccordionTrigger>
                <AccordionContent>
                  এই কোর্সটি ক্লাস ৭, ৮ ও ৯ এর শিক্ষার্থীদের জন্য যারা SSC
                  পরীক্ষায় ভালো ফলাফল করতে চায় এবং ভবিষ্যতে Medical বা
                  Engineering এ ভর্তি হতে চায়।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>ক্লাস মিস হলে কী হবে?</AccordionTrigger>
                <AccordionContent>
                  সকল লাইভ ক্লাসের রেকর্ডিং ২৪ ঘণ্টার মধ্যে আপলোড করা হয়। আপনি
                  যেকোনো সময় রেকর্ডেড ক্লাস দেখতে পারবেন।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>পেমেন্ট কীভাবে করব?</AccordionTrigger>
                <AccordionContent>
                  bKash, Nagad, Rocket এবং ব্যাংক ট্রান্সফারের মাধ্যমে পেমেন্ট
                  করতে পারবেন। ২ কিস্তিতে পেমেন্টের সুবিধাও আছে।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>কোর্স শেষে কী পাব?</AccordionTrigger>
                <AccordionContent>
                  কোর্স সম্পন্ন করলে সার্টিফিকেট পাবেন। এছাড়া HSC ব্যাচে
                  ভর্তিতে অগ্রাধিকার এবং বিশেষ ছাড় পাবেন।
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            আজই শুরু করুন আপনার সাফল্যের যাত্রা
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            SSC Foundation থেকে Medical পর্যন্ত - সম্পূর্ণ যাত্রায় Mr. Dr.
            আপনার সঙ্গী
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
