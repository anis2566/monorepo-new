"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";

interface CloudinaryUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  folder?: string;
  maxFileSize?: number;
  acceptedFormats?: string[];
  width?: number;
  height?: number;
  className?: string;
}

export function CloudinaryUpload({
  value,
  onChange,
  disabled = false,
  folder = "uploads",
  maxFileSize = 5000000, // 5MB
  acceptedFormats = ["jpg", "jpeg", "png", "webp"],
  width = 200,
  height = 200,
  className,
}: CloudinaryUploadProps) {
  // Manually load env variables with fallback values
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  if (!cloudName) {
    console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined");
    return (
      <div className="text-red-500 text-sm p-4 border border-red-300 rounded">
        Cloudinary Cloud Name is not configured. Please set
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env file.
      </div>
    );
  }

  if (!uploadPreset) {
    console.error("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not defined");
    return (
      <div className="text-red-500 text-sm p-4 border border-red-300 rounded">
        Cloudinary Upload Preset is not configured. Please set
        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file.
      </div>
    );
  }

  return (
    <div className={className}>
      {value ? (
        <div className="relative inline-block group">
          <Image
            src={value}
            alt="Uploaded image"
            width={width}
            height={height}
            className="rounded-lg object-cover border border-border shadow-sm"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              onChange("");
              toast.info("Image removed");
            }}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={uploadPreset}
          onSuccess={(result: any) => {
            const imageUrl = result?.info?.secure_url;
            if (imageUrl) {
              onChange(imageUrl);
              toast.success("Image uploaded successfully!");
            }
          }}
          onError={(error: any) => {
            toast.error(`Upload failed: ${error?.message || "Unknown error"}`);
          }}
          options={{
            folder,
            maxFiles: 1,
            resourceType: "image",
            clientAllowedFormats: acceptedFormats,
            maxImageFileSize: maxFileSize,
            cropping: false,
            multiple: false,
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              onClick={() => open()}
              disabled={disabled}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
