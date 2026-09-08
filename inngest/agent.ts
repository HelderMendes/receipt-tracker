import {
  anthropic,
  createNetwork,
  getDefaultRoutingAgent,
  openai,
} from "@inngest/agent-kit";
import { createServer } from "@inngest/agent-kit/server";
import { inngest } from "./client";
import Events from "./constants";
import { databaseAgent } from "./agents/databaseAgent";
import { receiptScanningAgent } from "./agents/receiptScanningAgents";

const agentNetwork = createNetwork({
  name: "Agent Team Network",
  agents: [databaseAgent, receiptScanningAgent],
  // defaultModel: anthropic({
  //   model: "claude-opus-4-1-20250805",
  //   defaultParameters: {
  //     max_tokens: 1000,
  //     temperature: 0.3,
  //   },
  // }),
  defaultModel: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 1000,
      temperature: 0.3,
    },
  }),
  defaultRouter: ({ network }) => {
    const savedToDatabase = network.state.kv.get("saved_to_database");

    if (savedToDatabase !== undefined) {
      // Terminate the agent process if the data has been saved to the database
      return undefined;
    }
    return getDefaultRoutingAgent();
  },
});

export const server = createServer({
  agents: [databaseAgent, receiptScanningAgent],
  networks: [agentNetwork],
});

export const extractAndSavePDF = inngest.createFunction(
  {
    id: "Extract PDF and Save in database",
    concurrency: 1, // Process one receipt at a time
    retries: 1, // Reduce retries to minimize duplicate calls
  },
  { event: Events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE },
  async ({ event }) => {
    const result = await agentNetwork.run(
      `Extract the relevant/key from the receipt PDF: ${event.data.url}. Once the data is extracted, save it to the database using the receiptId: ${event.data.receiptId}. Once successfully saved to the database you can terminate the agent process. Start with the Supervisor agent if and when there is one.`,
    );
    return result.state.kv.get("receipt");
  },
);
