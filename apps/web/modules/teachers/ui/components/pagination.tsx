"use client";

import { DataTablePagination } from "@workspace/ui/shared/data-table-pagination";

import { useGetTeachers } from "../../filters/use-get-teachers";

interface PaginationProps {
  totalCount: number;
}

export const Pagination = ({ totalCount }: PaginationProps) => {
  const [filters, setFilters] = useGetTeachers();

  const totalPages = Math.ceil(totalCount / filters.limit);

  const startIndex = (filters.page - 1) * filters.limit;
  const endIndex = startIndex + filters.limit;

  const totalItems = Math.min(endIndex, totalCount);

  const setCurrentPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const goToNextPage = () => {
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const goToPreviousPage = () => {
    setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const goToFirstPage = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const goToLastPage = () => {
    setFilters((prev) => ({ ...prev, page: totalPages }));
  };

  const setPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, limit: pageSize }));
  };

  return (
    <DataTablePagination
      currentPage={filters.page}
      totalPages={totalPages}
      startIndex={startIndex}
      endIndex={endIndex}
      totalItems={totalItems}
      onPageChange={setCurrentPage}
      onNextPage={goToNextPage}
      onPreviousPage={goToPreviousPage}
      onFirstPage={goToFirstPage}
      onLastPage={goToLastPage}
      pageSize={filters.limit}
      onPageSizeChange={setPageSize}
    />
  );
};
