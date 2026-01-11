import { Mcq } from "@workspace/db";
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
import { Button } from "@workspace/ui/components/button";
import { FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Trash2, Edit, Eye } from "lucide-react";
import {
  MobileDataCard,
  MobileDataRow,
} from "@workspace/ui/shared/mobile-data-card";
import { Pagination } from "./pagination";
import { parseMathString } from "@/lib/katex";

interface McqWithRelation extends Mcq {
  subject: {
    name: string;
  };
  chapter: {
    name: string;
  };
}

interface McqListProps {
  mcqs: McqWithRelation[];
  totalCount: number;
}

export const McqList = ({ mcqs, totalCount }: McqListProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          All MCQs ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>References</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mcqs.map((mcq, index) => (
                <TableRow key={mcq.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{index + 1}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="truncate font-medium max-w-[200px] truncate">
                      {mcq.isMath
                        ? parseMathString(mcq.question)
                        : mcq.question}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                      Answer:{" "}
                      {mcq.isMath ? parseMathString(mcq.answer) : mcq.answer}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{mcq.subject.name}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {mcq.chapter.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {mcq.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {mcq.reference.map((reference) => reference).join(", ")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {mcqs.map((mcq, index) => (
            <MobileDataCard key={mcq.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                  <p className="text-xs text-muted-foreground font-mono mb-1">
                    #{index + 1}
                  </p>
                  <p className="font-medium text-sm line-clamp-2">
                    {mcq.question}
                  </p>
                  <p className="text-xs text-success mt-1">
                    Answer: {mcq.answer}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{mcq.subject.name}</Badge>
                <Badge variant="secondary" className="text-xs">
                  {mcq.type}
                </Badge>
              </div>
              <MobileDataRow label="Chapter" value={mcq.chapter.name} />
            </MobileDataCard>
          ))}
        </div>

        {/* Pagination */}
        <Pagination totalCount={totalCount} />
      </CardContent>
    </Card>
  );
};
