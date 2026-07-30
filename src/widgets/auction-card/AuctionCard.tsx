import { Link } from '@tanstack/react-router';
import type { AuctionListItem } from '../../shared/api/schema';
import { AUCTION_TYPE_LABELS, TRADING_STATUS_LABELS, formatDate, formatPrice, formatWeight, getPrimaryAction } from '../../entities/auction/model';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';

const STATUS_TONE = {
  active: 'success',
  paused: 'warning',
  finished: 'neutral',
  cancelled: 'danger',
  draft: 'neutral',
} as const;

const TRADING_TONE = {
  Leading: 'success',
  Winner: 'success',
  Losing: 'danger',
  Outbid: 'danger',
  NoBet: 'neutral',
} as const;

export function AuctionCard({ item }: { item: AuctionListItem }) {
  const action = getPrimaryAction(item);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-accent)]/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/auctions/$auctionUuid"
            params={{ auctionUuid: item.auctionUuid }}
            className="font-mono text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)]"
          >
            {item.cargoNum}
          </Link>
          <Badge tone="accent">{AUCTION_TYPE_LABELS[item.aucType]}</Badge>
          <Badge tone={STATUS_TONE[item.status]}>{item.status}</Badge>
          {item.tradingStatus && <Badge tone={TRADING_TONE[item.tradingStatus]}>{TRADING_STATUS_LABELS[item.tradingStatus]}</Badge>}
          {item.hasMyBet && <Badge tone="accent">Моя ставка есть</Badge>}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-text)]">
          <span className="font-medium">{item.loadCity.name}</span>
          <span className="text-[var(--color-text-dim)]">→</span>
          <span className="font-medium">{item.unloadCity.name}</span>
          <span className="text-[var(--color-text-dim)]">
            · {formatDate(item.loadDate)}
            {item.unloadDate ? ` – ${formatDate(item.unloadDate)}` : ''}
          </span>
        </div>

        <div className="text-sm text-[var(--color-text-dim)]">
          {item.cargo.name} · {formatWeight(item.cargo.weightKg)}
          {item.cargo.volumeM3 ? ` · ${item.cargo.volumeM3} м³` : ''} · {item.cargo.bodyType}
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="text-right">
          <p className="text-lg font-bold text-[var(--color-text)]">
            {item.restrictions.no_view_cargo_price ? 'Цена скрыта' : formatPrice(item.currentPrice)}
          </p>
          {item.pricePerKm && !item.restrictions.no_view_cargo_price && (
            <p className="text-xs text-[var(--color-text-dim)]">{formatPrice(item.pricePerKm)}/км · шаг {formatPrice(item.step)}</p>
          )}
        </div>

        {action.kind === 'disabled' ? (
          <Button variant="secondary" disabled>
            {action.label}
          </Button>
        ) : action.kind === 'view_bids' ? (
          <Link to="/auctions/$auctionUuid/bets" params={{ auctionUuid: item.auctionUuid }}>
            <Button variant="secondary">{action.label}</Button>
          </Link>
        ) : (
          <Link to="/auctions/$auctionUuid/bid" params={{ auctionUuid: item.auctionUuid }}>
            <Button variant="primary">{action.label}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
