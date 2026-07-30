import type { ReactNode } from 'react';

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
      <p className="text-base font-semibold text-[var(--color-text)]">{title}</p>
      {description && <p className="max-w-sm text-sm text-[var(--color-text-dim)]">{description}</p>}
      {action}
    </div>
  );
}
