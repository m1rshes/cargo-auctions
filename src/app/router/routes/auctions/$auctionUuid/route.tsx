import { createFileRoute, Link, Outlet, useParams } from '@tanstack/react-router';
import { auctionDetailQueryOptions } from '../../../../../entities/auction/queries';

export const Route = createFileRoute('/auctions/$auctionUuid')({
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.auctionUuid));
  },
  component: AuctionLayout,
});

function AuctionLayout() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' });

  const tabs = [
    { to: '/auctions/$auctionUuid', label: 'Обзор' },
    { to: '/auctions/$auctionUuid/bets', label: 'Ставки' },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/auctions" className="w-fit text-sm text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">
        ← К списку аукционов
      </Link>
      <nav className="flex gap-1 border-b border-[var(--color-border)]">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            params={{ auctionUuid }}
            activeOptions={{ exact: tab.to === '/auctions/$auctionUuid' }}
            className="px-3 py-2 text-sm font-medium text-[var(--color-text-dim)] hover:text-[var(--color-text)] [&.active]:border-b-2 [&.active]:border-[var(--color-accent)] [&.active]:text-[var(--color-accent)]"
            activeProps={{ className: 'active' }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
