"use client";
import { createContext, useContext, useState } from "react";

type SearchCtx = { query: string; setQuery: (v: string) => void };
const Ctx = createContext<SearchCtx | null>(null);

export function useSearch() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSearch must be used within <Providers>");
  return v;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  return <Ctx.Provider value={{ query, setQuery }}>{children}</Ctx.Provider>;
}
