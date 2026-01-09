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

import { useDeleteInstitute, useEditInstitute } from "@/hooks/use-institute";
import { ClassName, Institute } from "@workspace/db";

interface ClassNameWithRelation extends ClassName {
  //   _count: {
  //     batches: number;
  //     students: number;
  //   };
}

interface InstituteListProps {
  institutes: Institute[];
}

export const InstituteList = ({ institutes }: InstituteListProps) => {
  const { onOpen } = useDeleteInstitute();
  const { onOpen: onEdit } = useEditInstitute();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background/60">
          <TableHead>Name</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {institutes.map((instituteItem) => (
          <TableRow key={instituteItem.id} className="even:bg-muted">
            <TableCell>{instituteItem.name}</TableCell>
            <TableCell>{0}</TableCell>
            <TableCell>
              <ListActions>
                <ListActionButton
                  title="Edit"
                  icon={Edit}
                  onClick={() => onEdit(instituteItem.id, instituteItem.name)}
                />
                <ListActionButton
                  title="Delete"
                  icon={Trash2}
                  isDanger
                  onClick={() => onOpen(instituteItem.id)}
                />
              </ListActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
