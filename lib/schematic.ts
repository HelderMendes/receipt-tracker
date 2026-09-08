import { SchematicClient } from "@schematichq/schematic-typescript-node";

if (!process.env.SCHEMATIC_API_KEY_SECRET) {
  throw new Error("SCHEMATIC_API_KEY is not set");
}

export const client = new SchematicClient({
  apiKey: process.env.SCHEMATIC_API_KEY_SECRET!,
  cacheProviders: {
    flagChecks: [],
  },
});
