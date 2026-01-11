"use client";

import { useTRPC } from "@/trpc/react";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";

import { StudentSchemaType } from "@workspace/schema";
import { genders, religions, SHIFT } from "@workspace/utils/constant";
import { nationalities } from "@workspace/utils";
import { cn } from "@workspace/ui/lib/utils";

interface StudentFormFieldsProps {
  form: UseFormReturn<StudentSchemaType>;
  stepId: number;
  isSubmitting: boolean;
}

const RELIGIONS_OPTIONS = religions.map((religion) => ({
  value: religion,
  label: religion,
}));

const GENDERS_OPTIONS = genders.map((gender) => ({
  value: gender,
  label: gender,
}));

const NATIONALITIES_OPTIONS = nationalities.map((nationality) => ({
  value: nationality,
  label: nationality,
}));

const SHIFTS_OPTIONS = Object.values(SHIFT).map((shift) => ({
  value: shift,
  label: shift,
}));

export function StudentFormFields({
  form,
  stepId,
  isSubmitting,
}: StudentFormFieldsProps) {
  switch (stepId) {
    case 1:
      return <PersonalInfoFields form={form} />;
    case 2:
      return <AcademicDetailsFields form={form} />;
    case 3:
      return <ContactInfoFields form={form} />;
    case 4:
      return <PresentAddressFields form={form} />;
    case 5:
      return <PermanentAddressFields form={form} isSubmitting={isSubmitting} />;
    default:
      return null;
  }
}

function PersonalInfoFields({
  form,
}: {
  form: UseFormReturn<StudentSchemaType>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="studentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student ID *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., STU-2024-001" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name (English) *</FormLabel>
            <FormControl>
              <Input placeholder="Enter full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nameBangla"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name (Bangla)</FormLabel>
            <FormControl>
              <Input placeholder="বাংলায় নাম লিখুন" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Father&apos;s Name *</FormLabel>
            <FormControl>
              <Input placeholder="Father's full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mother&apos;s Name *</FormLabel>
            <FormControl>
              <Input placeholder="Mother's full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full py-5">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {GENDERS_OPTIONS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal border-muted hover:bg-background hover:text-foreground",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date?.toISOString())}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nationality *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full py-5">
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {NATIONALITIES_OPTIONS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="religion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Religion *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full py-5">
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {RELIGIONS_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function AcademicDetailsFields({
  form,
}: {
  form: UseFormReturn<StudentSchemaType>;
}) {
  const [selectedClass, setSelectedClass] = useState<string>("");

  const trpc = useTRPC();

  const data = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.institute.forSelect.queryOptions({ search: "" }),
      trpc.admin.batch.getByClassNameId.queryOptions(selectedClass),
    ],
  });

  const CLASSNAME_OPTIONS =
    data[0].data?.map((cls) => ({
      value: cls.id,
      label: cls.name,
    })) || [];

  const INSTITUTE_OPTIONS =
    data[1].data?.map((inst) => ({
      value: inst.id,
      label: inst.name,
    })) || [];

  const BATCH_OPTIONS =
    data[2].data?.map((batch) => ({
      value: batch.id,
      label: batch.name,
    })) || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="classNameId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class *</FormLabel>
            <Select
              onValueChange={(value) => {
                setSelectedClass(value);
                field.onChange(value);
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CLASSNAME_OPTIONS.map((cls) => (
                  <SelectItem key={cls.value} value={cls.value}>
                    {cls.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="instituteId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institute *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select institute" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {INSTITUTE_OPTIONS.map((inst) => (
                  <SelectItem key={inst.value} value={inst.value}>
                    {inst.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="batchId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Batch *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {BATCH_OPTIONS.map((batch) => (
                  <SelectItem key={batch.value} value={batch.value}>
                    {batch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="section"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Section *</FormLabel>
            <FormControl>
              <Input placeholder="Enter section" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shift"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shift</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SHIFTS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="roll"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Roll Number *</FormLabel>
            <FormControl>
              <Input placeholder="Enter roll number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ContactInfoFields({
  form,
}: {
  form: UseFormReturn<StudentSchemaType>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="fPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Father&apos;s Phone *</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="e.g., 01712345678" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mother&apos;s Phone</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="e.g., 01812345678" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="sm:col-span-2 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          📱 Phone numbers will be used for SMS notifications about exam
          schedules, results, and important updates.
        </p>
      </div>
    </div>
  );
}

function PresentAddressFields({
  form,
}: {
  form: UseFormReturn<StudentSchemaType>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="presentHouseNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>House No / Road *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., House 12, Road 5" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="presentMoholla"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Moholla / Area *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Dhanmondi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="presentPost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Post Office *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Dhanmondi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="presentThana"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thana / Upazila *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Dhanmondi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function PermanentAddressFields({
  form,
  isSubmitting,
}: {
  form: UseFormReturn<StudentSchemaType>;
  isSubmitting: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="permanentVillage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Village *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Char Kukri Mukri"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="permanentPost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Post Office *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Bhola Sadar"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="permanentThana"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thana / Upazila *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Bhola Sadar"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="permanentDistrict"
        render={({ field }) => (
          <FormItem>
            <FormLabel>District *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Bhola"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
