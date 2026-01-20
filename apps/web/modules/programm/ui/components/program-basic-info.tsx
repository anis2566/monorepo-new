"use client";

import { FormInput } from "@workspace/ui/shared/form-input";
import { FormSelect } from "@workspace/ui/shared/form-select";
import { FormTextArea } from "@workspace/ui/shared/form-text-area";
import { FormSwitch } from "@workspace/ui/shared/form-switch";
import { UseFormReturn } from "@workspace/ui/components/form";

import { ProgramFormSchemaType } from "@workspace/schema";
import { PROGRAM_TYPE } from "@workspace/utils/constant";

interface ProgramBasicInfoProps {
  form: UseFormReturn<ProgramFormSchemaType>;
}

const PROGRAM_TYPE_OPTION = Object.values(PROGRAM_TYPE).map((type) => ({
  label: type,
  value: type,
}));

export function ProgramBasicInfo({ form }: ProgramBasicInfoProps) {
  const programType = form.watch("type");
  return (
    <div className="space-y-6">
      <FormInput
        name="name"
        label="Program Name"
        placeholder="e.g., SSC Foundation 2028"
      />

      <FormSelect
        name="type"
        label="Type"
        placeholder="Select type"
        options={PROGRAM_TYPE_OPTION}
      />

      <FormTextArea
        name="description"
        label="Description"
        placeholder="Enter program description..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="duration"
          label="Duration (months)"
          placeholder="e.g., 6"
          type="number"
        />

        <FormInput
          name="totalClasses"
          label="Total Classes"
          placeholder="e.g., 96"
          type="number"
        />
      </div>

      <FormInput
        name="imageUrl"
        label="Image URL"
        placeholder="https://example.com/image.jpg"
      />

      {/* Hero Section Fields */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-sm font-semibold mb-4">
          Hero Section (Landing Page)
        </h3>

        <div className="space-y-4">
          <FormInput
            name="heroTitle"
            label="Hero Title"
            placeholder="e.g., Medical Admission Crash Course"
          />

          <FormTextArea
            name="heroDescription"
            label="Hero Description"
            placeholder="Enter program description..."
          />

          <FormInput
            name="tagline"
            label="Tagline"
            placeholder="e.g., Medical 2026 - সীমিত আসন"
          />

          <FormInput
            name="urgencyMessage"
            label="Urgency Message"
            placeholder="e.g., মার্চ ব্যাচে মাত্র ২৫টি সিট বাকি!"
          />
        </div>
      </div>

      {/* Medical Admission Specific Fields */}
      {programType === PROGRAM_TYPE.MEDICAL_ADMISSION && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-sm font-semibold mb-4">
            Medical Admission Settings
          </h3>

          <div className="space-y-4">
            <FormSwitch
              name="hasNegativeMarking"
              label="Negative Marking"
              description="Enable negative marking for this exam"
            />

            {form.watch("hasNegativeMarking") && (
              <FormInput
                name="negativeMarks"
                label="Negative Marks"
                placeholder="e.g., 0.25"
                type="number"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                name="examDuration"
                label="Exam Duration"
                placeholder="e.g., 60"
                type="number"
              />

              <FormInput
                name="totalMarks"
                label="Total Marks"
                placeholder="e.g., 100"
                type="number"
              />

              <FormInput
                name="totalQuestions"
                label="Total Questions"
                placeholder="e.g., 100"
                type="number"
              />
            </div>
          </div>
        </div>
      )}

      {/* Status Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSwitch
          name="isActive"
          label="Active Status"
          description="Make this program visible and available for enrollment"
        />

        <FormSwitch
          name="isPopular"
          label="Popular Program"
          description="Mark as popular/featured program"
        />
      </div>
    </div>
  );
}
