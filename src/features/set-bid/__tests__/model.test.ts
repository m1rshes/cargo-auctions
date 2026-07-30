import { describe, expect, it } from 'vitest';
import { buildBidSchema } from '../model';

describe('buildBidSchema', () => {
  it('rejects price <= 0', () => {
    const schema = buildBidSchema({ min: null, max: null, step: 500 });
    expect(schema.safeParse({ price: 0 }).success).toBe(false);
    expect(schema.safeParse({ price: -100 }).success).toBe(false);
  });

  it('accepts a valid positive price with no bounds', () => {
    const schema = buildBidSchema({ min: null, max: null, step: 500 });
    expect(schema.safeParse({ price: 1000 }).success).toBe(true);
  });

  it('rejects price below configured min', () => {
    const schema = buildBidSchema({ min: 5000, max: null, step: 500 });
    const result = schema.safeParse({ price: 4000 });
    expect(result.success).toBe(false);
  });

  it('rejects price above configured max', () => {
    const schema = buildBidSchema({ min: null, max: 10000, step: 500 });
    const result = schema.safeParse({ price: 12000 });
    expect(result.success).toBe(false);
  });

  it('coerces string input from a number input field', () => {
    const schema = buildBidSchema({ min: null, max: null, step: 500 });
    const result = schema.safeParse({ price: '1500' });
    expect(result.success).toBe(true);
  });
});
