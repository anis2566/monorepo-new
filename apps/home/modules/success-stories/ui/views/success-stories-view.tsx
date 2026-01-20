"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  GraduationCap,
  Star,
  Play,
  Quote,
  TrendingUp,
  Users,
  Award,
  Stethoscope,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

const successStories = [
  {
    id: 1,
    name: "ফাতিমা আক্তার",
    nameEn: "Fatima Akter",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    college: "ঢাকা মেডিকেল কলেজ",
    collegeEn: "Dhaka Medical College",
    meritPosition: 123,
    score: 82.5,
    year: 2025,
    batch: "HSC 2024",
    hometown: "কুমিল্লা",
    previousCollege: "কুমিল্লা ভিক্টোরিয়া কলেজ",
    hscGpa: 5.0,
    journey:
      "আমি ক্লাস ১১ থেকেই Mr. Dr. এর সাথে ছিলাম। HSC পড়ার পাশাপাশি Medical এর প্রস্তুতি নিয়েছি। শিক্ষকরা প্রতিটি বিষয় এত সুন্দরভাবে বুঝিয়েছেন যে আমার কোনো কোচিং এর প্রয়োজন পড়েনি।",
    tip: "প্রতিদিন নিয়মিত পড়া এবং Mock Test দেওয়া সবচেয়ে জরুরি।",
    videoId: "dQw4w9WgXcQ",
    hasVideo: true,
    featured: true,
  },
  {
    id: 2,
    name: "রফিকুল ইসলাম",
    nameEn: "Rafiqul Islam",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    college: "চট্টগ্রাম মেডিকেল কলেজ",
    collegeEn: "Chittagong Medical College",
    meritPosition: 456,
    score: 78.25,
    year: 2025,
    batch: "HSC 2024",
    hometown: "চট্টগ্রাম",
    previousCollege: "চট্টগ্রাম কলেজ",
    hscGpa: 5.0,
    journey:
      "Biology তে আমার দুর্বলতা ছিল। Mr. Dr. এর Biology ক্লাসগুলো আমাকে সবচেয়ে বেশি সাহায্য করেছে। Mock Test এর মাধ্যমে আমি নিজের দুর্বলতা চিনতে পেরেছি।",
    tip: "Biology তে ৫০ মার্কস, তাই Biology তে বেশি ফোকাস করুন।",
    videoId: "dQw4w9WgXcQ",
    hasVideo: true,
    featured: true,
  },
  {
    id: 3,
    name: "নুসরাত জাহান",
    nameEn: "Nusrat Jahan",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    college: "সলিমুল্লাহ মেডিকেল কলেজ",
    collegeEn: "Sir Salimullah Medical College",
    meritPosition: 234,
    score: 80.0,
    year: 2025,
    batch: "HSC 2024",
    hometown: "ঢাকা",
    previousCollege: "ভিকারুননিসা নূন স্কুল এন্ড কলেজ",
    hscGpa: 5.0,
    journey:
      "আমি শুধু Crash Course করেছিলাম। মাত্র ৪ মাসে Mr. Dr. আমাকে পুরো সিলেবাস শেষ করতে এবং ভালো স্কোর করতে সাহায্য করেছে।",
    tip: "নেগেটিভ মার্কিং এড়াতে নিশ্চিত না হলে উত্তর দেবেন না।",
    videoId: "dQw4w9WgXcQ",
    hasVideo: false,
    featured: false,
  },
  {
    id: 4,
    name: "আহমেদ হাসান",
    nameEn: "Ahmed Hasan",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    college: "রাজশাহী মেডিকেল কলেজ",
    collegeEn: "Rajshahi Medical College",
    meritPosition: 567,
    score: 76.5,
    year: 2025,
    batch: "HSC 2024",
    hometown: "রাজশাহী",
    previousCollege: "রাজশাহী কলেজ",
    hscGpa: 4.92,
    journey:
      "গ্রাম থেকে এসে Medical এ চান্স পাওয়া আমার জন্য স্বপ্ন ছিল। Mr. Dr. এর অনলাইন ক্লাসগুলো আমাকে ঢাকায় না এসেও ভালো প্রস্তুতি নিতে সাহায্য করেছে।",
    tip: "অনলাইন ক্লাসের সুবিধা নিন, কোথায় থাকেন সেটা গুরুত্বপূর্ণ নয়।",
    videoId: "dQw4w9WgXcQ",
    hasVideo: true,
    featured: false,
  },
  {
    id: 5,
    name: "সাবরিনা আক্তার",
    nameEn: "Sabrina Akter",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    college: "ময়মনসিংহ মেডিকেল কলেজ",
    collegeEn: "Mymensingh Medical College",
    meritPosition: 345,
    score: 79.0,
    year: 2025,
    batch: "HSC 2024",
    hometown: "ময়মনসিংহ",
    previousCollege: "আনন্দমোহন কলেজ",
    hscGpa: 5.0,
    journey:
      "Physics আমার দুর্বল বিষয় ছিল। কিন্তু Mr. Dr. এর Physics স্যারের ক্লাসগুলো এত সহজ করে বুঝিয়েছেন যে আমি Physics এ ভালো করতে পেরেছি।",
    tip: "দুর্বল বিষয়ে বেশি সময় দিন, কিন্তু শক্তিশালী বিষয় ভুলে যাবেন না।",
    videoId: "dQw4w9WgXcQ",
    hasVideo: false,
    featured: false,
  },
  {
    id: 6,
    name: "মাহমুদ হোসেন",
    nameEn: "Mahmud Hossain",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    college: "শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ",
    collegeEn: "Shaheed Suhrawardy Medical College",
    meritPosition: 678,
    score: 75.25,
    year: 2025,
    batch: "HSC 2024",
    hometown: "বরিশাল",
    previousCollege: "বরিশাল ক্যাডেট কলেজ",
    hscGpa: 5.0,
    journey:
      "Cadet College এ পড়ার পর Medical এর প্রস্তুতি নিতে একটু সময় লেগেছিল। কিন্তু Mr. Dr. এর Intensive Course আমাকে দ্রুত প্রস্তুত করেছে।",
    tip: "সময় কম থাকলে High Yield Topics এ ফোকাস করুন।",
    videoId: "dQw4w9WgXcQ",
    hasVideo: true,
    featured: false,
  },
];

