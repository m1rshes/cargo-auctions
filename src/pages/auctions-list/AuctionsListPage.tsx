import { getRouteApi } from '@tanstack/react-router';
import { buildAuctionListRequest } from '../../entities/auction/request-builder';
import { useAuctionsList } from '../../entities/auction/queries';
import { AuctionFilters } from '../../widgets/auction-filters/AuctionFilters';
import { AuctionsListWidget } from '../../widgets/auctions-list/AuctionsListWidget';
import { hasActiveFilters, type FiltersFormValues } from '../../features/filter-auctions/model';
import { useFiltersPanelStore } from '../../features/filter-auctions/ui-store';
import { DEFAULT_AUCTIONS_SEARCH } from '../../entities/auction/search-params';

const routeApi = getRouteApi('/auctions/');

export function AuctionsListPage() {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const isFiltersOpen = useFiltersPanelStore((s) => s.isOpen);
  const toggleFilters = useFiltersPanelStore((s) => s.toggle);

  const requestBody = buildAuctionListRequest(search);
  const { data, isLoading, isError, error, refetch } = useAuctionsList(requestBody);

  function applyFilters(filters: FiltersFormValues) {
    navigate({ search: { ...filters, page: 1, pageSize: search.pageSize } });
  }

  function resetFilters() {
    navigate({ search: DEFAULT_AUCTIONS_SEARCH });
  }

  function changePage(page: number) {
    navigate({ search: { ...search, page } });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Аукционы грузоперевозок</h1>
          <p className="text-sm text-[var(--color-text-dim)]">Актуальные заявки на перевозку и торги по ставкам</p>
        </div>
        <button
          onClick={toggleFilters}
          className="shrink-0 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
        >
          {isFiltersOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>
      </div>

      {isFiltersOpen && <AuctionFilters value={search} onApply={applyFilters} onReset={resetFilters} />}

      <AuctionsListWidget
        isLoading={isLoading}
        isError={isError}
        error={error}
        data={data}
        page={search.page}
        pageSize={search.pageSize}
        onPageChange={changePage}
        onRetry={refetch}
        hasActiveFilters={hasActiveFilters(search)}
        onResetFilters={resetFilters}
      />
    </div>
  );
}
