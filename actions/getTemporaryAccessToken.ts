"use server";

import { currentUser } from "@clerk/nextjs/server";

//Initialize Schematic SDK
import { SchematicClient } from "@schematichq/schematic-typescript-node";
import { NODATA } from "dns";
const apiKey = process.env.SCHEMATIC_API_KEY_SECRET!;
const client = new SchematicClient({ apiKey });

export async function getTemporaryAccessToken() {
  const user = await currentUser();
  if (!user) {
    console.log("No user found, cannot get user. Return NULL");
    return null;
  }

  console.log("Issuing temporary access token for user: ", user.id);

  const resp = await client.accesstokens.issueTemporaryAccessToken({
    resource_type: "company",
    lookup: { id: user.id },
  });

  if (resp.data === null) {
    throw new Error("Failed to issue temporary access token: " + NODATA);
  }

  const token = resp.data.token;
  console.log("Issued temporary access token: ", token);

  return token;
}
