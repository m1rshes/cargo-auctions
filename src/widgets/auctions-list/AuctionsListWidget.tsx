import type { AuctionListResponse } from '../../shared/api/schema';
import { AuctionCard } from '../auction-card/AuctionCard';
import { Skeleton } from '../../shared/ui/Skeleton';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { Pagination } from '../../shared/ui/Pagination';

interface Props {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  data?: AuctionListResponse;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function AuctionsListWidget({ isLoading, isError, error, data, page, pageSize, onPageChange, onRetry, hasActiveFilters, onResetFilters }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={onRetry} />;
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        title="Аукционы не найдены"
        description={hasActiveFilters ? 'Попробуйте изменить или сбросить фильтры.' : 'По текущим условиям аукционов пока нет.'}
        action={
          hasActiveFilters ? (
            <button onClick={onResetFilters} className="text-sm font-medium text-[var(--color-accent)] hover:underline">
              Сбросить фильтры
            </button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.items.map((item) => (
        <AuctionCard key={item.auctionUuid} item={item} />
      ))}
      <Pagination page={page} pageSize={pageSize} total={data.total} onPageChange={onPageChange} />
    </div>
  );
}
