"use client";

import { Edit, Trash2 } from "lucide-react";

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

import { useDeleteSubject, useEditSubject } from "@/hooks/use-subject";
import { Subject } from "@workspace/db";

interface SubjectWithRelation extends Subject {
  _count: {
    chapters: number;
  };
}

interface SubjectListProps {
  subjects: SubjectWithRelation[];
}

export const SubjectList = ({ subjects }: SubjectListProps) => {
  const { onOpen } = useDeleteSubject();
  const { onOpen: onEdit } = useEditSubject();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background/60">
          <TableHead>Name</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Chapters</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subjectItem) => (
          <TableRow key={subjectItem.id} className="even:bg-muted">
            <TableCell>{subjectItem.name}</TableCell>
            <TableCell>{subjectItem.level}</TableCell>
            <TableCell>{subjectItem._count.chapters}</TableCell>
            <TableCell>
              <ListActions>
                <ListActionButton
                  title="Edit"
                  icon={Edit}
                  onClick={() =>
                    onEdit(subjectItem.id, subjectItem.name, subjectItem.level)
                  }
                />
                <ListActionButton
                  title="Delete"
                  icon={Trash2}
                  isDanger
                  onClick={() => onOpen(subjectItem.id)}
                />
              </ListActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
