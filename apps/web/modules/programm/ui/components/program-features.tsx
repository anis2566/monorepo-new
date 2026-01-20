"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";

import { ProgramFormSchemaType } from "@workspace/schema";
import { cn } from "@workspace/ui/lib/utils";

interface ProgramFeaturesProps {
  form: UseFormReturn<ProgramFormSchemaType>;
}

export function ProgramFeatures({ form }: ProgramFeaturesProps) {
  const [featureInput, setFeatureInput] = useState("");

  const addFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = form.getValues("features") || [];
      form.setValue("features", [...currentFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue(
      "features",
      currentFeatures.filter((_: string, i: number) => i !== index),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Program Features</FormLabel>
            <FormDescription>
              Add key features and benefits of this program
            </FormDescription>

            <div className="flex gap-2">
              <Input
                placeholder="e.g., ১৫০+ লাইভ ক্লাস"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant={featureInput.trim() ? "default" : "outline"}
                size="icon"
                onClick={addFeature}
                disabled={!featureInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {field.value && field.value.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">Added Features:</p>
                <div className="flex flex-wrap gap-2">
                  {field.value.map((feature: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-1 pr-1 py-1"
                    >
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="text-sm font-medium mb-2">Feature Suggestions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "২০০+ লাইভ ক্লাস",
            "সাপ্তাহিক পরীক্ষা",
            "PDF নোটস",
            "রেকর্ডেড ক্লাস",
            "MCQ Practice",
            "২৪/৭ সাপোর্ট",
            "মাসিক প্রগ্রেস রিপোর্ট",
            "Mock Test সিরিজ",
          ].map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "justify-start text-xs h-auto py-2 hover:bg-primary hover:text-primary-foreground",
                (form.watch("features") || []).includes(suggestion)
                  ? "pointer-events-none bg-muted text-muted-foreground"
                  : "",
              )}
              onClick={() => {
                const currentFeatures = form.getValues("features") || [];
                if (!currentFeatures.includes(suggestion)) {
                  form.setValue("features", [...currentFeatures, suggestion]);
                }
              }}
              disabled={(form.getValues("features") || []).includes(suggestion)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
