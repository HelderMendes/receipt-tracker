import { createAgent, createTool } from "@inngest/agent-kit";
import { anthropic, openai } from "inngest";
import z from "zod";

const parsedPdfTool = createTool({
  name: "parsed_pdf",
  description: "Analyzes the given PDF",
  parameters: z.object({
    pdfUrl: z.string(),
  }),
  handler: async ({ pdfUrl }, { step }) => {
    try {
      return await step?.ai.infer("parse_pdf", {
        // model: anthropic({
        //   model: "claude-opus-4-1-20250805",
        //   defaultParameters: {
        //     max_tokens: 3094,
        //   },
        // }),
        model: openai({
          model: "gpt-4o-mini",
          defaultParameters: {
            max_completion_tokens: 1000,
            temperature: 0.3,
          },
        }),

        body: {
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "document",
                  source: {
                    type: "url",
                    url: pdfUrl,
                  },
                },
                {
                  type: "text",
                  text: `Extract the data from the receipt PDF and return the structured output as follows:
        {
          "merchant": {
            "name": "Store Name",
            "address": "Oostzaanstraat 74, postal code, city, country",
            "contact": "Phone number, email, website"
          },
          "transaction": {
            "date": "DD-MM-YYYY",
            "receipt_number": "ABC123456",
            "payment_method": "Credit Card, Bank Transfer, Cash"
          },
          "items": [
            {
              "name": "Item 1",
              "quantity": 2,
              "unit_price": 12.34,
              "total_price": 24.68
            }
          ],
          "totals": {
            "subtotal": 50.00,
            "tax": 5.00,
            "total": 55.00,
            "currency": "EUR"
          }
        }`,
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error in parsedPdfTool handler:", error);
      throw error;
    }
  },
});

export const receiptScanningAgent = createAgent({
  name: "Receipt Scanning Agent",
  description:
    "Processes receipt images and PDFs to extract key information such as vendor names, dates, amounts and items purchased.",
  system: `You are a helpful AI-powered receipt scanning assistant. 
  Your primary role is to accurately extract and structure relevant information from scanned receipts. Your task includes recognizing and parsing details such as:
  . Merchant Information: Store name, address, contact details;
  . Transaction Details: Date, time, receipt number, contact details;
  . Itemized Purchases: Product names, quantities, individual prices, discounts;
  . Total Amounts: Subtotal, taxes, total amount paid anf any applied discounts, method of payment;
  . Ensure hight accuracy by detecting OCR errors and ambiguities, and correcting them where possible.
  . Normalize dates into DD-MM-YYYY format, amounts into decimal format (e.g., 12.34), currency into standard three-letter codes (e.g., EUR, GBP, USD) and format for consistency;
  . If any key details are missing or unclear, return a structured response indicating the missing information;
  . Handle multiple formats, languages, and varying receipt layouts effectively;
  . Maintain a structured JSON output for easy integration with databases or expense tracking systems. 
`,
  model: openai({
    model: "gpt-4o-mini", // Much cheaper than gpt-4.1
    defaultParameters: {
      max_completion_tokens: 1000, // Reduced from 3094
    },
  }),
  tools: [parsedPdfTool],
});
