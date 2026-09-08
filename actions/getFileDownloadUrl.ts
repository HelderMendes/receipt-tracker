"use server";

// Server action to get a file download URL from convex storage
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";

export async function getFileDownloadUrl(fileId: Id<"_storage"> | string) {
  try {
    // Get the download URL from Convex
    const downloadUrl = await convex.query(api.receipts.getReceiptDownloadUrl, {
      fileId: fileId as Id<"_storage">,
    });

    if (!downloadUrl) {
      throw new Error("Failed to get download URL");
    }

    return {
      success: true,
      downloadUrl,
    };
  } catch (error) {
    console.error("Error getting file download URL:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error error occurred",
    };
  }
}
