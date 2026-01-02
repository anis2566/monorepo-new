import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  Settings,
  LogOut,
  ChevronRight,
  GraduationCap,
  Calendar,
  Edit,
} from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { mockExams, mockResults, mockStudent } from "@/data/mock";
import { PageHeader } from "@/modules/layout/ui/components/page-header";

export const ProfileView = () => {
  const initials = mockStudent.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const averageScore = Math.round(
    mockResults.reduce((acc, r) => acc + r.percentage, 0) / mockResults.length
  );

  const menuItems = [
    { icon: User, label: "Edit Profile", href: "#" },
    { icon: Award, label: "Achievements", href: "#" },
    { icon: BookOpen, label: "My Subjects", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ];

  return (
    <>
      <PageHeader title="Profile" />

      <div className="px-4 lg:px-8 py-4 lg:py-8 max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6 mb-6 lg:mb-0">
            {/* Profile Header */}
            <Card className="p-6 text-center relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
              >
                <Edit className="w-4 h-4" />
              </Button>

              <Avatar className="w-28 h-28 mx-auto mb-4 border-4 border-primary/20">
                <AvatarImage
                  src={mockStudent.imageUrl}
                  alt={mockStudent.name}
                />
                <AvatarFallback className="gradient-primary text-primary-foreground text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-bold text-foreground">
                {mockStudent.name}
              </h2>
              <p className="text-muted-foreground text-lg">
                {mockStudent.nameBangla}
              </p>

              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span>{mockStudent.className}</span>
                <span>•</span>
                <span>Roll: {mockStudent.roll}</span>
              </div>

              <p className="text-sm text-primary mt-2 font-medium bg-primary/10 inline-block px-3 py-1 rounded-full">
                ID: {mockStudent.studentId}
              </p>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {mockExams.length}
                </p>
                <p className="text-xs text-muted-foreground">Exams</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-success">
                  {mockResults.length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-warning">
                  {averageScore}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </Card>
            </div>

            {/* Logout - Mobile */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>

          {/* Right Column - Details & Menu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards - Desktop Grid */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Email Address
                    </p>
                    <p className="font-medium">ahmed.rahman@email.com</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="font-medium">+880 1712-345678</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Batch</p>
                    <p className="font-medium">{mockStudent.batch}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Session</p>
                    <p className="font-medium">2024</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Mobile Info Card */}
            <Card className="p-4 lg:hidden">
              <h3 className="font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">
                      ahmed.rahman@email.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">+880 1712-345678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Batch</p>
                    <p className="text-sm font-medium">{mockStudent.batch}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Menu */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Quick Actions</h3>
              </div>
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="flex-1 text-left font-medium">
                      {item.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              ))}
            </Card>

            {/* Logout - Desktop */}
            <div className="hidden lg:block">
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
