import type { BetCancelReason } from '../../shared/api/schema';

export const CANCEL_REASON_LABELS: Record<NonNullable<BetCancelReason>, string> = {
  outbid: 'Перебита другой ставкой',
  organizer_rejected: 'Отклонена организатором',
  carrier_withdrew: 'Отозвана перевозчиком',
  auction_cancelled: 'Аукцион отменён',
};
