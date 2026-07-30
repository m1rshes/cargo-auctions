import { apiRequest } from '../../shared/api/http-client';
import type { AuctionDetail, AuctionListRequest, AuctionListResponse } from '../../shared/api/schema';

export function fetchAuctionsList(body: AuctionListRequest, signal?: AbortSignal) {
  return apiRequest<AuctionListResponse>('/auctions/list', { method: 'POST', body, signal });
}

export function fetchAuctionDetail(auctionUuid: string, signal?: AbortSignal) {
  return apiRequest<AuctionDetail>(`/auctions/${auctionUuid}`, { signal });
}
