"use client";

import { UploadButton } from "@/lib/uploadthing";

// Import your specific FileRouter type from your app
// import { OurFileRouter } from "@/app/api/uploadthing/core"; 

interface CustomUploaderProps {
    endpoint: "imageUploader"; // or keyof OurFileRouter
    onSuccess?: (url: string) => void;
}

export function CustomUploader({ endpoint, onSuccess }: CustomUploaderProps) {
    return (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-8 border border-white/10">
            <UploadButton
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    console.log("Files: ", res);
                    if (res?.[0]) {
                        onSuccess?.(res[0].url);
                    }
                    alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
                /**
                 * This 'appearance' object maps the custom CSS classes 
                 * we defined in globals.css to the UploadThing elements.
                 */
                appearance={{
                    button: "ut-button",
                    allowedContent: "ut-allowed-content",
                    container: "flex-col gap-4",
                }}
                content={{
                    button({ ready, isUploading }) {
                        if (isUploading) return "Uploading...";
                        if (ready) return "Choose File";
                        return "Getting ready...";
                    },
                }}
            />
        </div>
    );
}