import { queryOptions, useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../shared/config/api';
import { fetchAuctionDetail, fetchAuctionsList } from './api';
import { fetchAuctionBets } from '../bet/api';
import { createBet } from '../bet/api';
import type { AuctionListRequest, CreateBetRequest } from '../../shared/api/schema';

export function auctionsListQueryOptions(body: AuctionListRequest) {
  return queryOptions({
    queryKey: [QUERY_KEYS.auctionsList, body],
    queryFn: ({ signal }) => fetchAuctionsList(body, signal),
    placeholderData: (prev) => prev,
  });
}

export function auctionDetailQueryOptions(auctionUuid: string) {
  return queryOptions({
    queryKey: [QUERY_KEYS.auctionDetail, auctionUuid],
    queryFn: ({ signal }) => fetchAuctionDetail(auctionUuid, signal),
  });
}

export function auctionBetsQueryOptions(auctionUuid: string) {
  return queryOptions({
    queryKey: [QUERY_KEYS.auctionBets, auctionUuid],
    queryFn: ({ signal }) => fetchAuctionBets(auctionUuid, signal),
  });
}

export function useAuctionsList(body: AuctionListRequest) {
  return useQuery(auctionsListQueryOptions(body));
}

export function useAuctionDetail(auctionUuid: string) {
  return useQuery(auctionDetailQueryOptions(auctionUuid));
}

export function useAuctionBets(auctionUuid: string) {
  return useQuery(auctionBetsQueryOptions(auctionUuid));
}

export function useCreateBet(auctionUuid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBetRequest) => createBet(auctionUuid, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.auctionsList] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.auctionDetail, auctionUuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.auctionBets, auctionUuid] });
    },
  });
}
