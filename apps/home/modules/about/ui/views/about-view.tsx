"use client";

import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  GraduationCap,
  Trophy,
  Clock,
  CheckCircle2,
  Quote,
  Lightbulb,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

const milestones = [
  {
    year: "২০১০",
    title: "যাত্রা শুরু",
    description: "মাত্র ১০ জন শিক্ষার্থী নিয়ে ধানমন্ডিতে প্রথম ব্যাচ শুরু",
  },
  {
    year: "২০১৩",
    title: "প্রথম সাফল্য",
    description: "প্রথমবার ৫০+ শিক্ষার্থী মেডিকেলে চান্স পায়",
  },
  {
    year: "২০১৬",
    title: "অনলাইন প্লাটফর্ম",
    description: "সারাদেশে অনলাইন ক্লাস শুরু",
  },
  {
    year: "২০১৮",
    title: "HSC প্রোগ্রাম",
    description: "HSC একাডেমিক প্রোগ্রাম চালু",
  },
  {
    year: "২০২০",
    title: "SSC Foundation",
    description: "SSC ফাউন্ডেশন প্রোগ্রাম শুরু",
  },
  {
    year: "২০২৪",
    title: "৫০০০+ সফল শিক্ষার্থী",
    description: "এ পর্যন্ত ৫০০০+ শিক্ষার্থী মেডিকেলে চান্স পেয়েছে",
  },
];

const values = [
  {
    icon: Heart,
    title: "শিক্ষার্থী কেন্দ্রিক",
    description:
      "প্রতিটি শিক্ষার্থীর সাফল্যই আমাদের লক্ষ্য। ব্যক্তিগত মনোযোগ দিয়ে পড়ানো হয়।",
    color: "bg-red-500",
  },
  {
    icon: Lightbulb,
    title: "উদ্ভাবনী শিক্ষা",
    description: "আধুনিক প্রযুক্তি ও পদ্ধতি ব্যবহার করে সহজে শেখানো হয়।",
    color: "bg-yellow-500",
  },
  {
    icon: Award,
    title: "গুণগত মান",
    description: "সেরা শিক্ষক, সেরা কন্টেন্ট, সেরা ফলাফল - কোনো আপস নেই।",
    color: "bg-blue-500",
  },
  {
    icon: Users,
    title: "সহযোগিতা",
    description: "শিক্ষক-শিক্ষার্থী একসাথে কাজ করে সাফল্য অর্জন করি।",
    color: "bg-green-500",
  },
];

const teamMembers = [
  {
    name: "ড. আব্দুল করিম",
    role: "প্রতিষ্ঠাতা ও পরিচালক",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    bio: "ঢাকা মেডিকেল কলেজের প্রাক্তন অধ্যাপক। ২৫+ বছরের শিক্ষকতার অভিজ্ঞতা।",
    qualification: "MBBS, PhD",
  },
  {
    name: "ড. ফারহানা আক্তার",
    role: "একাডেমিক ডিরেক্টর",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    bio: "কারিকুলাম ডেভেলপমেন্ট ও টিচার ট্রেনিং এর দায়িত্বে আছেন।",
    qualification: "MSc, BCS (Education)",
  },
  {
    name: "মোঃ রাশেদ খান",
    role: "অপারেশনস হেড",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "দৈনন্দিন কার্যক্রম পরিচালনা ও শিক্ষার্থী সেবার দায়িত্বে।",
    qualification: "MBA",
  },
  {
    name: "সাবিনা ইয়াসমিন",
    role: "স্টুডেন্ট সাকসেস ম্যানেজার",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "শিক্ষার্থীদের মানসিক সহায়তা ও ক্যারিয়ার গাইডেন্স প্রদান করেন।",
    qualification: "MA (Psychology)",
  },
];

