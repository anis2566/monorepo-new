"use client";

import { FormInput } from "@workspace/ui/shared/form-input";
import { FormSelect } from "@workspace/ui/shared/form-select";
import { FormTextArea } from "@workspace/ui/shared/form-text-area";
import { FormSwitch } from "@workspace/ui/shared/form-switch";

import { COURSE_TYPE } from "@workspace/utils/constant";

const COURSE_TYPE_OPTION = Object.values(COURSE_TYPE).map((type) => ({
  label: type,
  value: type,
}));

export function CourseBasicInfo() {
  return (
    <div className="space-y-6">
      <FormInput
        name="name"
        label="Course Name"
        placeholder="e.g., SSC Foundation 2028"
      />

      <FormSelect
        name="type"
        label="Type"
        placeholder="Select type"
        options={COURSE_TYPE_OPTION}
      />

      <FormTextArea
        name="description"
        label="Description"
        placeholder="Enter course description..."
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
            placeholder="Enter course description..."
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

      {/* Status Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSwitch
          name="isActive"
          label="Active Status"
          description="Make this course visible and available for enrollment"
        />

        <FormSwitch
          name="isPopular"
          label="Popular Course"
          description="Mark as popular/featured course"
        />
      </div>
    </div>
  );
}
