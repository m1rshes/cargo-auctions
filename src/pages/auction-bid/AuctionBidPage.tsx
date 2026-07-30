import { getRouteApi } from '@tanstack/react-router';
import { useAuctionDetail } from '../../entities/auction/queries';
import { AuctionBidForm } from '../../widgets/auction-bid-form/AuctionBidForm';
import { Skeleton } from '../../shared/ui/Skeleton';
import { ErrorState } from '../../shared/ui/ErrorState';

const routeApi = getRouteApi('/auctions/$auctionUuid/bid');

export function AuctionBidPage() {
  const { auctionUuid } = routeApi.useParams();
  const { data, isLoading, isError, refetch } = useAuctionDetail(auctionUuid);

  if (isLoading || !data) return <Skeleton className="h-64 w-full" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-lg font-bold">Ставка по заявке {data.cargoNum}</h1>
      <AuctionBidForm auction={data} />
    </div>
  );
}
