import { createFileRoute } from "@tanstack/react-router";
import { Swap } from "@/components/swap/swap";
import { getSwapChainsOptions, getSwapTokensOptions, getTokensPriceOptions } from "@/lib/api/options";
import { Suspense } from "react";

export const Route = createFileRoute("/")({
  component: SwapApp,
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.prefetchQuery(getSwapChainsOptions()),
      queryClient.prefetchQuery(getSwapTokensOptions()),
      queryClient.prefetchQuery(getTokensPriceOptions()),
    ]);
  },
});

function SwapApp() {
  return (
    <div className="flex justify-center items-center w-full min-h-screen p-4">
      <Suspense fallback={<div>Loading swap interface...</div>}>
        <Swap />
      </Suspense>
    </div>
  );
}
