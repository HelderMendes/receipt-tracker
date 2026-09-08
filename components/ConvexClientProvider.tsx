"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  SchematicProvider,
  useSchematicEvents,
} from "@schematichq/schematic-react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const SchematicWrapper = ({ children }: { children: React.ReactNode }) => {
  const { identify } = useSchematicEvents();
  const { user } = useUser();

  useEffect(() => {
    const userName =
      user?.username ??
      user?.fullName ??
      user?.emailAddresses[0]?.emailAddress ??
      user?.id;

    if (user?.id) {
      identify({
        name: userName,
        keys: {
          id: user.id,
        },
        company: {
          keys: {
            id: user.id,
          },
          name: userName,
        },
      });
    }
  }, [user, identify]);

  return children;
};

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const schematicKey = process.env.NEXT_PUBLIC_SCHEMATIC_KEY!;
  if (!schematicKey) {
    throw new Error(
      "NEXT_PUBLIC_SCHEMATIC_KEY environment variable is not set.",
    );
  }
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <SchematicProvider publishableKey={schematicKey}>
        <SchematicWrapper>{children}</SchematicWrapper>
      </SchematicProvider>
    </ConvexProviderWithClerk>
  );
}
