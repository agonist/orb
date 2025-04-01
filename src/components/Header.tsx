import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CustomConnectButton } from "./custom-wallet-connect";

const menu = [
  { name: "Deposit", path: "/deposit" },
  { name: "Redeem", path: "/redeem" },
  { name: "Stake", path: "/stake" },
];

export const DesktopNav = () => {
  return (
    <header className="fixed top-0 w-full h-14 flex items-center justify-between backdrop-blur-md z-10">
      <div className="flex items-center justify-between w-full h-14 mx-4 px-4">
        <div className="flex items-center">
          <Link className="text-xl" to="/">
            Orb
          </Link>

          <div className="flex pl-16 gap-8 uppercase">
            {menu.map((item) => (
              <Link
                key={item.name}
                className={cn("text-sm")}
                to={item.path}
                activeProps={{ className: "text-teal-300" }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 ">
          <CustomConnectButton />{" "}
        </div>
      </div>
    </header>
  );
};
