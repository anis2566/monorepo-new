"use client";

import { Filter } from "lucide-react";
import { useState, useCallback } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import { FilterSelect } from "@workspace/ui/shared/filter-select";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_SORT_OPTIONS,
} from "@workspace/utils/constant";
import { ResetFilter } from "@workspace/ui/shared/reset-filter";
import { Separator } from "@workspace/ui/components/separator";

import { sessions } from "@workspace/utils";
import { useGetInstitutes } from "../../filters/use-get-institutes";

// Pre-compute static options outside component
const PAGE_SIZE_OPTIONS = Object.values(DEFAULT_PAGE_SIZE_OPTIONS).map((v) => ({
  label: v.toString(),
  value: v.toString(),
}));
const SORT_OPTIONS = Object.values(DEFAULT_SORT_OPTIONS);
const SESSION_OPTIONS = sessions.map((v) => ({
  label: v,
  value: v,
}));

export const MobileFilter = () => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useGetInstitutes();

  // Memoize the hasAnyModified check
  const hasAnyModified =
    !!filter.search ||
    filter.limit !== DEFAULT_PAGE_SIZE ||
    filter.page !== DEFAULT_PAGE ||
    filter.session !== "" ||
    !!filter.sort;

  // Fixed handlers - removed the extra useCallback wrapper
  const handleSortChange = useCallback(
    (value: string) => {
      try {
        setFilter({ sort: value });
      } catch (error) {
        console.error(`Error setting sort:`, error);
      } finally {
        setOpen(false);
      }
    },
    [setFilter]
  );

  const handleLimitChange = useCallback(
    (value: string) => {
      try {
        setFilter({ limit: parseInt(value, 10) });
      } catch (error) {
        console.error(`Error setting limit:`, error);
      } finally {
        setOpen(false);
      }
    },
    [setFilter]
  );

  const handleSessionChange = useCallback(
    (value: string) => {
      try {
        setFilter({ session: value });
      } catch (error) {
        console.error(`Error setting session:`, error);
      } finally {
        setOpen(false);
      }
    },
    [setFilter]
  );

  const handleClear = useCallback(() => {
    setFilter({
      search: "",
      limit: DEFAULT_PAGE_SIZE,
      page: DEFAULT_PAGE,
      session: "",
      sort: "",
    });
  }, [setFilter]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" className="rounded-xs md:hidden">
          <Filter />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>Filter</DrawerTitle>
        </DrawerHeader>
        <div className="flex items-center justify-between">
          <ResetFilter hasModified={hasAnyModified} handleReset={handleClear} />
          <DrawerClose asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Close
            </Button>
          </DrawerClose>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <FilterSelect
            value={filter.session}
            onChange={handleSessionChange}
            placeholder="Session"
            options={SESSION_OPTIONS}
            className="max-w-full"
            showInMobile
          />
          <FilterSelect
            value={filter.sort}
            onChange={handleSortChange}
            placeholder="Sort"
            options={SORT_OPTIONS}
            className="max-w-full"
            showInMobile
          />
          <FilterSelect
            value={filter.limit?.toString() || ""}
            onChange={handleLimitChange}
            placeholder="Limit"
            options={PAGE_SIZE_OPTIONS}
            className="max-w-full"
            showInMobile
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
