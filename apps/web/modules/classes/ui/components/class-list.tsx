"use client";

import { MoreHorizontal, Users, Edit, Search, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import {
  MobileDataCard,
  MobileDataRow,
} from "@workspace/ui/shared/mobile-data-card";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { useGetClasses } from "../../filters/use-get-classes";

import { Pagination } from "./pagination";
import { ClassName } from "@workspace/db";
import { useDeleteModal } from "@/hooks/use-delete-modal";
import { useEditClass } from "@/hooks/use-class";

interface ClassWithRelation extends ClassName {
  _count: {
    students: number;
    batches: number;
  };
}

interface ClassListProps {
  classes: ClassWithRelation[];
  totalCount: number;
}

export const ClassList = ({ classes, totalCount }: ClassListProps) => {
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useGetClasses();
  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { onOpen: openEditModal } = useEditClass();

  const debounceSearchValue = useDebounce(search, 2000);

  useEffect(() => {
    setFilters({
      ...filters,
      search: debounceSearchValue,
    });
  }, [debounceSearchValue, setFilters, filters]);

  const { mutate: deleteClass } = useMutation(
    trpc.admin.class.deleteOne.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }

        toast.success(data.message);

        await queryClient.invalidateQueries({
          queryKey: trpc.admin.class.getMany.queryKey(),
        });
      },
    })
  );

  const handleDeleteClass = (classId: string, className: string) => {
    openDeleteModal({
      entityId: classId,
      entityType: "class",
      entityName: className,
      onConfirm: (id) => {
        deleteClass({ id });
      },
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            All Classes ({totalCount})
          </CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Batches</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {cls.description || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cls._count.students} students
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cls._count.batches} batches
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            openEditModal(
                              cls.id,
                              cls.name,
                              cls.description ?? ""
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClass(cls.id, cls.name)}
                        >
                          <Trash className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {classes.map((cls) => (
            <MobileDataCard key={cls.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{cls.name}</p>
                  {cls.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {cls.description}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        openEditModal(cls.id, cls.name, cls.description ?? "")
                      }
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <MobileDataRow
                label="Students"
                value={`${cls._count.students} students`}
              />
              <MobileDataRow
                label="Batches"
                value={`${cls._count.batches} batches`}
              />
            </MobileDataCard>
          ))}
        </div>

        {/* Pagination */}
        <Pagination totalCount={totalCount} />
      </CardContent>
    </Card>
  );
};
