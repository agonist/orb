import type { ReactNode } from "react";
import { DesktopNav } from "./Header";
import { Toaster } from "react-hot-toast";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <DesktopNav />

      <main className="flex flex-grow overflow-hidden pt-14">{children}</main>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 5000,
        }}
      />
    </div>
  );
};
