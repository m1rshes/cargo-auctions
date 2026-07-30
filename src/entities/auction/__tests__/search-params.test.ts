import { describe, expect, it } from 'vitest';
import { parseAuctionsSearch, DEFAULT_AUCTIONS_SEARCH } from '../search-params';

describe('parseAuctionsSearch', () => {
  it('returns defaults for empty input', () => {
    expect(parseAuctionsSearch({})).toEqual(DEFAULT_AUCTIONS_SEARCH);
  });

  it('parses valid filters and coerces numeric strings', () => {
    const result = parseAuctionsSearch({ page: '2', pageSize: '10', load_city: '5', is_available: 'true' });
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(10);
    expect(result.load_city).toBe(5);
    expect(result.is_available).toBe(true);
  });

  it('falls back to defaults on garbage/corrupted values instead of throwing', () => {
    expect(() => parseAuctionsSearch({ page: 'not-a-number', status: 'unknown_status' })).not.toThrow();
    const result = parseAuctionsSearch({ page: 'not-a-number', status: 'unknown_status' });
    expect(result.page).toBe(1);
    expect(result.status).toBeUndefined();
  });

  it('rejects invalid enum values for auc_type', () => {
    const result = parseAuctionsSearch({ auc_type: 'NotARealType' });
    expect(result.auc_type).toBeUndefined();
  });

  it('rejects out-of-range page numbers using catch fallback', () => {
    const result = parseAuctionsSearch({ page: -5 });
    expect(result.page).toBe(1);
  });
});
