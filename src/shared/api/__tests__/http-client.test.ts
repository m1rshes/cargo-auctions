import { describe, expect, it } from 'vitest';
import { buildUrl } from '../http-client';

describe('buildUrl', () => {
  it('builds a plain path with no params', () => {
    expect(buildUrl('/auctions/list')).toBe('/api/auctions/list');
  });

  it('serializes scalar params and skips undefined/null/empty', () => {
    const url = buildUrl('/auctions/list', { page: 2, cargo_num: undefined, status: null, q: '' });
    expect(url).toBe('/api/auctions/list?page=2');
  });

  it('serializes array params as repeated keys', () => {
    const url = buildUrl('/auctions/list', { statuses: ['active', 'paused'] });
    expect(url).toBe('/api/auctions/list?statuses=active&statuses=paused');
  });
});
