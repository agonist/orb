import { Deposit } from "@/components/deposit/deposit";
import { DepositHelp } from "@/components/deposit/deposti-help";
import { getDepositOptions, getTokensPriceOptions } from "@/lib/api/options";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="flex justify-center items-center w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex gap-4">
          <Deposit onHelpClick={() => setIsHelpOpen(!isHelpOpen)} />

          <AnimatePresence>
            {isHelpOpen && (
              <motion.div
                className="flex"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <DepositHelp />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Suspense>
    </div>
  );
}
