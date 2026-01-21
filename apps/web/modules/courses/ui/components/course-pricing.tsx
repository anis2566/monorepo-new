"use client";

import { FormInput } from "@workspace/ui/shared/form-input";
import { FormSelect } from "@workspace/ui/shared/form-select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

import { CourseFormSchemaType } from "@workspace/schema";

interface CoursePricingProps {
  form: UseFormReturn<CourseFormSchemaType>;
}

const PRICING_LIFE_CYCLE_OPTION = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Course", value: "COURSE" },
];

export function CoursePricing({ form }: CoursePricingProps) {
  const price = form.watch("price");
  const originalPrice = form.watch("originalPrice");
  const discount = form.watch("discount");

  const calculateDiscount = (price: string, originalPrice: string) => {
    const p = parseFloat(price);
    const op = parseFloat(originalPrice);
    if (p && op && op > p) {
      return Math.round(((op - p) / op) * 100);
    }
    return 0;
  };

  const handlePriceChange = (priceValue: string) => {
    form.setValue("price", priceValue);
    if (originalPrice) {
      const calculatedDiscount = calculateDiscount(priceValue, originalPrice);
      form.setValue("discount", calculatedDiscount.toString());
    }
  };

  const handleOriginalPriceChange = (originalPriceValue: string) => {
    form.setValue("originalPrice", originalPriceValue);
    if (price) {
      const calculatedDiscount = calculateDiscount(price, originalPriceValue);
      form.setValue("discount", calculatedDiscount.toString());
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormInput
          name="price"
          label="Price"
          placeholder="e.g., 8000"
          type="number"
          onChange={(value) => handlePriceChange(value)}
        />

        <FormInput
          name="originalPrice"
          label="Original Price"
          placeholder="e.g., 10000"
          type="number"
          onChange={(value) => handleOriginalPriceChange(value)}
        />

        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Auto-calculated"
                  disabled
                  {...field}
                />
              </FormControl>
              <FormDescription>Auto-calculated</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormSelect
        name="pricingLifeCycle"
        label="Pricing Life Cycle"
        placeholder="Select pricing cycle"
        options={PRICING_LIFE_CYCLE_OPTION}
      />

      {/* Price Preview */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Price Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {price && (
              <span className="text-3xl font-bold text-primary">
                ৳{parseFloat(price).toLocaleString()}
              </span>
            )}
            {originalPrice &&
              parseFloat(originalPrice) > parseFloat(price || "0") && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ৳{parseFloat(originalPrice).toLocaleString()}
                  </span>
                  {discount && parseInt(discount) > 0 && (
                    <Badge variant="secondary" className="text-lg">
                      {discount}% OFF
                    </Badge>
                  )}
                </>
              )}
          </div>
          {form.watch("pricingLifeCycle") && (
            <p className="text-sm text-muted-foreground mt-2">
              per {form.watch("pricingLifeCycle").toLowerCase()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
