"use client";

import { useState } from "react";
import { Play, GraduationCap, Quote } from "lucide-react";
import Image from "next/image";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/scroll-animation";

interface VideoTestimonial {
  id: string;
  name: string;
  college: string;
  merit: string;
  thumbnail: string;
  videoId: string;
  quote: string;
}

const videoTestimonials: VideoTestimonial[] = [
  {
    id: "1",
    name: "আহমেদ হাসান",
    college: "ঢাকা মেডিকেল কলেজ",
    merit: "মেধা তালিকায় ৫৬তম",
    thumbnail:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=225&fit=crop",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    quote: "Mr. Dr. এর কোর্স আমার জীবন বদলে দিয়েছে।",
  },
  {
    id: "2",
    name: "ফারজানা আক্তার",
    college: "সলিমুল্লাহ মেডিকেল কলেজ",
    merit: "মেধা তালিকায় ১২৮তম",
    thumbnail:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=225&fit=crop",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    quote: "শিক্ষকদের সাপোর্ট ছিল অসাধারণ।",
  },
  {
    id: "3",
    name: "রাফি ইসলাম",
    college: "চট্টগ্রাম মেডিকেল কলেজ",
    merit: "মেধা তালিকায় ২৩৪তম",
    thumbnail:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=225&fit=crop",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    quote: "মক টেস্টগুলো আমাকে প্রস্তুত করেছে।",
  },
];

export const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeUp className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Play className="h-4 w-4" />
            <span>ভিডিও টেস্টিমোনিয়াল</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            সফল শিক্ষার্থীদের গল্প শুনুন
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            যারা Mr. Dr. এর সাথে তাদের স্বপ্ন পূরণ করেছে, তাদের অভিজ্ঞতা শুনুন
          </p>
        </FadeUp>

        {/* Video Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {videoTestimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                {/* Video Thumbnail / Embed */}
                <div className="relative aspect-video bg-muted">
                  {activeVideo === testimonial.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1&rel=0`}
                      title={`${testimonial.name} এর টেস্টিমোনিয়াল`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <Image
                        src={testimonial.thumbnail}
                        alt={testimonial.name}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <Button
                          onClick={() => setActiveVideo(testimonial.id)}
                          size="lg"
                          variant="secondary"
                          className="rounded-full h-16 w-16 bg-red-700 hover:bg-red-700 hover:scale-110 transition-all shadow-xl"
                        >
                          <Play className="h-7 w-7 fill-white text-white" />
                        </Button>
                      </div>
                      {/* Quote Badge */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                          <Quote className="h-4 w-4 text-red-700 mb-1" />
                          <p className="text-sm text-foreground font-medium line-clamp-1">
                            &quot;{testimonial.quote}&quot;
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Student Info */}
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-700 to-red-700/70 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-red-700">
                        <GraduationCap className="h-4 w-4" />
                        <span className="truncate">{testimonial.college}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {testimonial.merit}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View More */}
        <FadeUp delay={0.3} className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-red-700 hover:bg-red-700 text-red-700 hover:text-white"
          >
            <Play className="h-4 w-4" />
            আরও ভিডিও দেখুন
          </Button>
        </FadeUp>
      </div>
    </section>
  );
};
