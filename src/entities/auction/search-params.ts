import { z } from 'zod';

/**
 * Схема и безопасный парсинг search params страницы списка аукционов.
 * Любое некорректное/повреждённое значение из URL заменяется дефолтом,
 * а не приводит к ошибке рендера — см. parseAuctionsSearch().
 */
export const auctionStatusEnum = z.enum(['draft', 'active', 'paused', 'finished', 'cancelled']);
export const auctionTypeEnum = z.enum(['Request', 'Up', 'Down', 'FixPrice']);

export const auctionsSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).catch(20).default(20),
  cargo_num: z.string().trim().min(1).optional().catch(undefined),
  status: auctionStatusEnum.optional().catch(undefined),
  statuses: z.array(auctionStatusEnum).optional().catch(undefined),
  auc_type: auctionTypeEnum.optional().catch(undefined),
  load_city: z.coerce.number().int().positive().optional().catch(undefined),
  unload_city: z.coerce.number().int().positive().optional().catch(undefined),
  load_date_from: z.string().date().optional().catch(undefined),
  load_date_to: z.string().date().optional().catch(undefined),
  is_available: z.coerce.boolean().optional().catch(undefined),
  is_bidder: z.coerce.boolean().optional().catch(undefined),
  price_from: z.coerce.number().nonnegative().optional().catch(undefined),
  price_to: z.coerce.number().nonnegative().optional().catch(undefined),
});

export type AuctionsSearch = z.infer<typeof auctionsSearchSchema>;

export const DEFAULT_AUCTIONS_SEARCH: AuctionsSearch = {
  page: 1,
  pageSize: 20,
};

/**
 * Безопасный парсинг: при любой ошибке валидации не бросает исключение,
 * а возвращает дефолтные значения фильтров/пагинации.
 */
export function parseAuctionsSearch(raw: unknown): AuctionsSearch {
  const result = auctionsSearchSchema.safeParse(raw);
  if (result.success) return result.data;
  return { ...DEFAULT_AUCTIONS_SEARCH };
}
