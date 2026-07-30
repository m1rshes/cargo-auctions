import { getRouteApi, Link } from '@tanstack/react-router';
import { useAuctionDetail } from '../../entities/auction/queries';
import { AUCTION_TYPE_LABELS, formatDate, formatPrice, formatWeight } from '../../entities/auction/model';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Skeleton } from '../../shared/ui/Skeleton';
import { ErrorState } from '../../shared/ui/ErrorState';

const routeApi = getRouteApi('/auctions/$auctionUuid/');

export function AuctionDetailPage() {
  const { auctionUuid } = routeApi.useParams();
  const { data, isLoading, isError, refetch } = useAuctionDetail(auctionUuid);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  const { trading, restrictions } = data;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-xl font-bold">{data.cargoNum}</h1>
            <Badge tone="accent">{AUCTION_TYPE_LABELS[data.aucType]}</Badge>
            <Badge tone="neutral">{data.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-dim)]">Создан {formatDate(data.createdAt)}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-2xl font-bold">{restrictions.no_view_cargo_price ? 'Цена скрыта' : formatPrice(trading.currentPrice)}</p>
          {trading.canSetBet ? (
            <Link to="/auctions/$auctionUuid/bid" params={{ auctionUuid }}>
              <Button>{trading.hasMyBet ? 'Изменить ставку' : 'Сделать ставку'}</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              Ставки недоступны
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--color-text-dim)]">Маршрут</h2>
          <ol className="flex flex-col gap-3">
            {data.route.map((point) => (
              <li key={point.id} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${point.kind === 'load' ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-accent-2)]'}`} />
                <div>
                  <p className="font-medium">
                    {point.city.name} {point.kind === 'load' ? '(погрузка)' : '(выгрузка)'}
                  </p>
                  <p className="text-[var(--color-text-dim)]">
                    {restrictions.hide_points_address_and_contacts ? 'Адрес скрыт' : point.address} · {formatDate(point.date)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-dim)]">Организатор</h2>
          <p className="font-medium">{data.organizer.name}</p>
          {data.organizer.rating !== null && <p className="text-sm text-[var(--color-text-dim)]">Рейтинг: {data.organizer.rating}</p>}
          {data.organizer.verified && <Badge tone="success">Проверен</Badge>}

          <h2 className="mt-3 text-sm font-semibold text-[var(--color-text-dim)]">Контакты</h2>
          {data.contacts ? (
            <div className="text-sm">
              <p>{data.contacts.name}</p>
              <p>{data.contacts.phone}</p>
              <p>{data.contacts.email}</p>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-dim)]">Контакты скрыты организатором</p>
          )}
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-dim)]">Груз и требования</h2>
          <p className="text-sm">{data.cargo.name}</p>
          <p className="text-sm text-[var(--color-text-dim)]">
            {formatWeight(data.cargo.weightKg)}
            {data.cargo.volumeM3 ? ` · ${data.cargo.volumeM3} м³` : ''} · {data.cargo.bodyType}
          </p>
          {data.requirements.temperatureMin !== null && (
            <p className="text-sm text-[var(--color-text-dim)]">
              Температура: {data.requirements.temperatureMin}°C … {data.requirements.temperatureMax}°C
            </p>
          )}
          {data.requirements.adr && <Badge tone="warning">Требуется ADR</Badge>}
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-dim)]">Условия оплаты</h2>
          <p className="text-sm">НДС: {data.payment.vatIncluded ? 'включён' : 'не включён'}</p>
          {data.payment.delayDays !== null && <p className="text-sm text-[var(--color-text-dim)]">Отсрочка: {data.payment.delayDays} дн.</p>}
          {data.payment.prepaymentPercent !== null && <p className="text-sm text-[var(--color-text-dim)]">Предоплата: {data.payment.prepaymentPercent}%</p>}
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-dim)]">Параметры торгов</h2>
          <p className="text-sm">Текущая цена: {restrictions.no_view_cargo_price ? 'скрыта' : formatPrice(trading.currentPrice)}</p>
          {trading.pricePerKm && <p className="text-sm text-[var(--color-text-dim)]">Цена за км: {formatPrice(trading.pricePerKm)}</p>}
          <p className="text-sm text-[var(--color-text-dim)]">Шаг ставки: {formatPrice(trading.step)}</p>
          {trading.min !== null && <p className="text-sm text-[var(--color-text-dim)]">Мин. цена: {formatPrice(trading.min)}</p>}
          {trading.max !== null && <p className="text-sm text-[var(--color-text-dim)]">Макс. цена: {formatPrice(trading.max)}</p>}
          {trading.hasMyBet && <p className="text-sm text-[var(--color-accent)]">Моя ставка: {formatPrice(trading.myBetPrice)}</p>}
        </section>
      </div>
    </div>
  );
}
