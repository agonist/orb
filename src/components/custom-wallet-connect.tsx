import { ConnectKitButton } from "connectkit";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
  isBig?: boolean;
  className?: string;
};

export const CustomConnectButton = ({ isBig = false, className }: Props) => {
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        if (isConnected) {
          return (
            <Button onClick={show} variant={"outline"} className={className}>
              {ensName || (address ? shortenAddress(address) : "")}
            </Button>
          );
        }

        if (!isConnected && !isBig) {
          return (
            <Button onClick={show} className={cn(className, "")}>
              CONNECT WALLET
            </Button>
          );
        }

        return (
          <Button onClick={show} variant={"outline"} className={className}>
            CONNECT WALLET
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
