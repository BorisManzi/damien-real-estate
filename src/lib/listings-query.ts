import { useQuery } from "@tanstack/react-query";
import {
  listClients,
  listLiveListings,
  listManagedListings,
  type ManagedListing,
} from "@/lib/catalog";
import type { Property } from "@/data/properties";

export const LIVE_LISTINGS_KEY = ["listings", "live"] as const;

const LIVE_POLL_MS = 12_000;

export function useLiveListingsQuery(initial?: Property[]) {
  return useQuery({
    queryKey: LIVE_LISTINGS_KEY,
    queryFn: () => listLiveListings(),
    initialData: initial,
    refetchInterval: LIVE_POLL_MS,
    refetchOnWindowFocus: true,
  });
}

export function useLiveListings(initial?: Property[]): Property[] {
  return useLiveListingsQuery(initial).data ?? [];
}

export function useManagedListingsQuery() {
  return useQuery({
    queryKey: ["listings", "all"],
    queryFn: () => listManagedListings(),
    refetchInterval: LIVE_POLL_MS,
    refetchOnWindowFocus: true,
  });
}

export function useManagedListings(): ManagedListing[] {
  return useManagedListingsQuery().data ?? [];
}

export function useClientsQuery() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => listClients(),
    refetchInterval: LIVE_POLL_MS,
    refetchOnWindowFocus: true,
  });
}
