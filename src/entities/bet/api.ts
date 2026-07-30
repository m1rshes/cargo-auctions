import { apiRequest } from '../../shared/api/http-client';
import type { BetsResponse, CreateBetRequest, CreateBetResponse } from '../../shared/api/schema';

export function fetchAuctionBets(auctionUuid: string, signal?: AbortSignal) {
  return apiRequest<BetsResponse>(`/auctions/${auctionUuid}/bets`, { signal });
}

export function createBet(auctionUuid: string, body: CreateBetRequest) {
  return apiRequest<CreateBetResponse>(`/auctions/${auctionUuid}/bets`, { method: 'POST', body });
}
