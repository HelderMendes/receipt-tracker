import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  // // demo
  // numbers: defineTable({
  //   value: v.number(),
  // }),
  // // end demo

  receipts: defineTable({
    userId: v.string(),
    fileName: v.string(),
    fileDisplayName: v.optional(v.string()),
    fileId: v.id("_storage"),
    uploadedAt: v.number(),
    size: v.number(),
    mimeType: v.string(),
    textContent: v.optional(v.string()),
    status: v.string(), // e.g., 'uploaded', 'processing', 'pending', 'processed', 'error'

    //Fields for extracted data
    merchantName: v.optional(v.string()),
    merchantAddress: v.optional(v.string()),
    merchantContact: v.optional(v.string()),
    transactionDate: v.optional(v.number()),
    transactionAmount: v.optional(v.number()),
    currency: v.optional(v.string()),
    receiptSummary: v.optional(v.string()),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        UnitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
  }),
});
