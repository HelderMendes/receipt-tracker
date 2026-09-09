"use client";

import {deleteReceipt} from "@/actions/deleteReceipt";
import { getFileDownloadUrl } from "@/actions/getFileDownloadUrl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { useQuery } from "convex/react";
import { ChevronLeft, FileText, Lightbulb, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Helper function to format file sizes
function formatFileSize(sizeBytes: number): string {
  if (sizeBytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(sizeBytes) / Math.log(k));

  return parseFloat((sizeBytes / k ** i).toFixed(2)) + " " + sizes[i];
}

// Helper function to format currency
function formatCurrency(amount: number, currency: string = ""): string {
  return `${amount.toFixed(2)}${currency ? ` ${currency}` : ""}`;
}

export default function ReceiptPage() {
  const params = useParams<{ id: string }>();
  const [receiptId, setReceiptId] = useState<Id<"receipts"> | null>(null);
  const router = useRouter();
  const isSummariesEnabled = useSchematicFlag("summaries");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);

  // Fetch the receipt details ID from the URL parameters
  const receipt = useQuery(
    api.receipts.getReceiptById,
    receiptId ? { id: receiptId } : "skip",
  );

  //Get the file download URL (for the view button)
  const fileId = receipt?.fileId;
  const downloadUrl = useQuery(
    api.receipts.getReceiptDownloadUrl,
    fileId ? { fileId } : "skip",
  );

  // Function to handle downloading the PDF using server action
  const handleDownload = async () => {
    if (!receipt || !receipt.fileId) return;

    try {
      setIsLoadingDownload(true);

      // Call the server action to get the download URL
      const result = await getFileDownloadUrl(receipt.fileId);

      if (!result.success) {
        throw new Error(result.error || "Failed to get download URL");
      }

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      if (result.downloadUrl) {
        link.href = result.downloadUrl;
        link.download = receipt.fileName || "receipt.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("No download URL found");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again later.");
    } finally {
      setIsLoadingDownload(true);
    }
  };

  // Function to handle deleting the receipt using server action
  const handleDeleteReceipt = async () => {
    if (!receiptId) return;

    if (
      window.confirm(
        "Are you sure you want to delete this receipt? This action cannot be undone."
      )
    ) {
      try {
        setIsDeleting(true);

        // Call the server action to delete the receipt
        const result = await deleteReceipt(receiptId);
        if (!result.success) {
          throw new Error(result.message || "Failed to delete receipt");
        }

        // Redirect to receipts list after deletion
        router.push("/receipts");
      } catch (error) {
        console.error("Error deleting receipt:", error);
        alert("Failed to delete receipt. Please try again later.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Convert the url string ID to a Convex ID type
  useEffect(() => {
    try {
      const id = params.id as Id<"receipts">;
      setReceiptId(id);
    } catch (error) {
      console.error("Invalid receipt ID:", error);
      router.push("/receipts");
    }
  }, [params.id, router]);

  if (receipt === null) {
    return (
      <div className="container mx-auto py-4 px-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="max-w-2xl font-bold mb-4">
            <h1>Receipt not found</h1>
            <p className="mb-6">
              The receipt you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link
              href="/"
              className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format upload date
  const uploadDate = receipt
    ? new Date(receipt.uploadedAt).toLocaleDateString()
    : "";

  // Check if receipt has extracted data
  const hasExtractedDate = !!(
    receipt?.merchantName ||
    receipt?.merchantAddress ||
    receipt?.transactionDate ||
    receipt?.transactionAmount
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6">
          <Link
            href="/receipts"
            className="text-purple-600 hover:underline flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Receipts
          </Link>
        </nav>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {receipt?.fileDisplayName || receipt?.fileName}
            </h1>
            <div className="flex items-center">
              {receipt?.status === "pending" ? (
                <div className="mr-2">
                  <div className="animate-spin rounded-full size-4 border-b-2 border-t-4 border-yellow-600 mx-4" />
                </div>
              ) : null}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  receipt && receipt.status === "processed"
                    ? "bg-purple-100 text-purple-800"
                    : " bg-red-100 text-red-800"
                }`}
              >
                {receipt &&
                  receipt.status.charAt(0).toUpperCase() +
                    receipt.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  File Information
                </h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm ">
                    <div>
                      <p className="text-gray-500">Uploaded</p>
                      <p className="font-medium text-gray-900">{uploadDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">File Size</p>
                      <p className="font-medium text-gray-900">
                        {formatFileSize(receipt?.size || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium text-gray-900">
                        {receipt?.mimeType}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">ID</p>
                      <p
                        className="font-medium text-gray-900 break-all"
                        title={receipt?._id}
                      >
                        {receipt?._id.slice(0, 12)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download */}
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              <div className="text-center">
                <FileText className="size-14 text-purple-600 mx-auto " />
                <p className="mt-1 text-gray-500">PDF preview</p>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-purple-500 text-white text-sm hover:bg-purple-700"
                  >
                    View PDF Document
                  </a>
                )}
              </div>
            </div>
          </div>
          {/* Extracted Data Section */}
          {hasExtractedDate && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Receipt Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Merchant Detail */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Merchant Information
                  </h4>
                  <div className="space-y-2">
                    {receipt.merchantName && (
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">
                          {receipt.merchantName}
                        </p>
                      </div>
                    )}
                    {receipt.merchantAddress && (
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{receipt.merchantAddress}</p>
                      </div>
                    )}
                    {receipt.merchantContact && (
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{receipt.merchantContact}</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Transaction Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Transaction Details
                  </h4>
                  <div className="space-y-2">
                    {receipt.transactionDate && (
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {receipt.transactionDate}
                        </p>
                      </div>
                    )}
                    {receipt.transactionAmount && (
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium text-gray-900">
                          {receipt.transactionAmount} {receipt.currency || ""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Receipt summary */}
              {isSummariesEnabled ? (
                <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-100 shadow-sm">
                  <div className="flex items-center mb-4">
                    <h4 className="text-lg font-medium text-purple-700">
                      AI Summary
                    </h4>
                  </div>
                  <div className="ml-2 flex">
                    <Sparkles className="size-3.5 text-yellow-500" />
                    <Sparkles className="size-3 text-yellow-500 -ml-1" />
                    {receipt.receiptSummary}
                  </div>
                  <div className="bg-white bg-opacity-60 p-4 border border-purple-100">
                    <p className="text-sm whitespace-pre-line leading-relaxed text-gray-700 ">
                      {receipt.receiptSummary}
                    </p>
                  </div>
                  <div className="mt-3 text-sm text-purple-600 italic flex items-center">
                    <Lightbulb className="size-3 mr-1" />
                    <span>AI-generated summary based on receipt data.</span>
                  </div>
                </div>
              ) : (
                <div className="mt-6 bg-gray-100 p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <h4 className="font-semibold text-gray-500">
                        AI Summary
                      </h4>
                      <div className="ml-2 flex">
                        <Sparkles className="size-3.5 text-gray-400" />
                        <Sparkles className="size-3 text-gray-300 -ml-1" />
                      </div>
                    </div>
                    <Lock className="size-4 text-gray-500" />
                  </div>
                  <div className="bg-white bg-opacity-50 p-4 border border-gray-200 flex flex-col items-center justify-center">
                    <Link href="/manage-plan" className="text-center py-2 ">
                      <Lock className="size-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-2 text-small">
                        AI summaries are available on Pro plan.
                      </p>
                      <button className="px-4 py-1.5 mt-2 bg-purple-50 text-white text-sm rounded hover:bg-purple-600 inline-block">
                        Upgrade to Unlock
                      </button>
                    </Link>
                  </div>

                  <div className="mt-3 text-sm text-gray-400 italic flex items-center">
                    <Lightbulb className="size-3 mr-1" />
                    <span className="">
                      Get AI-powered insights from your receipts
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Item section */}
          {receipt?.items && receipt.items.length > 0 && (
            <div className="mt-8">
              <h4 className="text-gray-700 font-medium mb-3">
                Items ({receipt.items.length})
              </h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipt.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {formatCurrency(item.UnitPrice, receipt.currency)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.totalPrice, receipt.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Action Sections */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                disabled={isLoadingDownload || !fileId}
                className={`px-4 py-2 border-gray-300 text-gray-700 rounded  transition-colors ${isLoadingDownload ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-50"}`}
              >
                {isLoadingDownload ? "Downloading..." : "Download PDF"}
              </button>
              <button
                className={`px-4 py-2 rounded text-sm ${isDeleting ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"} border transition-colors`}
                onClick={handleDeleteReceipt}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Receipt"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
