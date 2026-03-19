// src/hooks/queries/outstandingQueries.js
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { outstandingService } from "@/api/services/outstanding.service";

export const outstandingQueryKeys = {
  party: (partyId, cmpId) => ["outstanding", "party", { partyId, cmpId }],
  partyInfinite: (partyId, cmpId, limit) => [
    "outstanding",
    "party",
    "infinite",
    { partyId, cmpId, limit },
  ],
};

export const usePartyOutstandingQuery = (partyId, cmpId, enabled = true) =>
  useQuery({
    queryKey: outstandingQueryKeys.party(partyId, cmpId),
    queryFn: ({ signal }) =>
      outstandingService.getPartyOutstanding({
        partyId,
        cmp_id: cmpId,
        signal,
        skipGlobalLoader: true,
      }),
    enabled: Boolean(partyId && cmpId) && enabled,
    staleTime: 30_000,
  });

export const useInfinitePartyOutstandingQuery = ({
  partyId,
  cmp_id,
  limit = 20,
  enabled = true,
}) =>
  useInfiniteQuery({
    queryKey: outstandingQueryKeys.partyInfinite(partyId, cmp_id, limit),
    queryFn: ({ pageParam = 1, signal }) =>
      outstandingService.getPartyOutstanding({
        partyId,
        cmp_id,
        page: pageParam,   // 👈 sends page
        limit,             // 👈 sends limit
        signal,
        skipGlobalLoader: true,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? (lastPage?.page || 1) + 1 : undefined,
    enabled: Boolean(partyId && cmp_id) && enabled,
  });

