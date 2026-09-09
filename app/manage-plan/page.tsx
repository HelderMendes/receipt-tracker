import SchematicComponent from "@/components/schematic/SchematicComponent";
import React from "react";

export default function ManagePlanPage() {
  return (
    <div className="container mx-auto p-4 xl:max-w-5xl *:mx-auto md:p-0">
      <h1 className="text-2xl font-bold mb-4 my-8">Manage Your Plan</h1>
      <p className="text-gray-600 mb-8">
        Use the interface below to manage your subscription plan, update your
        payment method, and view your billing history.
      </p>
      <SchematicComponent
        componentId={
          process.env.NEXT_PUBLIC_SCHEMATIC_MANAGE_PLAN_COMPONENT_ID!
        }
      />
    </div>
  );
}
