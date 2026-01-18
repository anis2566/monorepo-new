"use client";

import { useState, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownBanner = () => {
  // Target date: Medical Admission Exam (example: March 15, 2026)
  const targetDate = new Date("2026-03-15T10:00:00");

  const calculateTimeLeft = (): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { value: timeLeft.days, label: "দিন" },
    { value: timeLeft.hours, label: "ঘন্টা" },
    { value: timeLeft.minutes, label: "মিনিট" },
    { value: timeLeft.seconds, label: "সেকেন্ড" },
  ];

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-3 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Announcement Text */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <Clock className="h-5 w-5 animate-pulse shrink-0" />
            <span className="text-sm md:text-base font-medium">
              মেডিকেল অ্যাডমিশন পরীক্ষা ২০২৬ পর্যন্ত বাকি
            </span>
          </div>

          {/* Center: Countdown Timer */}
          <div className="flex items-center gap-2 md:gap-3">
            {timeBlocks.map((block, index) => (
              <div key={index} className="flex items-center gap-2 md:gap-3">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur rounded-lg px-2 md:px-3 py-1 min-w-[40px] md:min-w-[50px]">
                    <span className="text-lg md:text-2xl font-bold tabular-nums">
                      {String(block.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs text-white/80 mt-0.5 block">
                    {block.label}
                  </span>
                </div>
                {index < timeBlocks.length - 1 && (
                  <span className="text-lg md:text-xl font-bold text-white/60 -mt-4">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Right: CTA Button */}
          <Button
            size="sm"
            variant="white"
            className="font-bold hover:scale-105 transition-all w-full sm:w-auto ring-2 ring-white/30 hover:ring-white/50"
          >
            এখনই ভর্তি হন <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
