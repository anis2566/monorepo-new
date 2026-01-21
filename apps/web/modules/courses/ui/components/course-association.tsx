"use client";

import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";

import { FormMultiSelect } from "@workspace/ui/shared/form-multi-select";

interface CourseAssociationsProps {
  isPending: boolean;
}

export function CourseAssociations({ isPending }: CourseAssociationsProps) {
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

  const trpc = useTRPC();

  const results = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.subject.getByClassNameIds.queryOptions(selectedClassIds),
    ],
  });

  const classOptions =
    results[0]?.data?.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const subjectOptions =
    results[1]?.data?.map((s) => ({
      label: s.name,
      value: s.id,
    })) || [];

  return (
    <div className="space-y-6">
      <FormMultiSelect
        disabled={isPending}
        name="classIds"
        label="Target Classes"
        placeholder="Select class"
        options={classOptions}
        onClick={(value) => {
          setSelectedClassIds(value);
        }}
      />

      <FormMultiSelect
        name="subjectIds"
        label="Target Subjects"
        placeholder="Select subject"
        disabled={isPending}
        options={subjectOptions}
      />
    </div>
  );
}
