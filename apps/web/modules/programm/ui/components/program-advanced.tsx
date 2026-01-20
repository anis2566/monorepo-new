"use client";

import { Info } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { UseFormReturn } from "@workspace/ui/components/form";

import { ProgramFormSchemaType } from "@workspace/schema";

interface ProgramAdvancedProps {
  form: UseFormReturn<ProgramFormSchemaType>;
  isPending: boolean;
}

export function ProgramAdvanced({ form, isPending }: ProgramAdvancedProps) {
  const programType = form.watch("type");

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50 border-muted">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">
                Advanced Configuration (Optional)
              </h4>
              <p className="text-sm text-muted-foreground">
                This step is optional. You can configure detailed syllabus, mock
                test plans, exam strategies, and FAQs. These can also be added
                later from the program management page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          {programType === "MEDICAL_ADMISSION" && (
            <>
              <TabsTrigger value="mocktest">Mock Tests</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
            </>
          )}
          {programType === "HSC_ACADEMIC" && (
            <TabsTrigger value="medical">Medical Topics</TabsTrigger>
          )}
          <TabsTrigger value="faq">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Program Type:</span>
                  <Badge variant="outline">
                    {programType === "SSC_FOUNDATION" && "SSC Foundation"}
                    {programType === "HSC_ACADEMIC" && "HSC Academic"}
                    {programType === "MEDICAL_ADMISSION" && "Medical Admission"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Features Added:</span>
                  <span className="font-medium">
                    {form.watch("features")?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Packages Created:
                  </span>
                  <span className="font-medium">
                    {form.watch("packages")?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subjects Selected:
                  </span>
                  <span className="font-medium">
                    {form.watch("subjectIds")?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Classes Selected:
                  </span>
                  <span className="font-medium">
                    {form.watch("classIds")?.length || 0}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> You can skip this step and add
                  detailed configuration later. The essential information has
                  already been captured in the previous steps.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syllabus">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  Detailed syllabus configuration will be available in the
                  program management page
                </p>
                <p className="text-sm text-muted-foreground">
                  You can add chapters, topics, marks, and priorities after
                  creating the program
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  Weekly schedule can be configured in the program management
                  page
                </p>
                <p className="text-sm text-muted-foreground">
                  Add class timings, subjects, and types after creating the
                  program
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {programType === "MEDICAL_ADMISSION" && (
          <>
            <TabsContent value="mocktest">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-2">
                      Mock test plan (16-week schedule) can be added later
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Configure week ranges, focus areas, test counts, and types
                      in the management page
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategies">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-2">
                      Exam strategies can be configured in the program
                      management page
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add strategy titles, descriptions, and icons after
                      creating the program
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        {programType === "HSC_ACADEMIC" && (
          <TabsContent value="medical">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">
                    Medical topics can be configured in the program management
                    page
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add Biology Mastery, Chemistry Excellence, and other
                    medical-focused topics later
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="faq">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                  FAQs can be added in the program management page
                </p>
                <p className="text-sm text-muted-foreground">
                  Add frequently asked questions and answers after creating the
                  program
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
