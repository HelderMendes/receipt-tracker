"use server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";
import { getFileDownloadUrl } from "./getFileDownloadUrl";
import Events from "@/inngest/constants";
import { inngest } from "@/inngest/client";

async function uploadPDF(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    // return new Response("You are not signed in, please sign in to upload files.", {status: 401});
    return {
      success: false,
      error: "You are not authorized... please sign in first ",
      status: 401,
    };
  }

  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }
    if (
      !file.type.includes("pdf") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return {
        success: false,
        error: "Invalid file type. Please upload a PDF.",
      };
    }

    //Convex API call to upload the file
    const uploadUrl = await convex.mutation(api.receipts.generateUploadUrl, {});

    // Convert file to ArrayBuffer for fetch API
    const arrayBuffer = await file.arrayBuffer();

    // Upload the file to Convex's storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status ${uploadResponse.statusText}`);
    }

    // Get storage ID from the response
    const { storageId } = await uploadResponse.json();
    // if (!storageId) {
    //   throw new Error("Upload failed: No storage ID returned");
    // }

    // Store file metadata in the database (manipulate as needed)
    const receiptId = await convex.mutation(api.receipts.storeReceipt, {
      userId: user.id,
      fileId: storageId,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });

    // Generate the file URL for access
    const fileUrl = await getFileDownloadUrl(storageId);

    // Check if receipt is already being processed to avoid duplicate API calls
    const existingReceipt = await convex.query(api.receipts.getReceiptById, {
      id: receiptId,
    });

    // Only trigger AI processing if not already processed/processing
    if (existingReceipt?.status === "pending") {
      // Check if Inngest is enabled
      if (process.env.ENABLE_INNGEST === "true") {
        // Trigger inngest agent flow...
        await inngest.send({
          name: Events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
          data: {
            url: fileUrl.downloadUrl,
            receiptId,
          },
        });
      } else {
        console.log("Inngest disabled - skipping AI processing");
      }
    }

    return {
      success: true,
      data: {
        receiptId,
        fileName: file.name,
      },
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Upload failed due to unknown error",
    };
  }

  return true;
}

export default uploadPDF;
