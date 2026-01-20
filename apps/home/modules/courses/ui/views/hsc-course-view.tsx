"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  BookOpen,
  Brain,
  Clock,
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
  CheckCircle2,
  Star,
  Atom,
  TestTube,
} from "lucide-react";
import { monthsToDuration } from "@workspace/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

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

const syllabus = [
  {
    subject: "পদার্থবিজ্ঞান",
    icon: Atom,
    color: "bg-orange-500",
    chapters: [
      { name: "ভেক্টর", topics: "স্কেলার ও ভেক্টর রাশি, যোগ-বিয়োগ, গুণন" },
      {
        name: "গতিবিদ্যা",
        topics: "সরল রৈখিক গতি, প্রাসঙ্গিক গতি, আপেক্ষিক বেগ",
      },
      { name: "নিউটনের গতিসূত্র", topics: "বল, ভরবেগ, সংরক্ষণ সূত্র" },
      {
        name: "কাজ, শক্তি ও ক্ষমতা",
        topics: "গতিশক্তি, বিভবশক্তি, শক্তির রূপান্তর",
      },
      { name: "মহাকর্ষ", topics: "নিউটনের মহাকর্ষ সূত্র, কেপলারের সূত্র" },
      { name: "তাপগতিবিদ্যা", topics: "তাপ, তাপমাত্রা, তাপগতিবিদ্যার সূত্র" },
      {
        name: "তরঙ্গ ও শব্দ",
        topics: "তরঙ্গের বৈশিষ্ট্য, শব্দের বেগ, ডপলার ক্রিয়া",
      },
      { name: "আলোকবিজ্ঞান", topics: "প্রতিফলন, প্রতিসরণ, লেন্স, আয়না" },
    ],
  },
  {
    subject: "রসায়ন",
    icon: TestTube,
    color: "bg-blue-500",
    chapters: [
      { name: "পরমাণুর গঠন", topics: "ইলেকট্রন বিন্যাস, কোয়ান্টাম সংখ্যা" },
      { name: "রাসায়নিক বন্ধন", topics: "আয়নিক, সমযোজী, ধাতব বন্ধন" },
      { name: "রাসায়নিক বিক্রিয়া", topics: "সাম্যাবস্থা, বিক্রিয়ার হার" },
      {
        name: "জারণ-বিজারণ",
        topics: "ইলেকট্রোকেমিস্ট্রি, তড়িৎ রাসায়নিক কোষ",
      },
      { name: "জৈব রসায়ন", topics: "হাইড্রোকার্বন, অ্যালকোহল, অ্যালডিহাইড" },
      { name: "অজৈব রসায়ন", topics: "পর্যায় সারণি, ধাতু ও অধাতু" },
      { name: "পরিবেশ রসায়ন", topics: "দূষণ, গ্রিনহাউস গ্যাস" },
    ],
  },
  {
    subject: "জীববিজ্ঞান",
    icon: Microscope,
    color: "bg-green-500",
    chapters: [
      { name: "কোষ বিভাজন", topics: "মাইটোসিস, মিয়োসিস, কোষ চক্র" },
      {
        name: "জেনেটিক্স",
        topics: "মেন্ডেলের সূত্র, DNA, RNA, প্রোটিন সংশ্লেষ",
      },
      { name: "মানব শারীরবিদ্যা", topics: "পরিপাক, শ্বসন, রক্ত সংবহন, রেচন" },
      { name: "উদ্ভিদ শারীরবিদ্যা", topics: "সালোকসংশ্লেষণ, শ্বসন, পরিবহন" },
      {
        name: "প্রাণী বৈচিত্র্য",
        topics: "শ্রেণিবিন্যাস, অমেরুদণ্ডী, মেরুদণ্ডী",
      },
      {
        name: "উদ্ভিদ বৈচিত্র্য",
        topics: "শৈবাল, ছত্রাক, ব্রায়োফাইটা, টেরিডোফাইটা",
      },
      {
        name: "বাস্তুবিদ্যা",
        topics: "ইকোসিস্টেম, খাদ্য শৃঙ্খল, জীববৈচিত্র্য",
      },
      { name: "বিবর্তন", topics: "ডারউইনের তত্ত্ব, প্রাকৃতিক নির্বাচন" },
    ],
  },
];

const schedule = [
  {
    day: "শনিবার",
    time: "৯:০০ - ১১:৩০ AM",
    subject: "পদার্থবিজ্ঞান",
    type: "লাইভ ক্লাস",
  },
  {
    day: "রবিবার",
    time: "৯:০০ - ১১:৩০ AM",
    subject: "রসায়ন",
    type: "লাইভ ক্লাস",
  },
  {
    day: "সোমবার",
    time: "৫:০০ - ৭:৩০ PM",
    subject: "জীববিজ্ঞান ১ম পত্র",
    type: "লাইভ ক্লাস",
  },
  {
    day: "মঙ্গলবার",
    time: "৫:০০ - ৭:৩০ PM",
    subject: "জীববিজ্ঞান ২য় পত্র",
    type: "লাইভ ক্লাস",
  },
  {
    day: "বুধবার",
    time: "৬:০০ - ৮:০০ PM",
    subject: "MCQ Practice",
    type: "সন্দেহ নিরসন",
  },
  {
    day: "বৃহস্পতিবার",
    time: "৯:০০ - ১১:০০ AM",
    subject: "সকল বিষয়",
    type: "সাপ্তাহিক পরীক্ষা",
  },
  {
    day: "শুক্রবার",
    time: "১০:০০ AM - ১২:০০ PM",
    subject: "CQ Practice",
    type: "প্র্যাকটিস সেশন",
  },
];

