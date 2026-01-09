"use client";

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
  MapPin,
  Users,
  Loader2,
} from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/auth/client";
import { useRouter } from "next/navigation";

// Test

export const ProfileView = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const { data, isLoading } = useQuery(trpc.student.profile.get.queryOptions());

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading profile......</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Profile not found</p>
        </Card>
      </div>
    );
  }

  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const menuItems = [
    { icon: User, label: "Edit Profile", href: "/profile/edit" },
    { icon: Award, label: "Achievements", href: "/achievements" },
    { icon: BookOpen, label: "My Subjects", href: "/subjects" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
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
              <AvatarImage src={data.imageUrl || undefined} alt={data.name} />
              <AvatarFallback className="gradient-primary text-primary-foreground text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-2xl font-bold text-foreground">{data.name}</h2>
            <p className="text-muted-foreground text-lg">{data.nameBangla}</p>

            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{data.className}</span>
              <span>•</span>
              <span>Roll: {data.roll}</span>
            </div>

            <p className="text-sm text-primary mt-2 font-medium bg-primary/10 inline-block px-3 py-1 rounded-full">
              ID: {data.studentId}
            </p>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {data.stats.totalExams}
              </p>
              <p className="text-xs text-muted-foreground">Exams</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-success">
                {data.stats.completedExams}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">
                {data.stats.averageScore}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </Card>
          </div>

          {/* Additional Info - Mobile/Desktop */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-sm">Academic Details</h3>
            <div className="space-y-3 text-sm">
              {data.section && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Section</span>
                  <span className="font-medium">{data.section}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shift</span>
                <span className="font-medium">{data.shift}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Group</span>
                <span className="font-medium">{data.group}</span>
              </div>
              {data.batch && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch</span>
                  <span className="font-medium">{data.batch}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Logout - Mobile */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>

        {/* Right Column - Details & Menu */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info - Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            {data.email && (
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">
                      Email Address
                    </p>
                    <p className="font-medium truncate">{data.email}</p>
                  </div>
                </div>
              </Card>
            )}
            {data.phone && (
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="font-medium">{data.phone}</p>
                  </div>
                </div>
              </Card>
            )}
            <Card className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Institute</p>
                  <p className="font-medium truncate">{data.instituteName}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          </div>

          {/* Mobile Contact Info Card */}
          <Card className="p-4 lg:hidden">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              {data.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{data.email}</p>
                  </div>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{data.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Institute</p>
                  <p className="text-sm font-medium truncate">
                    {data.instituteName}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Family Info Card */}
          <Card className="p-4 lg:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Family Information</h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Father&apos;s Name
                </p>
                <p className="font-medium">{data.fName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.fPhone}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Mother&apos;s Name
                </p>
                <p className="font-medium">{data.mName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.mPhone}
                </p>
              </div>
            </div>
          </Card>

          {/* Address Card */}
          <Card className="p-4 lg:p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Address</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Present Address
                </p>
                <p className="text-sm">
                  {data.presentAddress.houseNo}, {data.presentAddress.moholla},{" "}
                  {data.presentAddress.post}, {data.presentAddress.thana}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Permanent Address
                </p>
                <p className="text-sm">
                  {data.permanentAddress.village}, {data.permanentAddress.post},{" "}
                  {data.permanentAddress.thana},{" "}
                  {data.permanentAddress.district}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Actions Menu */}
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
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
