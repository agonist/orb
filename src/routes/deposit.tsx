import { Deposit } from "@/components/deposit/deposit";
import { getDepositOptions, getTokensPriceOptions } from "@/lib/api/options";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/deposit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.prefetchQuery(getDepositOptions()),
      queryClient.prefetchQuery(getTokensPriceOptions()),
    ]);
  },
});

function RouteComponent() {
  return (
    <div className="flex justify-center items-center w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Deposit />
      </Suspense>
    </div>
  );
}
