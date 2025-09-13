"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const url = pathname + searchParams.toString();
    window.gtag?.("config", process.env.NEXT_PUBLIC_GA_ID as string, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}
