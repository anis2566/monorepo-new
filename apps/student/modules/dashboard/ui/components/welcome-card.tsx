import { Student } from "@/types/exam";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Bell } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface WelcomeCardProps {
  student: Student;
}

export function WelcomeCard({ student }: WelcomeCardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="gradient-hero rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-primary/20">
            <AvatarImage src={student.imageUrl} alt={student.name} />
            <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()} 👋</p>
            <h1 className="text-xl font-bold text-foreground">
              {student.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {student.className} • Roll: {student.roll}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>
      </div>
    </div>
  );
}
