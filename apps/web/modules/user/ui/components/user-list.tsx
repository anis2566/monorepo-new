"use client";

import { Trash2 } from "lucide-react";

import { ListActions } from "@workspace/ui/shared/list-actions";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table";
import { ListActionButton } from "@workspace/ui/shared/list-action-button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

import { User } from "@workspace/db";
import { useDeleteUser } from "@/hooks/use-user";

interface UserWithRelation extends User {
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
  users: UserWithRelation[];
}

export const UserList = ({ users }: UserListProps) => {
  const { onOpen } = useDeleteUser();
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="even:bg-muted cursor-pointer"
            // onClick={() => handleView(user.id)}
          >
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell className="flex items-center gap-x-2">
              <Avatar>
                <AvatarImage src={user.student?.imageUrl || ""} />
                <AvatarFallback>{user.student?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {user.student?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  #{user.student?.studentId}
                </p>
              </div>
            </TableCell>
            <TableCell>{user.student?.className.name}</TableCell>
            <TableCell>
              <ListActions>
                <ListActionButton
                  isDanger
                  title="Delete"
                  icon={Trash2}
                  onClick={() => onOpen(user.id)}
                />
              </ListActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
