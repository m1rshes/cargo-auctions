import { Button } from './Button';

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 sm:flex-row">
      <p className="text-sm text-[var(--color-text-dim)]">
        {from}–{to} из {total}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Назад
        </Button>
        <span className="px-2 text-sm text-[var(--color-text-dim)]">
          {page} / {pageCount}
        </span>
        <Button variant="secondary" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount}>
          Далее
        </Button>
      </div>
    </div>
  );
}
