"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import { getHomeContent } from "@/lib/home";
import { DEFAULT_HOME, type HomeContent } from "@/lib/home-defaults";

export const HOME_CONTENT_KEY = ["home"] as const;

const HomeContentContext = createContext<HomeContent>(DEFAULT_HOME);

export function HomeContentProvider({
  value,
  children,
}: {
  value: HomeContent;
  children: ReactNode;
}) {
  const { data } = useQuery({
    queryKey: HOME_CONTENT_KEY,
    queryFn: () => getHomeContent(),
    initialData: value,
    refetchInterval: 12_000,
    refetchOnWindowFocus: true,
  });
  return (
    <HomeContentContext.Provider value={data ?? DEFAULT_HOME}>
      {children}
    </HomeContentContext.Provider>
  );
}

export function useHomePage() {
  return useContext(HomeContentContext);
}
