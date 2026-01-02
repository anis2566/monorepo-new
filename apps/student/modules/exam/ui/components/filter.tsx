"use client";

import { useTRPC } from "@/trpc/react";
import { useQueries } from "@tanstack/react-query";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_SORT_OPTIONS,
  EXAM_STATUS,
} from "@workspace/utils/constant";

import { FilterSelect } from "@workspace/ui/shared/filter-select";
import { ResetFilter } from "@workspace/ui/shared/reset-filter";
import { FilterCalendar } from "@workspace/ui/shared/filter-calendar";

import { useGetExams } from "../../filters/use-get-exams";
import { useCallback } from "react";
import { MobileFilter } from "./mobile-filter";

const PAGE_SIZE_OPTIONS = Object.values(DEFAULT_PAGE_SIZE_OPTIONS).map((v) => ({
  label: v.toString(),
  value: v.toString(),
}));
const SORT_OPTIONS = Object.values(DEFAULT_SORT_OPTIONS);
const STATUS_OPTIONS = Object.values(EXAM_STATUS).map((v) => ({
  label: v,
  value: v,
}));

export const Filter = () => {
  const [filter, setFilter] = useGetExams();
  const trpc = useTRPC();

  const [classesQuery, batchesQuery, subjectsQuery] = useQueries({
    queries: [
      trpc.admin.class.forSelect.queryOptions({ search: "" }),
      trpc.admin.batch.getByClassNameId.queryOptions(filter.classNameId),
      trpc.admin.subject.forSelect.queryOptions({ search: "" }),
    ],
  });

  const classOptions = (classesQuery.data ?? []).map((v) => ({
    label: v.name,
    value: v.id,
  }));
  const batchOptions = (batchesQuery.data ?? []).map((v) => ({
    label: v.name,
    value: v.id,
  }));
  const subjectOptions = (subjectsQuery.data ?? []).map((v) => ({
    label: v.name,
    value: v.id,
  }));

  const hasAnyModified =
    filter.limit !== 5 ||
    filter.page !== 1 ||
    filter.sort !== "" ||
    filter.batchId !== "" ||
    filter.classNameId !== "" ||
    filter.subjectId !== "" ||
    filter.status !== "" ||
    filter.startDate !== "" ||
    filter.endDate !== "";

  const handleClassChange = useCallback(
    (value: string) => setFilter({ classNameId: value }),
    [setFilter]
  );

  const handleBatchChange = useCallback(
    (value: string) => setFilter({ batchId: value }),
    [setFilter]
  );

  const handleSubjectChange = useCallback(
    (value: string) => setFilter({ subjectId: value }),
    [setFilter]
  );

  const handleStatusChange = useCallback(
    (value: string) => setFilter({ status: value }),
    [setFilter]
  );

  const handleSortChange = useCallback(
    (value: string) => setFilter({ sort: value }),
    [setFilter]
  );

  const handleLimitChange = useCallback(
    (value: string) => setFilter({ limit: parseInt(value, 10) }),
    [setFilter]
  );

  const selectedStartDate = filter.startDate
    ? new Date(filter.startDate)
    : undefined;
  const selectedEndDate = filter.endDate ? new Date(filter.endDate) : undefined;

  const handleStartDateChange = (date: Date | undefined) => {
    setFilter({
      startDate: date ? date.toISOString() : "",
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setFilter({
      endDate: date ? date.toISOString() : "",
    });
  };

  const handleClear = useCallback(() => {
    setFilter({
      limit: DEFAULT_PAGE_SIZE,
      page: DEFAULT_PAGE,
      sort: "",
      batchId: "",
      classNameId: "",
      subjectId: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  }, [setFilter]);

  return (
    <div className="flex-1 flex items-center justify-between gap-x-3">
      <div className="flex-1 flex items-center gap-2">
        <FilterSelect
          value={filter.classNameId}
          onChange={handleClassChange}
          placeholder="Class"
          options={classOptions}
          className="max-w-[120px]"
        />
        <FilterSelect
          value={filter.batchId}
          onChange={handleBatchChange}
          placeholder="Batch"
          options={batchOptions}
          className="max-w-[120px]"
        />
        <FilterSelect
          value={filter.subjectId}
          onChange={handleSubjectChange}
          placeholder="Subject"
          options={subjectOptions}
          className="max-w-[120px]"
        />
        <FilterSelect
          value={filter.status}
          onChange={handleStatusChange}
          placeholder="Status"
          options={STATUS_OPTIONS}
          className="max-w-[120px]"
        />
        <FilterSelect
          value={filter.sort}
          onChange={handleSortChange}
          placeholder="Sort"
          options={SORT_OPTIONS}
          className="max-w-[120px]"
        />
        <FilterSelect
          value={""}
          onChange={handleLimitChange}
          placeholder="Limit"
          options={PAGE_SIZE_OPTIONS}
          className="max-w-[120px]"
        />
      </div>
      <div className="flex items-center gap-x-2">
        <ResetFilter hasModified={hasAnyModified} handleReset={handleClear} />
        <MobileFilter
          classes={classOptions}
          batches={batchOptions}
          subjects={subjectOptions}
        />
      </div>
    </div>
  );
};
