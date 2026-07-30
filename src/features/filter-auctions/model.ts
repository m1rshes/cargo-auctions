import type { AuctionsSearch } from '../../entities/auction/search-params';

export type FiltersFormValues = Omit<AuctionsSearch, 'page' | 'pageSize'>;

export const EMPTY_FILTERS: FiltersFormValues = {
  cargo_num: undefined,
  status: undefined,
  statuses: undefined,
  auc_type: undefined,
  load_city: undefined,
  unload_city: undefined,
  load_date_from: undefined,
  load_date_to: undefined,
  is_available: undefined,
  is_bidder: undefined,
  price_from: undefined,
  price_to: undefined,
};

export function hasActiveFilters(filters: FiltersFormValues): boolean {
  return Object.values(filters).some((v) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0));
}
