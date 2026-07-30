import { createFileRoute } from '@tanstack/react-router';
import { auctionsSearchSchema } from '../../../../entities/auction/search-params';
import { AuctionsListPage } from '../../../../pages/auctions-list/AuctionsListPage';

export const Route = createFileRoute('/auctions/')({
  validateSearch: auctionsSearchSchema,
  component: AuctionsListPage,
});
