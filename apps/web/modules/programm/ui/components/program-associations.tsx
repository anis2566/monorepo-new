"use client";

import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";

import { FormMultiSelect } from "@workspace/ui/shared/form-multi-select";

export function ProgramAssociations() {
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

  const trpc = useTRPC();

  const results = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.batch.getByClassNameIds.queryOptions(selectedClassIds),
      trpc.admin.subject.getByClassNameIds.queryOptions(selectedClassIds),
    ],
  });

  const classOptions =
    results[0]?.data?.map((c) => ({
      label: c.name,
      value: c.id,
    })) || [];

  const batchOptions =
    results[1]?.data?.map((b) => ({
      label: b.name,
      value: b.id,
    })) || [];

  const subjectOptions =
    results[2]?.data?.map((s) => ({
      label: s.name,
      value: s.id,
    })) || [];

  return (
    <div className="space-y-6">
      <FormMultiSelect
        name="classIds"
        label="Target Classes"
        placeholder="Select class"
        options={classOptions}
        onClick={(value) => {
          setSelectedClassIds(value);
        }}
      />

      <FormMultiSelect
        name="batchIds"
        label="Target Batches"
        placeholder="Select batch"
        options={batchOptions}
      />

      <FormMultiSelect
        name="subjectIds"
        label="Target Subjects"
        placeholder="Select subject"
        options={subjectOptions}
      />
    </div>
  );
}
