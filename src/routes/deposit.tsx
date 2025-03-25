import { Deposit } from "@/components/deposit/deposit";
import { getDepositOptions, getTokensPriceOptions } from "@/lib/api/options";
import { createFileRoute } from "@tanstack/react-router";

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
    <div className="text-center flex justify-center items-center h-scrzeen">
      <Deposit />
    </div>
  );
}
