import { createFileRoute } from '@tanstack/react-router';
import { AuctionBidPage } from '../../../../../pages/auction-bid/AuctionBidPage';

export const Route = createFileRoute('/auctions/$auctionUuid/bid')({
  component: AuctionBidPage,
});
