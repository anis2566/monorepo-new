"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { ListActionLink } from "@/components/list-action-link";

import { Student } from "@workspace/db";
import { useDeleteStudent } from "@/hooks/use-student";

interface StudentWithRelation extends Student {
  className: {
    name: string;
  };
  batch: {
    name: string;
  } | null;
  institute: {
    name: string;
  };
}

interface StudentListProps {
  students: StudentWithRelation[];
}

export const StudentList = ({ students }: StudentListProps) => {
  const { onOpen: onDeleteOpen } = useDeleteStudent();
  const router = useRouter();

  const handleView = (id: string) => router.push(`/student/${id}`);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background/60">
          <TableHead>Student</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>Institute</TableHead>
          <TableHead>Group</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>F. Phone</TableHead>
          <TableHead>M. Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow
            key={student.id}
            className="even:bg-muted cursor-pointer"
            onClick={() => handleView(student.id)}
          >
            <TableCell className="flex items-center gap-x-2">
              <Avatar>
                <AvatarImage src={student.imageUrl || ""} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {student.name}
                </p>
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  {student.nameBangla}
                </p>
                <p className="text-xs text-muted-foreground">
                  #{student.studentId}
                </p>
              </div>
            </TableCell>
            <TableCell>{student.className.name}</TableCell>
            <TableCell>{student.batch?.name || "-"}</TableCell>
            <TableCell>{student.institute.name}</TableCell>
            <TableCell>{student.group ? student.group : "-"}</TableCell>
            <TableCell>Batch</TableCell>
            <TableCell>{student.fPhone}</TableCell>
            <TableCell>{student.fPhone}</TableCell>
            <TableCell>Active</TableCell>
            {/* <TableCell>
              <Badge
                variant={
                  student.studentStatus?.status === STUDENT_STATUS.Present
                    ? "default"
                    : "destructive"
                }
                className="rounded-full"
              >
                {student.studentStatus?.status}
              </Badge>
            </TableCell> */}
            <TableCell>
              <ListActions>
                <ListActionLink
                  title="View"
                  href={`/student/${student.id}`}
                  icon={Eye}
                />
                <ListActionLink
                  title="Edit"
                  href={`/student/edit/${student.id}`}
                  icon={Edit}
                />
                <ListActionButton
                  isDanger
                  title="Delete"
                  icon={Trash2}
                  onClick={() => onDeleteOpen(student.id)}
                />
              </ListActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
