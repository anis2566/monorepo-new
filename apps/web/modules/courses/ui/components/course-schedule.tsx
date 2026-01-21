"use client";

import { format } from "date-fns";

import { FormCalendar } from "@workspace/ui/shared/form-calendar";
import { UseFormReturn } from "@workspace/ui/components/form";

import { CourseFormSchemaType } from "@workspace/schema";

interface CourseScheduleProps {
  form: UseFormReturn<CourseFormSchemaType>;
}

export function CourseSchedule({ form }: CourseScheduleProps) {
  const duration = form.watch("duration");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  return (
    <div className="space-y-6">
      <FormCalendar
        name="startDate"
        label="Start Date"
        placeholder="Select date"
      />

      <FormCalendar name="endDate" label="End Date" placeholder="Select date" />

      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="text-sm font-medium mb-2">Course Timeline</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium text-foreground">
              {duration || "0"} months
            </span>
          </div>
          <div className="flex justify-between">
            <span>Start Date:</span>
            <span className="font-medium text-foreground">
              {startDate
                ? format(new Date(startDate), "MMM dd, yyyy")
                : "Not set"}
            </span>
          </div>
          {endDate && (
            <div className="flex justify-between">
              <span>End Date:</span>
              <span className="font-medium text-foreground">
                {format(new Date(endDate), "MMM dd, yyyy")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