const batches = [
  { id: "morning", name: "মর্নিং ব্যাচ (৯:০০ AM - ১২:০০ PM)", seats: 30 },
  { id: "evening", name: "ইভনিং ব্যাচ (৫:০০ PM - ৮:০০ PM)", seats: 35 },
  { id: "weekend", name: "উইকেন্ড ব্যাচ (শুক্র-শনি)", seats: 25 },
];

export const HscCourseView = ({ courseId }: HscCourseViewProps) => {
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.home.program.getOneProgram.queryOptions({ id: courseId }),
  );

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
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <a href="#syllabus" className="flex items-center gap-2">
                  সিলেবাস দেখুন
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
      <section className="py-12 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
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
                className="border-primary/20 hover:border-primary/40 transition-colors"
              >
                <CardContent className="pt-6">
                  <topic.icon className="h-8 w-8 text-primary mb-3" />
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

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="syllabus" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="syllabus">সিলেবাস</TabsTrigger>
              <TabsTrigger value="schedule">সময়সূচী</TabsTrigger>
              <TabsTrigger value="pricing">মূল্য</TabsTrigger>
            </TabsList>

            {/* Syllabus Tab */}
            <TabsContent value="syllabus" id="syllabus">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    বিস্তারিত সিলেবাস - বিজ্ঞান বিভাগ
                  </h2>
                  <p className="text-muted-foreground">
                    NCTB সিলেবাস + Medical Admission এর জন্য অতিরিক্ত প্রস্তুতি
                  </p>
                </div>

                <div className="space-y-6">
                  {syllabus.map((subject, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className={`${subject.color} text-white`}>
                        <div className="flex items-center gap-3">
                          <subject.icon className="h-8 w-8" />
                          <div>
                            <CardTitle className="text-xl">
                              {subject.subject}
                            </CardTitle>
                            <p className="text-white/80 text-sm">
                              {subject.chapters.length} টি অধ্যায়
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {subject.chapters.map((chapter, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <h4 className="font-medium text-foreground text-sm mb-1">
                                {chapter.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {chapter.topics}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">
                          বিশেষ সুবিধা
                        </h3>
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
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    সাপ্তাহিক সময়সূচী
                  </h2>
                  <p className="text-muted-foreground">
                    ইভনিং ব্যাচের নমুনা সময়সূচী
                  </p>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-4 font-semibold">দিন</th>
                            <th className="text-left p-4 font-semibold">
                              সময়
                            </th>
                            <th className="text-left p-4 font-semibold">
                              বিষয়
                            </th>
                            <th className="text-left p-4 font-semibold">ধরন</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b last:border-0 hover:bg-muted/30"
                            >
                              <td className="p-4 font-medium">{item.day}</td>
                              <td className="p-4 text-muted-foreground">
                                {item.time}
                              </td>
                              <td className="p-4">{item.subject}</td>
                              <td className="p-4">
                                <Badge
                                  variant={
                                    item.type === "সাপ্তাহিক পরীক্ষা"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {item.type}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                  {batches.map((batch) => (
                    <Card key={batch.id} className="text-center">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">
                          {batch.name.split("(")[0]}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {batch.name.match(/\(([^)]+)\)/)?.[1]}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-300"
                        >
                          {batch.seats} সিট বাকি
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    কোর্স প্যাকেজ
                  </h2>
                  <p className="text-muted-foreground">
                    আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* HSC Only */}
                  <Card className="overflow-hidden border-2 border-border">
                    <CardHeader className="bg-muted text-center">
                      <CardTitle className="text-xl">HSC Academic</CardTitle>
                      <p className="text-muted-foreground">
                        শুধু বোর্ড পরীক্ষার প্রস্তুতি
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-3xl font-bold text-foreground">
                            ৳ ১০,০০০
                          </span>
                          <span className="text-lg text-muted-foreground line-through">
                            ৳ ১২,০০০
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          প্রতি বছর
                        </p>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {[
                          "২০০+ লাইভ ক্লাস",
                          "সাপ্তাহিক পরীক্ষা",
                          "PDF নোটস",
                          "CQ Practice",
                          "রেকর্ডেড ক্লাস",
                          "সন্দেহ নিরসন সেশন",
                        ].map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button className="w-full" variant="outline" size="lg">
                        <a href="#enrollment">এই প্যাকেজ নিন</a>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* HSC + Medical */}
                  <Card className="overflow-hidden border-2 border-primary relative">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary">সেরা মূল্য</Badge>
                    </div>
                    <CardHeader className="bg-primary text-primary-foreground text-center">
                      <CardTitle className="text-xl">
                        HSC + Medical Combo
                      </CardTitle>
                      <p className="text-primary-foreground/80">
                        বোর্ড + ভর্তি পরীক্ষা একসাথে
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-3xl font-bold text-foreground">
                            ৳ ১৫,০০০
                          </span>
                          <span className="text-lg text-muted-foreground line-through">
                            ৳ ২০,০০০
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-primary">
                          ২৫% ছাড়
                        </Badge>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {[
                          "৩০০+ লাইভ ক্লাস",
                          "সাপ্তাহিক পরীক্ষা + মক টেস্ট",
                          "PDF নোটস + Question Bank",
                          "CQ + MCQ Practice",
                          "Medical Admission Focus",
                          "রেকর্ডেড ক্লাস",
                          "২৪/৭ সন্দেহ নিরসন",
                          "মাসিক প্রগ্রেস রিপোর্ট",
                          "Admission পর্যন্ত সার্ভিস",
                        ].map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        <a href="#enrollment">এই প্যাকেজ নিন</a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  * সকল প্যাকেজে কিস্তিতে পেমেন্টের সুবিধা আছে
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};
