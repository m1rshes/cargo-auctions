import { describe, expect, it } from 'vitest';
import { buildAuctionListRequest } from '../request-builder';
import { DEFAULT_AUCTIONS_SEARCH } from '../search-params';

describe('buildAuctionListRequest', () => {
  it('maps default search params to a minimal request body', () => {
    const body = buildAuctionListRequest(DEFAULT_AUCTIONS_SEARCH);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
    expect(body.cargo_num).toBeUndefined();
  });

  it('carries filter fields through unchanged', () => {
    const body = buildAuctionListRequest({
      ...DEFAULT_AUCTIONS_SEARCH,
      page: 3,
      pageSize: 50,
      cargo_num: 'CN-1',
      status: 'active',
      auc_type: 'Down',
      load_city: 1,
      unload_city: 2,
      price_from: 1000,
      price_to: 5000,
      is_available: true,
      is_bidder: false,
    });

    expect(body).toMatchObject({
      page: 3,
      pageSize: 50,
      cargo_num: 'CN-1',
      status: 'active',
      auc_type: 'Down',
      load_city: 1,
      unload_city: 2,
      price_from: 1000,
      price_to: 5000,
      is_available: true,
      is_bidder: false,
    });
  });
});
