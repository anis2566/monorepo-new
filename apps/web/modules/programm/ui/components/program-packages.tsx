"use client";

import { useState } from "react";
import { Plus, Trash2, Star, X } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";
import { Switch } from "@workspace/ui/components/switch";
import { Separator } from "@workspace/ui/components/separator";

import { ProgramFormSchemaType } from "@workspace/schema";

interface ProgramPackagesProps {
  form: UseFormReturn<ProgramFormSchemaType>;
  isPending: boolean;
}

export function ProgramPackages({ form, isPending }: ProgramPackagesProps) {
  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    originalPrice: "",
    discount: "",
    features: [] as string[],
    description: "",
    isActive: true,
    isRecommended: false,
    displayBadge: "",
    headerColor: "",
    badgeColor: "",
    headerTextColor: "",
  });
  const [featureInput, setFeatureInput] = useState("");

  const addPackage = () => {
    if (newPackage.name && newPackage.price) {
      const currentPackages = form.getValues("packages") || [];
      form.setValue("packages", [...currentPackages, { ...newPackage }]);
      setNewPackage({
        name: "",
        price: "",
        originalPrice: "",
        discount: "",
        features: [],
        description: "",
        isActive: true,
        isRecommended: false,
        displayBadge: "",
        headerColor: "",
        badgeColor: "",
        headerTextColor: "",
      });
    }
  };

  const removePackage = (index: number) => {
    const currentPackages = form.getValues("packages") || [];
    form.setValue(
      "packages",
      currentPackages.filter((_: any, i: number) => i !== index),
    );
  };

  const addFeatureToNewPackage = () => {
    if (featureInput.trim()) {
      setNewPackage({
        ...newPackage,
        features: [...newPackage.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const removeFeatureFromNewPackage = (index: number) => {
    setNewPackage({
      ...newPackage,
      features: newPackage.features.filter((_, i) => i !== index),
    });
  };

  const calculateDiscount = (price: string, originalPrice: string) => {
    const p = parseFloat(price);
    const op = parseFloat(originalPrice);
    if (p && op && op > p) {
      return Math.round(((op - p) / op) * 100);
    }
    return 0;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeatureToNewPackage();
    }
  };

  const getHeaderColorPreview = (color: string) => {
    const colorMap: Record<string, string> = {
      "bg-primary": "bg-primary text-primary-foreground",
      "bg-muted": "bg-muted text-foreground",
      "bg-gradient-to-r from-orange-500 to-red-500":
        "bg-gradient-to-r from-orange-500 to-red-500 text-white",
      "bg-red-500": "bg-red-500 text-white",
      "bg-blue-500": "bg-blue-500 text-white",
      "bg-green-500": "bg-green-500 text-white",
    };
    return colorMap[color] || "bg-muted text-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Existing Packages */}
      <FormField
        control={form.control}
        name="packages"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Created Packages</FormLabel>
            {field.value && field.value.length > 0 ? (
              <div className="grid gap-4">
                {field.value.map((pkg: any, index: number) => (
                  <Card
                    key={index}
                    className={pkg.isRecommended ? "border-primary" : ""}
                  >
                    <CardHeader
                      className={`pb-3 ${getHeaderColorPreview(pkg.headerColor || "bg-muted")}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                            {pkg.name}
                            {pkg.isRecommended && (
                              <Badge className="bg-primary">
                                <Star className="h-3 w-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                            {pkg.displayBadge && (
                              <Badge
                                className={pkg.badgeColor || "bg-secondary"}
                              >
                                {pkg.displayBadge}
                              </Badge>
                            )}
                            {!pkg.isActive && (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </CardTitle>
                          {pkg.description && (
                            <p className="text-sm opacity-80 mt-1">
                              {pkg.description}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePackage(index)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            ৳{pkg.price}
                          </span>
                          {pkg.originalPrice && (
                            <>
                              <span className="text-lg text-muted-foreground line-through">
                                ৳{pkg.originalPrice}
                              </span>
                              <Badge variant="secondary">
                                {calculateDiscount(
                                  pkg.price,
                                  pkg.originalPrice,
                                )}
                                % OFF
                              </Badge>
                            </>
                          )}
                        </div>
                        {pkg.features && pkg.features.length > 0 && (
                          <div className="space-y-1">
                            {pkg.features.map(
                              (feature: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="text-sm text-muted-foreground flex items-center gap-2"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  {feature}
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  No packages added yet. Create your first package below.
                </p>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      {/* Add New Package */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold">Add New Package</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Package Name *</label>
            <Input
              placeholder="e.g., Basic, Standard, Premium"
              value={newPackage.name}
              onChange={(e) =>
                setNewPackage({ ...newPackage, name: e.target.value })
              }
              disabled={isPending}
              className="mt-1.5"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Price (৳) *</label>
            <Input
              type="number"
              placeholder="e.g., 8000"
              value={newPackage.price}
              onChange={(e) => {
                setNewPackage({ ...newPackage, price: e.target.value });
                if (newPackage.originalPrice) {
                  const discount = calculateDiscount(
                    e.target.value,
                    newPackage.originalPrice,
                  );
                  setNewPackage((prev) => ({
                    ...prev,
                    price: e.target.value,
                    discount: discount.toString(),
                  }));
                }
              }}
              disabled={isPending}
              className="mt-1.5"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Original Price (৳)</label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={newPackage.originalPrice}
              onChange={(e) => {
                setNewPackage({ ...newPackage, originalPrice: e.target.value });
                if (newPackage.price) {
                  const discount = calculateDiscount(
                    newPackage.price,
                    e.target.value,
                  );
                  setNewPackage((prev) => ({
                    ...prev,
                    originalPrice: e.target.value,
                    discount: discount.toString(),
                  }));
                }
              }}
              disabled={isPending}
              className="mt-1.5"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Discount (%)</label>
            <Input
              type="number"
              placeholder="Auto-calculated"
              value={newPackage.discount}
              disabled
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input
            placeholder="e.g., শুধু বোর্ড পরীক্ষার প্রস্তুতি"
            value={newPackage.description}
            onChange={(e) =>
              setNewPackage({ ...newPackage, description: e.target.value })
            }
            disabled={isPending}
            className="mt-1.5"
          />
        </div>

        {/* Display Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Display Badge</label>
            <Input
              placeholder="e.g., সেরা মূল্য, জনপ্রিয়"
              value={newPackage.displayBadge}
              onChange={(e) =>
                setNewPackage({ ...newPackage, displayBadge: e.target.value })
              }
              disabled={isPending}
              className="mt-1.5"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Badge Color</label>
            <Select
              value={newPackage.badgeColor}
              onValueChange={(value) =>
                setNewPackage({ ...newPackage, badgeColor: value })
              }
              disabled={isPending}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select badge color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="bg-primary">Primary</SelectItem>
                <SelectItem value="bg-orange-500">Orange</SelectItem>
                <SelectItem value="bg-red-500">Red</SelectItem>
                <SelectItem value="bg-blue-500">Blue</SelectItem>
                <SelectItem value="bg-green-500">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Header Color</label>
            <Select
              value={newPackage.headerColor}
              onValueChange={(value) =>
                setNewPackage({ ...newPackage, headerColor: value })
              }
              disabled={isPending}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select header color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bg-muted">Muted (Default)</SelectItem>
                <SelectItem value="bg-primary">Primary</SelectItem>
                <SelectItem value="bg-gradient-to-r from-orange-500 to-red-500">
                  Gradient (Orange to Red)
                </SelectItem>
                <SelectItem value="bg-red-500">Red</SelectItem>
                <SelectItem value="bg-blue-500">Blue</SelectItem>
                <SelectItem value="bg-green-500">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Header Text Color</label>
            <Select
              value={newPackage.headerTextColor}
              onValueChange={(value) =>
                setNewPackage({ ...newPackage, headerTextColor: value })
              }
              disabled={isPending}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select text color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="text-primary-foreground">
                  Primary Foreground
                </SelectItem>
                <SelectItem value="text-white">White</SelectItem>
                <SelectItem value="text-foreground">Foreground</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Package Features */}
        <div>
          <label className="text-sm font-medium">Package Features</label>
          <div className="flex gap-2 mt-1.5">
            <Input
              placeholder="Add a feature"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isPending}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addFeatureToNewPackage}
              disabled={isPending || !featureInput.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {newPackage.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {newPackage.features.map((feature, index) => (
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
                    onClick={() => removeFeatureFromNewPackage(index)}
                    disabled={isPending}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Is Active & Is Recommended */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Active Package</label>
              <p className="text-sm text-muted-foreground">
                Make this package available
              </p>
            </div>
            <Switch
              checked={newPackage.isActive}
              onCheckedChange={(checked) =>
                setNewPackage({ ...newPackage, isActive: checked })
              }
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Recommended</label>
              <p className="text-sm text-muted-foreground">
                Mark as recommended option
              </p>
            </div>
            <Switch
              checked={newPackage.isRecommended}
              onCheckedChange={(checked) =>
                setNewPackage({ ...newPackage, isRecommended: checked })
              }
              disabled={isPending}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addPackage}
          disabled={isPending || !newPackage.name || !newPackage.price}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </Button>
      </div>
    </div>
  );
}
