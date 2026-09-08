import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate URL that the client can use to upload a file directly to Convex's storage
    return await ctx.storage.generateUploadUrl();
  },
});

//Store a receipt file and add to the database
export const storeReceipt = mutation({
  args: {
    userId: v.string(),
    fileId: v.id("_storage"),
    fileName: v.string(),
    size: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert a new record in the "receipts" table
    const receiptId = await ctx.db.insert("receipts", {
      userId: args.userId,
      fileName: args.fileName,
      fileId: args.fileId,
      uploadedAt: Date.now(),
      size: args.size,
      mimeType: args.mimeType,
      status: "pending", // Initial status
      //Initialize other fields as null or empty
      merchantName: undefined,
      merchantAddress: undefined,
      merchantContact: undefined,
      transactionDate: undefined,
      transactionAmount: undefined,
      currency: undefined,
      items: [],
    });

    return receiptId;
  },
});

// Get all receipts for a user
export const getReceipts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("receipts")
      .filter((r) => r.eq(r.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

// Get a specific receipt by ID
export const getReceiptById = query({
  args: {
    id: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    //get receipt first
    const receipt = await ctx.db.get(args.id);

    // Verify that the user has access to this receipt
    if (receipt) {
      const identify = await ctx.auth.getUserIdentity();
      if (!identify) {
        throw new Error("Not authorized");
      }

      const userId = identify.subject;
      if (receipt.userId !== userId) {
        throw new Error("Not authorized to access this receipt");
      }
    }
    return receipt;
  },
});

// Store a receipt file and add to the database
export const getReceiptDownloadUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get a temporary download URL that can be used to download the file
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Update receipt status of a receipt
export const updateReceiptStatus = mutation({
  args: {
    id: v.id("receipts"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify that the user has access to this receipt
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    const identify = await ctx.auth.getUserIdentity();
    if (!identify) {
      throw new Error("Not authorized");
    }
    const userId = identify.subject;
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to access this receipt");
    }

    // Update the status
    await ctx.db.patch(args.id, { status: args.status });
    return true;
  },
});

// Delete a receipt ans its file
export const deleteReceipt = mutation({
  args: {
    id: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    // Get the receipt if exists
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    // Verify that the user has access to this receipt
    const identify = await ctx.auth.getUserIdentity();
    if (!identify) {
      throw new Error("Not authorized");
    }
    const userId = identify.subject;
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to access this receipt");
    }

    // Delete the file from storage
    await ctx.storage.delete(receipt.fileId);

    // Delete the receipt record from the database
    await ctx.db.delete(args.id);

    return true;
  },
});

// Update receipt with extracted data (for AI agent)
export const updateReceiptWithExtractedData = mutation({
  args: {
    id: v.id("receipts"),
    fileDisplayName: v.string(),
    merchantName: v.string(),
    merchantAddress: v.string(),
    merchantContact: v.string(),
    transactionDate: v.string(), // Store as ISO string
    transactionAmount: v.string(),
    currency: v.string(),
    receiptSummary: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        UnitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Verify that the user has access to this receipt
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    // Update the receipt with extracted data
    await ctx.db.patch(args.id, {
      fileDisplayName: args.fileDisplayName,
      merchantName: args.merchantName,
      merchantAddress: args.merchantAddress,
      merchantContact: args.merchantContact,
      transactionDate: args.transactionDate
        ? new Date(args.transactionDate).getTime()
        : undefined,
      transactionAmount: args.transactionAmount
        ? parseFloat(args.transactionAmount)
        : undefined,

      // transactionDate: args.transactionDate,
      // transactionAmount: args.transactionAmount,
      currency: args.currency,
      receiptSummary: args.receiptSummary,
      items: args.items,
      status: "processed", // Update status to processed
    });

    return { userId: receipt.userId };
  },
});