const stats = [
  { value: "৫০০+", label: "মেডিকেলে চান্স", icon: Stethoscope },
  { value: "৯৫%", label: "সাফল্যের হার", icon: TrendingUp },
  { value: "১০০+", label: "DMC তে চান্স", icon: Trophy },
  { value: "৫০০০+", label: "সফল শিক্ষার্থী", icon: Users },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const SuccessStoriesView = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const featuredStories = successStories.filter((s) => s.featured);
  const filteredStories = successStories.filter(
    (s) => s.year.toString() === selectedYear,
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              আমাদের গর্ব
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              স্বপ্ন পূরণের গল্প
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
              যারা Mr. Dr. এর সাথে পড়ে Medical College এ চান্স পেয়েছে, তাদের
              অভিজ্ঞতা শুনুন
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl bg-white/10 backdrop-blur"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-white/80" />
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-4">বিশেষ গল্প</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Top Achievers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredStories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors h-full">
                  <div className="grid md:grid-cols-5 h-full">
                    {/* Image & Quick Info */}
                    <div className="md:col-span-2 bg-gradient-to-b from-primary to-primary/80 p-6 text-white relative">
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-yellow-950">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      </div>
                      <div className="flex flex-col items-center text-center h-full justify-center">
                        <div className="relative mb-4">
                          <Image
                            width={100}
                            height={100}
                            src={story.image}
                            alt={story.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
                          />
                          {story.hasVideo && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                                  <Play className="h-5 w-5 text-white fill-white" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl p-0">
                                <div className="aspect-video">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${story.videoId}`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                        <h3 className="text-xl font-bold">{story.name}</h3>
                        <p className="text-white/80 text-sm mb-3">
                          {story.nameEn}
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{story.college}</span>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{story.hometown}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <CardContent className="md:col-span-3 p-6">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <p className="text-2xl font-bold text-primary">
                            {story.meritPosition}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            মেধা তালিকা
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <p className="text-2xl font-bold text-primary">
                            {story.score}
                          </p>
                          <p className="text-xs text-muted-foreground">স্কোর</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted">
                          <p className="text-2xl font-bold text-primary">
                            {story.hscGpa}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            HSC GPA
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Quote className="h-5 w-5 text-primary shrink-0 mt-1" />
                          <p className="text-muted-foreground text-sm italic">
                            &quot;{story.journey}&quot;
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          টিপস:{" "}
                          <span className="font-normal text-muted-foreground">
                            {story.tip}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              সকল সাফল্যের গল্প
            </h2>
            <Tabs
              value={selectedYear}
              onValueChange={setSelectedYear}
              className="w-full max-w-md mx-auto"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="2025">২০২৫</TabsTrigger>
                <TabsTrigger value="2024">২০২৪</TabsTrigger>
                <TabsTrigger value="2023">২০২৩</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredStories.map((story) => (
              <motion.div key={story.id} variants={cardVariants}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                    <Image
                      width={100}
                      height={100}
                      src={story.image}
                      alt={story.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Video Play Button */}
                    {story.hasVideo && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors group-hover:scale-110">
                            <Play className="h-6 w-6 text-primary fill-primary ml-1" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-0">
                          <div className="aspect-video">
                            <iframe
                              src={`https://www.youtube.com/embed/${story.videoId}`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {story.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {story.college}
                          </p>
                        </div>
                        <Badge className="bg-white/20 text-white border-0">
                          #{story.meritPosition}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 rounded bg-muted">
                        <p className="font-bold text-primary">{story.score}</p>
                        <p className="text-xs text-muted-foreground">স্কোর</p>
                      </div>
                      <div className="text-center p-2 rounded bg-muted">
                        <p className="font-bold text-primary">{story.hscGpa}</p>
                        <p className="text-xs text-muted-foreground">GPA</p>
                      </div>
                      <div className="text-center p-2 rounded bg-muted">
                        <p className="font-bold text-primary">{story.year}</p>
                        <p className="text-xs text-muted-foreground">সাল</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{story.hometown}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{story.batch}</span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      &quot;{story.tip}&quot;
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      বিস্তারিত দেখুন
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                এই বছরের জন্য কোনো গল্প পাওয়া যায়নি।
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-4">ভিডিও</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              তাদের মুখে শুনুন
            </h2>
            <p className="text-muted-foreground">
              সফল শিক্ষার্থীদের ভিডিও টেস্টিমোনিয়াল
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {successStories
              .filter((s) => s.hasVideo)
              .slice(0, 3)
              .map((story) => (
                <Dialog key={story.id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all group">
                      <div className="relative">
                        <Image
                          width={100}
                          height={100}
                          src={story.image}
                          alt={story.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 text-primary fill-primary ml-1" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-foreground">
                          {story.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {story.college}
                        </p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-0">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${story.videoId}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              পরবর্তী সাফল্যের গল্প আপনার হতে পারে
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              আজই শুরু করুন আপনার Medical প্রস্তুতি। আমরা আপনাকে সফল করতে
              প্রতিশ্রুতিবদ্ধ।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/medical-admission">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2"
                >
                  Medical Course দেখুন
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Phone className="h-4 w-4 mr-2" />
                কল করুন
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
