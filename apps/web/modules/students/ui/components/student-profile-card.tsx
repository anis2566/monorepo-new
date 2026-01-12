"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Separator } from "@workspace/ui/components/separator";
import { CheckCircle2 } from "lucide-react";

interface StudentProfileCardProps {
  student: {
    id: string;
    name: string;
    nameBangla: string;
    imageUrl: string | null;
    studentId: string;
    className: string;
    roll: string;
    batch: string | null;
    linkedUser: {
      email: string | null;
      emailVerified: boolean | null;
    } | null;
    studentStatus: {
      status: string | undefined;
    };
  };
}

export function StudentProfileCard({ student }: StudentProfileCardProps) {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "Present":
        return "bg-success/10 text-success border-success/20";
      case "Absent":
        return "bg-warning/10 text-warning border-warning/20";
      case "Suspended":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
      <CardContent className="pt-0 -mt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage
              src={student.imageUrl || undefined}
              alt={student.name}
            />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">
                {student.name}
              </h2>
              <Badge className={getStatusColor(student.studentStatus.status)}>
                {student.studentStatus.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{student.nameBangla}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-mono">{student.studentId}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{student.className}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Roll: {student.roll}</span>
              {student.batch && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{student.batch}</span>
                </>
              )}
            </div>
          </div>
          {student.linkedUser?.email && (
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="h-3 w-3 text-success" />
              Account Linked
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
