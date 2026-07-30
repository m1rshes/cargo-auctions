import { describe, expect, it } from 'vitest';
import { getPrimaryAction, formatPrice, formatWeight } from '../model';

const base = {
  status: 'active' as const,
  isAvailable: true,
  hasMyBet: false,
  restrictions: { can_set_bet: true, no_view_cargo_price: false },
};

describe('getPrimaryAction', () => {
  it('returns set_bid when bidding is open and user has no bet', () => {
    expect(getPrimaryAction(base).kind).toBe('set_bid');
  });

  it('returns edit_bid when the user already has a bet', () => {
    expect(getPrimaryAction({ ...base, hasMyBet: true }).kind).toBe('edit_bid');
  });

  it('returns view_bids when bidding is restricted by can_set_bet', () => {
    expect(getPrimaryAction({ ...base, restrictions: { ...base.restrictions, can_set_bet: false } }).kind).toBe('view_bids');
  });

  it('returns view_bids for finished auctions regardless of other flags', () => {
    expect(getPrimaryAction({ ...base, status: 'finished' }).kind).toBe('view_bids');
  });

  it('returns disabled when the auction is cancelled', () => {
    expect(getPrimaryAction({ ...base, status: 'cancelled' }).kind).toBe('disabled');
  });

  it('returns disabled when the auction is unavailable', () => {
    expect(getPrimaryAction({ ...base, isAvailable: false }).kind).toBe('disabled');
  });
});

describe('formatPrice', () => {
  it('renders a dash for null', () => {
    expect(formatPrice(null)).toBe('—');
  });

  it('formats a number as RUB currency', () => {
    expect(formatPrice(1000)).toContain('1');
  });
});

describe('formatWeight', () => {
  it('formats kilograms under 1000 as kg', () => {
    expect(formatWeight(500)).toBe('500 кг');
  });

  it('formats 1000+ as tonnes', () => {
    expect(formatWeight(2000)).toBe('2 т');
  });
});
