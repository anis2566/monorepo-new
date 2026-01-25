"use client";

import { Dna, GraduationCap } from "lucide-react";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

import { FadeUp } from "@/components/scroll-animation";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const TeachersSection = () => {
  const trpc = useTRPC();
  const { data: teachers } = useQuery(trpc.home.teacher.getMany.queryOptions());

  const getInstituteImage = (institute: string) => {
    switch (institute) {
      case "BUET":
        return "/buet.png";
      case "DMC":
        return "/dmc.png";
      case "SSMC":
        return "/ssmc.png";
      default:
        return "/buet.png";
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <FadeUp>
          <div className="text-center mb-6">
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary text-xl"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Teacher Panel
            </Badge>
          </div>
        </FadeUp>

        <div className="relative px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            plugins={[
              AutoScroll({
                speed: 1,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {teachers?.map((teacher) => (
                <CarouselItem
                  key={teacher.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      {/* Image Section */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={teacher.imageUrl}
                          alt={teacher.name}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-primary text-white mb-2 bg-orange-500 text-md">
                            {teacher.institute}
                          </Badge>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="p-4 flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center`}
                        >
                          <Image
                            src={getInstituteImage(teacher.institute)}
                            alt={teacher.institute}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xl">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Badge>{teacher.subject}</Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
              {teachers?.map((teacher) => (
                <CarouselItem
                  key={teacher.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      {/* Image Section */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={teacher.imageUrl}
                          alt={teacher.name}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-primary text-white mb-2 bg-orange-500 text-md">
                            {teacher.institute}
                          </Badge>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="p-4 flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center`}
                        >
                          <Dna className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xl">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Badge>{teacher.subject}</Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
              {teachers?.map((teacher) => (
                <CarouselItem
                  key={teacher.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      {/* Image Section */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={teacher.imageUrl}
                          alt={teacher.name}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-primary text-white mb-2 bg-orange-500 text-md">
                            {teacher.institute}
                          </Badge>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="p-4 flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center`}
                        >
                          <Dna className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xl">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Badge>{teacher.subject}</Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
              {teachers?.map((teacher) => (
                <CarouselItem
                  key={teacher.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      {/* Image Section */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={teacher.imageUrl}
                          alt={teacher.name}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-primary text-white mb-2 bg-orange-500 text-md">
                            {teacher.institute}
                          </Badge>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="p-4 flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center`}
                        >
                          <Dna className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xl">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Badge>{teacher.subject}</Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
              {teachers?.map((teacher) => (
                <CarouselItem
                  key={teacher.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      {/* Image Section */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={teacher.imageUrl}
                          alt={teacher.name}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-primary text-white mb-2 bg-orange-500 text-md">
                            {teacher.institute}
                          </Badge>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="p-4 flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center`}
                        >
                          <Dna className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xl">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Badge>{teacher.subject}</Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
              {teachers?.map((teacher) => (
                <CarouselItem
                  key={teacher.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      {/* Image Section */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={teacher.imageUrl}
                          alt={teacher.name}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-primary text-white mb-2 bg-orange-500 text-md">
                            {teacher.institute}
                          </Badge>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="p-4 flex items-center gap-3">
                        <div
                          className={`h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center`}
                        >
                          <Dna className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xl">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Badge>{teacher.subject}</Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 bg-background border-border hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6 bg-background border-border hover:bg-primary hover:text-primary-foreground" />
          </Carousel>

          {/* Mobile Scroll Indicator */}
          <div className="flex justify-center gap-1 mt-6 md:hidden">
            <span className="text-xs text-muted-foreground">
              ← সোয়াইপ করুন →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