const stats = [
  { value: "১৫+", label: "বছরের অভিজ্ঞতা", icon: Clock },
  { value: "৫০০০+", label: "সফল শিক্ষার্থী", icon: GraduationCap },
  { value: "২৫+", label: "অভিজ্ঞ শিক্ষক", icon: Users },
  { value: "৯৫%", label: "সাফল্যের হার", icon: Trophy },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const AboutView = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              ২০১০ সাল থেকে
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              স্বপ্ন দেখাই, স্বপ্ন পূরণ করি
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
              বাংলাদেশের সেরা মেডিকেল অ্যাডমিশন কোচিং। ১৫ বছর ধরে হাজারো
              শিক্ষার্থীর স্বপ্ন পূরণে সঙ্গী হয়ে আছি Mr. Dr.
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

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-2 border-primary/20 overflow-hidden">
                <div className="bg-primary p-6 text-primary-foreground">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">আমাদের মিশন</h2>
                      <p className="text-primary-foreground/80">Mission</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    প্রতিটি মেধাবী শিক্ষার্থীকে তার স্বপ্নের মেডিকেল কলেজে পৌঁছে
                    দেওয়া। আর্থিক সামর্থ্য বা ভৌগলিক অবস্থান যেন কোনো বাধা না
                    হয় - এই লক্ষ্যে আমরা সাশ্রয়ী মূল্যে মানসম্মত অনলাইন শিক্ষা
                    প্রদান করি।
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      "সাশ্রয়ী মূল্যে মানসম্মত শিক্ষা",
                      "সারাদেশে সমান সুযোগ",
                      "প্রযুক্তি নির্ভর শিক্ষা ব্যবস্থা",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-2 border-blue-500/20 overflow-hidden">
                <div className="bg-blue-600 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Eye className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">আমাদের ভিশন</h2>
                      <p className="text-white/80">Vision</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    বাংলাদেশের প্রতিটি জেলা থেকে মেধাবী শিক্ষার্থীরা যেন মেডিকেল
                    কলেজে চান্স পায় - এটাই আমাদের স্বপ্ন। ২০৩০ সালের মধ্যে
                    দেশের সেরা অনলাইন মেডিকেল প্রিপারেশন প্লাটফর্ম হিসেবে
                    প্রতিষ্ঠিত হতে চাই।
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      "দেশের সেরা অনলাইন প্লাটফর্ম",
                      "প্রতি জেলায় সফল শিক্ষার্থী",
                      "AI-powered লার্নিং সিস্টেম",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story / Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4">আমাদের যাত্রা</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              ১৫ বছরের গৌরবময় ইতিহাস
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ২০১০ সালে মাত্র ১০ জন শিক্ষার্থী নিয়ে শুরু, আজ ৫০০০+ সফল ডাক্তার
              তৈরির গর্বিত অংশীদার
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 transform md:-translate-x-1/2" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`relative flex items-center gap-4 md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg z-10">
                    <div className="h-3 w-3 rounded-full bg-white" />
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                  >
                    <Card className="inline-block">
                      <CardContent className="p-4">
                        <Badge
                          variant="outline"
                          className="mb-2 text-primary border-primary"
                        >
                          {milestone.year}
                        </Badge>
                        <h3 className="font-bold text-foreground">
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4">মূল্যবোধ</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              আমাদের মূল মূল্যবোধ
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              যে নীতিগুলো আমাদের কাজে অনুপ্রাণিত করে
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div
                      className={`h-16 w-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4">টিম</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              আমাদের নেতৃত্ব
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              অভিজ্ঞ ও নিবেদিত টিম যারা প্রতিদিন কাজ করে যাচ্ছেন আপনার সাফল্যের
              জন্য
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="overflow-hidden group hover:shadow-xl transition-all">
                  <div className="relative overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-primary mb-2">
                        {member.qualification}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
              <CardContent className="p-8 md:p-12">
                <Quote className="h-12 w-12 text-primary/30 mb-4" />
                <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6">
                  &quot;প্রতিটি শিক্ষার্থীর মধ্যে একজন ডাক্তার হওয়ার সম্ভাবনা
                  আছে। আমাদের কাজ হলো সেই সম্ভাবনাকে বাস্তবে রূপ দেওয়া। Mr. Dr.
                  শুধু একটি কোচিং নয়, এটি হাজারো পরিবারের স্বপ্ন পূরণের
                  মাধ্যম।&quot;
                </blockquote>
                <div className="flex items-center gap-4">
                  <Image
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
                    alt="Founder"
                    width={100}
                    height={100}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-foreground">ড. আব্দুল করিম</p>
                    <p className="text-sm text-muted-foreground">
                      প্রতিষ্ঠাতা, Mr. Dr.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
              আপনার সাফল্যের গল্প লেখা শুরু করুন
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              হাজারো সফল শিক্ষার্থীর সাথে যুক্ত হন। আজই শুরু করুন আপনার Medical
              প্রস্তুতি।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/medical-admission">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2"
                >
                  কোর্স দেখুন
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  যোগাযোগ করুন
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
