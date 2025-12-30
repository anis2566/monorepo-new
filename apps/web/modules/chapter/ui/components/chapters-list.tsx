"use client";

import { Book, Edit, Trash2 } from "lucide-react";

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

import { useDeleteChapter, useEditChapter } from "@/hooks/use-chapter";
import { Chapter } from "@workspace/db";
import { ListActionLink } from "@/components/list-action-link";

interface ChapterWithRelation extends Chapter {
  subject: {
    name: string;
  };
}

interface ChapterListProps {
  chapters: ChapterWithRelation[];
}

export const ChapterList = ({ chapters }: ChapterListProps) => {
  const { onOpen } = useDeleteChapter();
  const { onOpen: onEdit } = useEditChapter();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-background/60">
          <TableHead>Name</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chapters.map((chapterItem) => (
          <TableRow key={chapterItem.id} className="even:bg-muted">
            <TableCell>{chapterItem.name}</TableCell>
            <TableCell>{chapterItem.subject.name}</TableCell>
            <TableCell>{chapterItem.position}</TableCell>
            <TableCell>
              <ListActions>
                <ListActionButton
                  title="Edit"
                  icon={Edit}
                  onClick={() =>
                    onEdit(
                      chapterItem.id,
                      chapterItem.name,
                      chapterItem.position.toString(),
                      chapterItem.subjectId,
                    )
                  }
                />
                <ListActionLink
                  title="MCQs"
                  href={`/chapter/${chapterItem.id}`}
                  icon={Book}
                />
                <ListActionLink
                  title="New MCQs"
                  href={`/chapter/${chapterItem.id}/new`}
                  icon={Book}
                />
                <ListActionButton
                  title="Delete"
                  icon={Trash2}
                  isDanger
                  onClick={() => onOpen(chapterItem.id)}
                />
              </ListActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
