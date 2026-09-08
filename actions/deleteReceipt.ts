"use server";

// server action to delete a receipt by its ID
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";

export async function deleteReceipt(receiptId: string) {
  try {
    await convex.mutation(api.receipts.deleteReceipt, {
      id: receiptId as Id<"receipts">,
    });
    return { success: true, message: "Receipt deleted successfully" };
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An Unknown error as occurred",
    };
  }
}
