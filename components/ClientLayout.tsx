"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that should NOT show the navigation
  const noNavPages = ["/", "/landing", "/onboarding"];
  const showNav = !noNavPages.includes(pathname);

  return (
    <>
      {showNav && <Navigation />}
      {children}
    </>
  );
}
