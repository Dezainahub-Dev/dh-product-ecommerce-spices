import type { ReactNode } from "react";
import { ToastContainer } from "@/components/toast-notification";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
