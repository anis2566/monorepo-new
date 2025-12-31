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

import { useDeleteBatch, useEditBatch } from "@/hooks/use-batch";
import { Batch } from "@workspace/db";

interface BatchWithRelation extends Batch {
  className: {
    name: string;
  };
  _count: {
    students: number;
  };
}

interface BatchListProps {
  batches: BatchWithRelation[];
}

export const BatchList = ({ batches }: BatchListProps) => {
  const { onOpen } = useDeleteBatch();
  const { onOpen: onEdit } = useEditBatch();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background/60">
          <TableHead>Name</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map((batchItem) => (
          <TableRow key={batchItem.id} className="even:bg-muted">
            <TableCell>{batchItem.name}</TableCell>
            <TableCell>{batchItem.className.name}</TableCell>
            <TableCell>{batchItem._count.students}</TableCell>
            <TableCell>
              <ListActions>
                <ListActionButton
                  title="Edit"
                  icon={Edit}
                  onClick={() =>
                    onEdit(batchItem.id, batchItem.name, batchItem.classNameId)
                  }
                />
                <ListActionButton
                  title="Delete"
                  icon={Trash2}
                  isDanger
                  onClick={() => onOpen(batchItem.id)}
                />
              </ListActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
