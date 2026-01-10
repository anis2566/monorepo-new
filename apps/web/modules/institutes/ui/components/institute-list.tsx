"use client";

import {
  Building2,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Institute } from "@workspace/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { MobileDataCard } from "@workspace/ui/shared/mobile-data-card";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Input } from "@workspace/ui/components/input";

import { Pagination } from "./pagination";
import { useDeleteModal } from "@/hooks/use-delete-modal";
import { useGetInstitutes } from "../../filters/use-get-institutes";
import { useEditInstitute } from "@/hooks/use-institute";

interface InstituteWithRelations extends Institute {
  _count: {
    students: number;
  };
}

interface Props {
  institutes: InstituteWithRelations[];
  totalCount: number;
}

export const InstituteList = ({ institutes, totalCount }: Props) => {
  const [search, setSearch] = useState("");

  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useGetInstitutes();
  const { onOpen: openEditModal } = useEditInstitute();

  const debounceSearchValue = useDebounce(search, 500);

  useEffect(() => {
    setFilters({
      ...filters,
      search: debounceSearchValue,
    });
  }, [debounceSearchValue, setFilters, filters]);

  const { mutate: deleteInstitute } = useMutation(
    trpc.admin.institute.deleteOne.mutationOptions({
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
          queryKey: trpc.admin.institute.getMany.queryKey(),
        });
      },
    })
  );

  const handleDeleteInstitute = (
    instituteId: string,
    instituteName: string
  ) => {
    openDeleteModal({
      entityId: instituteId,
      entityType: "institute",
      entityName: instituteName,
      onConfirm: (id) => {
        deleteInstitute({ id });
      },
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            All Institutes ({totalCount})
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
                <TableHead>Institute Name</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutes.map((institute) => (
                <TableRow key={institute.id} className="py-5">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      {institute.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        {institute._count.students}
                      </Badge>
                    </div>
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
                            openEditModal(institute.id, institute.name)
                          }
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleDeleteInstitute(institute.id, institute.name)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
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
          {institutes.map((institute) => (
            <MobileDataCard key={institute.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <p className="font-medium">{institute.name}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {institute._count.students} Students
                  </Badge>
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
                        openEditModal(institute.id, institute.name)
                      }
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        handleDeleteInstitute(institute.id, institute.name)
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </MobileDataCard>
          ))}
        </div>

        {/* Pagination */}
        <Pagination totalCount={totalCount} />
      </CardContent>
    </Card>
  );
};
