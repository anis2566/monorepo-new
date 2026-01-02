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

import { useDeleteClass, useEditClass } from "@/hooks/use-class";
import { ClassName } from "@workspace/db";

interface ClassNameWithRelation extends ClassName {
  //   _count: {
  //     batches: number;
  //     students: number;
  //   };
}

interface ClassListProps {
  classes: ClassName[];
}

export const ClassList = ({ classes }: ClassListProps) => {
  const { onOpen } = useDeleteClass();
  const { onOpen: onEdit } = useEditClass();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background/60">
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((classItem) => (
          <TableRow key={classItem.id} className="even:bg-muted">
            <TableCell>{classItem.name}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {classItem.description}
            </TableCell>
            <TableCell>{0}</TableCell>
            <TableCell>
              <ListActions>
                <ListActionButton
                  title="Edit"
                  icon={Edit}
                  onClick={() =>
                    onEdit(
                      classItem.id,
                      classItem.name,
                      classItem.description || undefined
                    )
                  }
                />
                <ListActionButton
                  title="Delete"
                  icon={Trash2}
                  isDanger
                  onClick={() => onOpen(classItem.id)}
                />
              </ListActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
