import { Button } from './Button';

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 px-6 py-16 text-center">
      <p className="text-base font-semibold text-[var(--color-danger)]">Не удалось загрузить данные</p>
      {message && <p className="max-w-sm text-sm text-[var(--color-text-dim)]">{message}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Повторить попытку
        </Button>
      )}
    </div>
  );
}
