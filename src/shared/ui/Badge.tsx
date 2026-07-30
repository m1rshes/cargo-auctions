import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--color-surface-2)] text-[var(--color-text-dim)] border-[var(--color-border)]',
  accent: 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/40',
  success: 'bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/40',
  warning: 'bg-[var(--color-accent-2)]/15 text-[var(--color-accent-2)] border-[var(--color-accent-2)]/40',
  danger: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)] border-[var(--color-danger)]/40',
};

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
