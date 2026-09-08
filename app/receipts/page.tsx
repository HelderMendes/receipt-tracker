import PDFDropzone from "@/components/PDFDropzone";
import ReceiptList from "@/components/ReceiptList";
import React from "react";

export default function ReceiptsPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <PDFDropzone />
        <ReceiptList truncate={true} />
      </div>
    </div>
  );
}
