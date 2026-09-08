"use client";

import uploadPDF from "@/actions/uploadPDF";
import { useUser } from "@clerk/clerk-react";
import {
  DndContext,
  useSensor,
  useSensors,
  // MouseSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { AlertCircle, CheckCircle, CloudUpload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export default function PDFDropzone() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useUser();
  const {
    value: isFeatureEnabled,
    featureUsageExceeded,
    // featureUsage,
    featureAllocation,
  } = useSchematicEntitlement("scans" /* feature id */);

  // console.log("isFeatureEnabled:", isFeatureEnabled);

  // const sensors = useSensors(useSensor(MouseSensor));

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      if (!user) {
        alert("You are not signed in, please sign in to upload files.");
        return;
      }

      const fileArray = Array.from(files);
      const pdfFiles = fileArray.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf"),
      );
      if (pdfFiles.length === 0) {
        alert("Please upload valid PDF files.");
        return;
      }
      setIsUploading(true);

      try {
        const newUploadedFiles: string[] = [];
        for (const file of pdfFiles) {
          const formData = new FormData();
          formData.append("file", file);

          // Call the server action to handle the upload
          const result = await uploadPDF(formData);

          if (
            typeof result !== "object" ||
            !("success" in result) ||
            !result.success
          ) {
            throw new Error(
              typeof result === "object" && "error" in result
                ? result.error
                : "Unknown error",
            );
          }

          newUploadedFiles.push(file.name);
        }

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);

        // clear uploaded files after 4 seconds
        setTimeout(() => {
          setUploadedFiles([]);
        }, 4000);

        router.push("/receipts" /* redirect to receipts page */);
      } catch (error) {
        console.error("Error uploading files:", error);
        alert(`There was an error uploading your files. Please try again.\n
${error instanceof Error ? error.message : "Unknown error"}
        `);
      } finally {
        setIsUploading(false);
      }
    },

    [user, router],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(false);
    },
    [],
  );

  const handleOnDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(false);

      // Handle file upload logic here
      if (!user) {
        alert("You are not signed in, please sign in to upload files.");
        return;
      }

      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        handleUpload(event.dataTransfer.files);
      }

      // console.log("Files dropped:", event.dataTransfer.files);
    },
    [user, handleUpload],
  );

  const isUserSignedIn = !!user;
  const canUpload = isUserSignedIn && isFeatureEnabled;

  return (
    <DndContext sensors={useSensors(useSensor(MouseSensor))}>
      <div className="w-full max-w-md mx-auto">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrop={canUpload ? handleOnDrop : undefined}
          className={`border-2 border-dashed  rounded-lg p-8 transition-colors ${isDraggingOver ? "border-purple-500 bg-purple-50" : "border-gray-300"} ${canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full border-4 border-b-4 border-t-2 border-s-purple-60000 h-12 w-12 mb-4">
                <p>Uploading...</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <CloudUpload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="mb-4 text-gray-600">
                {canUpload
                  ? "Drag and drop PDF files here, or"
                  : isUserSignedIn
                    ? "You have reached your upload limit."
                    : "Please sign in to upload files."}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!canUpload}
                className={`px-4 py-2 rounded-md text-white ${canUpload ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-400 cursor-not-allowed"}`}
              >
                {isUserSignedIn
                  ? featureUsageExceeded
                    ? "Upgrade to Upload"
                    : "Select PDF to Upload"
                  : "Sign in to Upload"}
              </button>
              <input
                type="file"
                accept="application/pdf,.pdf"
                multiple
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files) {
                    handleUpload(e.target.files);
                  }
                }}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="mt-4">
          {featureUsageExceeded && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">
                You have exceeded your limit of {featureAllocation} scans.
                <br />
                Please upgrade to continue uploading receipts.
              </span>
            </div>
          )}
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-lg rounded-md p-4">
          <h3 className="font-semibold mb-2">Uploaded Files:</h3>
          <ul>
            {uploadedFiles.map((fileName, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {fileName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </DndContext>
  );
}
