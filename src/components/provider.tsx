import { createConfig, http, WagmiProvider } from "wagmi";
import { sonic, mainnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { AppLayout } from "./layout";

const queryClient = new QueryClient();

const config = createConfig(
  getDefaultConfig({
    chains: [sonic, mainnet],
    transports: {
      [sonic.id]: http(),
      [mainnet.id]: http(),
    },
    walletConnectProjectId: "44c3b415a49d0347962c3d037072782f",
    appName: "Orb",
    appDescription: "Orb",
  })
);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <AppLayout>{children}</AppLayout>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
