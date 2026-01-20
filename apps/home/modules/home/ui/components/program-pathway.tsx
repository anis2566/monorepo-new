"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import Link from "next/link";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";

const programs = [
  {
    id: "ssc",
    title: "SSC Foundation",
    subtitle: "Class 7-9",
    icon: BookOpen,
    color: "bg-green-500",
    lightColor: "bg-green-500/10",
    textColor: "text-green-600",
    borderColor: "border-green-500",
    duration: "২ বছর",
    description: "মূল ভিত্তি তৈরি করুন। গণিত, বিজ্ঞান, ইংরেজিতে দক্ষতা অর্জন।",
    highlights: ["Foundation Building", "Weekly Tests", "Parent Reports"],
    link: "/ssc-foundation",
  },
  {
    id: "hsc",
    title: "HSC Academic",
    subtitle: "Class 11-12",
    icon: GraduationCap,
    color: "bg-blue-500",
    lightColor: "bg-blue-500/10",
    textColor: "text-blue-600",
    borderColor: "border-blue-500",
    duration: "২ বছর",
    description: "বিজ্ঞান বিষয়ে গভীর জ্ঞান। HSC + Medical একসাথে প্রস্তুতি।",
    highlights: ["Science Focus", "Board + Admission", "MCQ + CQ"],
    link: "/hsc-academic",
  },
  {
    id: "medical",
    title: "Medical Admission",
    subtitle: "After HSC",
    icon: Stethoscope,
    color: "bg-primary",
    lightColor: "bg-primary/10",
    textColor: "text-primary",
    borderColor: "border-primary",
    duration: "৪ মাস",
    description: "Intensive crash course। ১০০+ Mock Test, Daily Practice।",
    highlights: ["100+ Mock Tests", "Negative Marking", "Result Analysis"],
    link: "/medical-admission",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const arrowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.3,
    },
  },
};

export const ProgramPathway = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            আমাদের প্রোগ্রাম
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            SSC থেকে Medical - সম্পূর্ণ যাত্রা
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ধাপে ধাপে এগিয়ে যান। প্রতিটি পর্যায়ে আমরা আপনার সঙ্গী।
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="hidden lg:block relative"
        >
          {/* Connection Lines */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-center z-0 px-[16%]">
            <motion.div
              variants={lineVariants}
              className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-primary flex-1 origin-left rounded-full"
            />
          </div>

          {/* Program Cards */}
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                variants={cardVariants}
                className="relative"
              >
                {/* Arrow between cards */}
                {index < programs.length - 1 && (
                  <motion.div
                    variants={arrowVariants}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
                  >
                    <div
                      className={`h-10 w-10 rounded-full ${program.color} flex items-center justify-center shadow-lg`}
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
                    </div>
                  </motion.div>
                )}

                <Card
                  className={`h-full border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${program.borderColor} overflow-hidden group`}
                >
                  {/* Top Icon Section */}
                  <div
                    className={`${program.color} p-6 text-white relative overflow-hidden`}
                  >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <program.icon className="h-10 w-10" />
                        <Badge className="bg-white/20 text-white border-0">
                          {program.duration}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold">{program.title}</h3>
                      <p className="text-white/80">{program.subtitle}</p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      {program.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {program.highlights.map((highlight, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2
                            className={`h-4 w-4 ${program.textColor}`}
                          />
                          <span className="text-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={program.link}>
                      <Button
                        className={`w-full ${program.color} hover:opacity-90 group-hover:gap-3 transition-all`}
                      >
                        বিস্তারিত দেখুন
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:hidden relative"
        >
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 to-primary rounded-full" />

          <div className="space-y-8 relative">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                variants={cardVariants}
                className="relative pl-16"
              >
                {/* Timeline Node */}
                <div
                  className={`absolute left-3 top-6 h-8 w-8 rounded-full ${program.color} flex items-center justify-center shadow-lg border-4 border-background z-10`}
                >
                  <program.icon className="h-4 w-4 text-white" />
                </div>

                {/* Step Number */}
                <div className="absolute left-0 top-0 text-xs font-bold text-muted-foreground">
                  STEP {index + 1}
                </div>

                <Card
                  className={`border-2 ${program.borderColor} overflow-hidden`}
                >
                  <div className={`${program.color} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{program.title}</h3>
                        <p className="text-white/80 text-sm">
                          {program.subtitle}
                        </p>
                      </div>
                      <Badge className="bg-white/20 text-white border-0">
                        {program.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-sm mb-3">
                      {program.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {program.highlights.map((highlight, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </div>

                    <Link href={program.link}>
                      <Button size="sm" className={`w-full ${program.color}`}>
                        বিস্তারিত দেখুন
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-muted-foreground mb-4">
            কোন প্রোগ্রাম আপনার জন্য সঠিক তা জানতে আমাদের সাথে কথা বলুন
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="gap-2">
              <a href="tel:+8801700000000" className="flex items-center gap-2">
                📞 কল করুন
              </a>
            </Button>
            <Button size="lg" className="gap-2">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                💬 WhatsApp করুন
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
