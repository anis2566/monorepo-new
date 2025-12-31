"use client";

import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table";
import { ListActions } from "@workspace/ui/shared/list-actions";
import { ListActionButton } from "@workspace/ui/shared/list-action-button";
import { Exam } from "@workspace/db";
import { ListActionLink } from "@/components/list-action-link";
import { useDeleteExam } from "@/hooks/use-exam";

interface ExamWithRelation extends Exam {
  classNames: {
    className: {
      name: string;
    };
  }[];
  subjects: {
    subject: {
      name: string;
    };
  }[];
  batches: {
    batch: {
      name: string;
    };
  }[];
  _count: {
    students: number;
  };
}

interface ExamListProps {
  exams: ExamWithRelation[];
}

export const ExamList = ({ exams }: ExamListProps) => {
  const { onOpen } = useDeleteExam();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead>Title</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Subjects</TableHead>
          <TableHead>Classes</TableHead>
          <TableHead>Batches</TableHead>
          <TableHead>CQ</TableHead>
          <TableHead>MCQ</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((examItem) => (
          <TableRow key={examItem.id} className="even:bg-muted">
            <TableCell>{examItem.title}</TableCell>
            <TableCell>{examItem.total}</TableCell>
            <TableCell>{examItem.subjects.length}</TableCell>
            <TableCell>{examItem.classNames.length}</TableCell>
            <TableCell>{examItem.batches.length}</TableCell>
            <TableCell>{examItem.cq}</TableCell>
            <TableCell>{examItem.mcq}</TableCell>
            <TableCell>{examItem.total}</TableCell>
            <TableCell>{examItem.duration}</TableCell>
            <TableCell>
              {format(examItem.startDate, "dd MMM yyyy hh:mm a")} -{" "}
              {format(examItem.endDate, "dd MMM yyyy hh:mm a")}
            </TableCell>
            <TableCell>{examItem._count.students}</TableCell>
            <TableCell>{examItem.status}</TableCell>
            <TableCell>
              <ListActions>
                <ListActionLink
                  title="Edit"
                  icon={Edit}
                  href={`/exam/edit/${examItem.id}`}
                />
                <ListActionButton
                  title="Delete"
                  icon={Trash2}
                  isDanger
                  onClick={() => onOpen(examItem.id)}
                />
              </ListActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
