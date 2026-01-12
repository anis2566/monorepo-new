"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Users, GraduationCap, Building2 } from "lucide-react";

interface BatchHeaderCardProps {
  batch: {
    id: string;
    name: string;
    className: string;
    institute: string;
    createdAt: string;
  };
}

export function BatchHeaderCard({ batch }: BatchHeaderCardProps) {
  return (
    <Card className="shadow-card overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
      <CardContent className="pt-0 -mt-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 shadow-lg">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {batch.name}
                </h2>
                <Badge variant="secondary" className="w-fit">
                  Batch
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  <span>{batch.className}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>{batch.institute}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
