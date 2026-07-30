import type { AuctionListRequest } from '../../shared/api/schema';
import type { AuctionsSearch } from './search-params';

/**
 * Строит тело запроса POST /auctions/list из провалидированных search params.
 * Вынесен отдельно от хука, чтобы быть чистой функцией и легко тестироваться.
 */
export function buildAuctionListRequest(search: AuctionsSearch): AuctionListRequest {
  return {
    page: search.page,
    pageSize: search.pageSize,
    cargo_num: search.cargo_num,
    status: search.status,
    statuses: search.statuses,
    auc_type: search.auc_type,
    load_city: search.load_city,
    unload_city: search.unload_city,
    load_date_from: search.load_date_from,
    load_date_to: search.load_date_to,
    is_available: search.is_available,
    is_bidder: search.is_bidder,
    price_from: search.price_from,
    price_to: search.price_to,
  };
}
