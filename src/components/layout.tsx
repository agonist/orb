import type { ReactNode } from "react";
import { DesktopNav } from "./Header";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <DesktopNav />

      <main className="flex flex-grow overflow-hidden pt-14">{children}</main>
    </div>
  );
};
