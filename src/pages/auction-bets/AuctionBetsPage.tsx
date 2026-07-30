import { getRouteApi } from '@tanstack/react-router';
import { useAuctionBets } from '../../entities/auction/queries';
import { CANCEL_REASON_LABELS } from '../../entities/bet/model';
import { formatPrice, formatDate } from '../../entities/auction/model';
import { Skeleton } from '../../shared/ui/Skeleton';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { Badge } from '../../shared/ui/Badge';

const routeApi = getRouteApi('/auctions/$auctionUuid/bets');

export function AuctionBetsPage() {
  const { auctionUuid } = routeApi.useParams();
  const { data, isLoading, isError, refetch } = useAuctionBets(auctionUuid);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={refetch} />;

  if (!data) return null;

  if (data.hidden) {
    return <EmptyState title="История ставок скрыта" description="Организатор скрыл историю ставок для этого аукциона." />;
  }

  if (data.items.length === 0) {
    return <EmptyState title="Ставок пока нет" description="Будьте первым, кто сделает ставку по этому аукциону." />;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-[var(--color-text-dim)]">Участников: {data.participantsCount}</p>
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] text-left text-xs text-[var(--color-text-dim)]">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Перевозчик</th>
              <th className="px-3 py-2">Цена с НДС</th>
              <th className="px-3 py-2">Цена без НДС</th>
              <th className="px-3 py-2">Дата</th>
              <th className="px-3 py-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((bet) => (
              <tr key={bet.id} className={`border-t border-[var(--color-border)] ${bet.isMine ? 'bg-[var(--color-accent)]/5' : ''}`}>
                <td className="px-3 py-2 text-[var(--color-text-dim)]">{bet.rank}</td>
                <td className="px-3 py-2">
                  {bet.carrierName}
                  {bet.isMine && <Badge tone="accent"> Моя</Badge>}
                </td>
                <td className="px-3 py-2 font-medium">{formatPrice(bet.priceWithVat)}</td>
                <td className="px-3 py-2 text-[var(--color-text-dim)]">{formatPrice(bet.priceWithoutVat)}</td>
                <td className="px-3 py-2 text-[var(--color-text-dim)]">{formatDate(bet.createdAt)}</td>
                <td className="px-3 py-2">
                  {bet.isWinner && <Badge tone="success">Победитель</Badge>}
                  {bet.isCancelled && <Badge tone="danger">{bet.cancelReason ? CANCEL_REASON_LABELS[bet.cancelReason] : 'Отменена'}</Badge>}
                  {!bet.isWinner && !bet.isCancelled && <Badge tone="neutral">Активна</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
