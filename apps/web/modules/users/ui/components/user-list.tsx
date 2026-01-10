"use client";

import { Mail, Shield, UserCheck, MoreHorizontal, Users } from "lucide-react";
import { format } from "date-fns";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
import { User } from "@workspace/db";
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

import { Pagination } from "./pagination";
import { useDeleteModal } from "@/hooks/use-delete-modal";
import { useChangeRole } from "@/hooks/use-user";

interface UserWithRelations extends User {
  student: {
    name: string;
    studentId: string;
    imageUrl: string | null;
    className: {
      name: string;
    };
  } | null;
}

interface UserListProps {
  users: UserWithRelations[];
  totalCount: number;
}

const roleColors: Record<string, string> = {
  Admin: "bg-primary/10 text-primary border-primary/20",
  Teacher: "bg-accent/10 text-accent border-accent/20",
  User: "bg-muted text-muted-foreground border-border",
};

export const UserList = ({ users, totalCount }: UserListProps) => {
  const { openDeleteModal } = useDeleteModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { onOpen: openChangeRoleModal } = useChangeRole();

  const { mutate: deleteStudent } = useMutation(
    trpc.admin.student.deleteOne.mutationOptions({
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
          queryKey: trpc.admin.user.getMany.queryKey(),
        });
      },
    })
  );

  const handleDeleteUser = (userId: string, userName: string) => {
    openDeleteModal({
      entityId: userId,
      entityType: "user",
      entityName: userName,
      onConfirm: (id) => {
        deleteStudent(id);
      },
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            All Users ({totalCount})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="py-5">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.phone || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleColors[user.role]}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isVerifiedStudent ? (
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success border-success/20"
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-warning/10 text-warning border-warning/20"
                      >
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(user.createdAt, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openChangeRoleModal(
                              user.id,
                              user.role,
                              user.email,
                              user.name ?? undefined,
                              user.image ?? undefined
                            )
                          }
                        >
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleDeleteUser(user.id, user.name ?? "")
                          }
                        >
                          Delete User
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
          {users.map((user) => (
            <MobileDataCard key={user.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteUser(user.id, user.name ?? "")}
                    >
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className={roleColors[user.role]}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
                {user.emailVerified ? (
                  <Badge
                    variant="outline"
                    className="bg-success/10 text-success border-success/20"
                  >
                    <UserCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-warning/10 text-warning border-warning/20"
                  >
                    Pending
                  </Badge>
                )}
              </div>
              <MobileDataRow label="Phone" value={user.phone || "-"} />
              <MobileDataRow
                label="Joined"
                value={format(user.createdAt, "MMM d, yyyy")}
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
