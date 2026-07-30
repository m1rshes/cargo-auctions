import { createFileRoute } from '@tanstack/react-router';
import { AuctionDetailPage } from '../../../../../pages/auction-detail/AuctionDetailPage';

export const Route = createFileRoute('/auctions/$auctionUuid/')({
  component: AuctionDetailPage,
});
