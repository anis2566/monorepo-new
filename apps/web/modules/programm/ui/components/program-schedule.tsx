"use client";

import { format } from "date-fns";

import { FormCalendar } from "@workspace/ui/shared/form-calendar";
import { UseFormReturn } from "@workspace/ui/components/form";

interface ProgramScheduleProps {
  form: UseFormReturn<any>;
}

export function ProgramSchedule({ form }: ProgramScheduleProps) {
  return (
    <div className="space-y-6">
      <FormCalendar
        name="startDate"
        label="Start Date"
        placeholder="Select date"
      />

      <FormCalendar name="endDate" label="End Date" placeholder="Select date" />

      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="text-sm font-medium mb-2">Program Timeline</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium text-foreground">
              {form.watch("duration") || "0"} months
            </span>
          </div>
          <div className="flex justify-between">
            <span>Start Date:</span>
            <span className="font-medium text-foreground">
              {form.watch("startDate")
                ? format(new Date(form.watch("startDate")), "MMM dd, yyyy")
                : "Not set"}
            </span>
          </div>
          {form.watch("endDate") && (
            <div className="flex justify-between">
              <span>End Date:</span>
              <span className="font-medium text-foreground">
                {format(new Date(form.watch("endDate")), "MMM dd, yyyy")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
