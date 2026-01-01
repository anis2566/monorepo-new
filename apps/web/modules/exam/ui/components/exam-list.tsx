"use client";

import { Edit, FileQuestionIcon, Trash2 } from "lucide-react";
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
import { Badge } from "@workspace/ui/components/badge";
import { EXAM_STATUS } from "@workspace/utils/constant";

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

const getExamStatus = (status: string) => {
  switch (status) {
    case EXAM_STATUS.Pending:
      return "outline";
    case EXAM_STATUS.Upcoming:
      return "secondary";
    case EXAM_STATUS.Ongoing:
      return "default";
    default:
      return "destructive";
  }
};

export const ExamList = ({ exams }: ExamListProps) => {
  const { onOpen } = useDeleteExam();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead>Title</TableHead>
          <TableHead>Subjects</TableHead>
          <TableHead>Classes</TableHead>
          <TableHead>Batches</TableHead>
          <TableHead>CQ</TableHead>
          <TableHead>MCQ</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>N. Marking</TableHead>
          <TableHead>N. Marking Value</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((examItem) => (
          <TableRow key={examItem.id} className="even:bg-muted">
            <TableCell>{examItem.title}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {examItem.subjects
                .map((subject) => subject.subject.name)
                .join(", ")}
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {examItem.classNames
                .map((className) => className.className.name)
                .join(", ")}
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {examItem.batches.map((batch) => batch.batch.name).join(", ")}
            </TableCell>
            <TableCell>{examItem.cq}</TableCell>
            <TableCell>{examItem.mcq}</TableCell>
            <TableCell>{examItem.total}</TableCell>
            <TableCell>{examItem.duration}</TableCell>
            <TableCell>
              {format(examItem.startDate, "dd MMM hh:mm a")} -{" "}
              {format(examItem.endDate, "dd MMM hh:mm a")}
            </TableCell>
            <TableCell>
              <Badge
                variant={examItem.hasNegativeMark ? "default" : "destructive"}
              >
                {examItem.hasNegativeMark ? "Yes" : "No"}
              </Badge>
            </TableCell>
            <TableCell>{examItem.negativeMark}</TableCell>
            <TableCell>{examItem._count.students}</TableCell>
            <TableCell>
              <Badge variant={getExamStatus(examItem.status)}>
                {examItem.status}
              </Badge>
            </TableCell>
            <TableCell>
              <ListActions>
                <ListActionLink
                  title="Edit"
                  icon={Edit}
                  href={`/exam/edit/${examItem.id}`}
                />
                <ListActionLink
                  title="Assign Question"
                  icon={FileQuestionIcon}
                  href={`/exam/${examItem.id}/question`}
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
