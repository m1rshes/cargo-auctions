import { createFileRoute } from '@tanstack/react-router';
import { AuctionBetsPage } from '../../../../../pages/auction-bets/AuctionBetsPage';

export const Route = createFileRoute('/auctions/$auctionUuid/bets')({
  component: AuctionBetsPage,
});
