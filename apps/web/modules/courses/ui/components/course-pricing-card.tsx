import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";

import { Course } from "@workspace/db";

interface CoursePricingCardProps {
  course: Course | undefined;
}

export const CoursePricingCard = ({ course }: CoursePricingCardProps) => {
  if (!course) {
    return null;
  }

  const formatPrice = (price: number) => `৳${price.toLocaleString()}`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            {formatPrice(Number(course.price))}
          </div>
          {Number(course.discount) > 0 && (
            <>
              <div className="text-base sm:text-lg text-muted-foreground line-through mt-1">
                {formatPrice(Number(course.originalPrice))}
              </div>
              <Badge className="mt-2 bg-green-500 text-white">
                {Number(course.discount)}% OFF
              </Badge>
            </>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            {course.pricingLifeCycle}
          </p>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Original Price</span>
            <span className="font-medium">
              {formatPrice(Number(course.originalPrice))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-green-600">
              {Number(course.discount)}%
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Final Price</span>
            <span className="text-primary">
              {formatPrice(Number(course.price))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
