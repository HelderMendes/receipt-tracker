"use client";

import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { ChevronRight, FileText } from "lucide-react";

type ReceiptListProps = {
  truncate?: boolean;
};

export default function ReceiptList({ truncate = false }: ReceiptListProps) {
  const { userId } = useAuth();
  const receipts = useQuery(api.receipts.getReceipts, {
    userId: userId || "",
  });
  const router = useRouter();

  if (!userId) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-600">Please sign in to view your receipts.</p>
      </div>
    );
  }
  if (!receipts) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-spin rounded-full size-10 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading receipts...</p>
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="w-full p-8 text-center border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-100">
          No receipts found. Please upload a receipt.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pt-6">
      <h2 className="text-xl font-semibold mb-4">Your receipts</h2>
      {/* <div className="bg-white border border-gray-200 rounded-lg overflow-hidden"> */}
      <div className="overflow-hidden border border-gray-200 rounded-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-600 text-white ">
              <TableHead className="w-[40px] text-white"></TableHead>
              <TableHead className="min-w-[40%] text-white">Name</TableHead>
              <TableHead className="text-white min-w-[15%]">Uploaded</TableHead>
              <TableHead className="text-white">Size</TableHead>
              <TableHead className="text-white">Total</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white max-w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y text-sm">
            {receipts.map((receipt: Doc<"receipts">) => (
              <TableRow
                key={receipt._id}
                className="cursor-pointer hover:bg-purple-800 text-left text-[0.8rem]"
                onClick={() => router.push(`/receipt/${receipt._id}`)}
              >
                <TableCell className="p-2">
                  <FileText className="w-6 h-6 text-purple-600" />{" "}
                </TableCell>
                <TableCell>
                  {receipt.fileDisplayName || truncate
                    ? truncateFileName(receipt.fileName, 30)
                    : receipt.fileName}
                </TableCell>
                <TableCell>
                  {new Date(receipt.uploadedAt).toLocaleString()}
                </TableCell>
                <TableCell>{formatFileSize(receipt.size)}</TableCell>
                <TableCell>
                  {receipt.transactionAmount
                    ? `${receipt.currency || " "} ${receipt.transactionAmount}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${receipt.status === "pending" ? "bg-yellow-100 text-yellow-800" : receipt.status === "processed" ? "bg-purple-100 text-purple-800" : "bg-red-100 text-red-800"}`}
                  >
                    {receipt.status.charAt(0).toUpperCase() +
                      receipt.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right ">
                  <ChevronRight className="size-5 text-gray-400 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(sizeBytes) / Math.log(k));

  // return parseFloat((sizeBytes / k ** i).toFixed(2)) + " " + sizes[i];
  return parseFloat((sizeBytes / k ** i).toFixed(2)) + " " + sizes[i];
}

function truncateFileName(name: string, maxLength: number) {
  if (name.length <= maxLength) return name;

  const extIndex = name.lastIndexOf(".");
  const ext = extIndex !== -1 ? name.slice(extIndex) : "";
  const base = ext ? name.slice(0, extIndex) : name;

  const keep = Math.floor((maxLength - ext.length - 3) / 2);
  return base.slice(0, keep) + "..." + base.slice(-keep) + ext;
}
