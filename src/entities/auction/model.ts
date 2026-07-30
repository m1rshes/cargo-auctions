import type { AuctionListItem, AuctionType, TradingStatus } from '../../shared/api/schema';

export const AUCTION_TYPE_LABELS: Record<AuctionType, string> = {
  Request: 'Заявка',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
};

export const TRADING_STATUS_LABELS: Record<TradingStatus, string> = {
  Leading: 'Лидирую',
  Losing: 'Проигрываю',
  Winner: 'Победитель',
  NoBet: 'Без ставки',
  Outbid: 'Перебита',
};

export type PrimaryAction =
  | { kind: 'set_bid'; label: 'Сделать ставку' }
  | { kind: 'edit_bid'; label: 'Изменить ставку' }
  | { kind: 'view_bids'; label: 'Смотреть ставки' }
  | { kind: 'disabled'; label: string };

/**
 * ViewModel-маппер: превращает DTO элемента списка в описание primary action
 * карточки аукциона согласно бизнес-правилам задания.
 */
export function getPrimaryAction(item: Pick<AuctionListItem, 'status' | 'isAvailable' | 'hasMyBet' | 'restrictions'>): PrimaryAction {
  if (item.status === 'finished') return { kind: 'view_bids', label: 'Смотреть ставки' };
  if (item.status === 'cancelled') return { kind: 'disabled', label: 'Аукцион отменён' };
  if (!item.isAvailable) return { kind: 'disabled', label: 'Недоступно' };
  if (!item.restrictions.can_set_bet) return { kind: 'view_bids', label: 'Смотреть ставки' };
  if (item.hasMyBet) return { kind: 'edit_bid', label: 'Изменить ставку' };
  return { kind: 'set_bid', label: 'Сделать ставку' };
}

export function formatPrice(price: number | null, currency: string = 'RUB'): string {
  if (price === null) return '—';
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}

export function formatWeight(kg: number): string {
  return kg >= 1000 ? `${(kg / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 1 })} т` : `${kg} кг`;
}
