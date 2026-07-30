import { useState } from 'react';
import type { AuctionsSearch } from '../../entities/auction/search-params';
import { CITIES } from '../../shared/mocks/data/cities';
import { Button } from '../../shared/ui/Button';
import { hasActiveFilters, type FiltersFormValues } from '../../features/filter-auctions/model';

interface Props {
  value: AuctionsSearch;
  onApply: (filters: FiltersFormValues) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: { value: NonNullable<AuctionsSearch['status']>; label: string }[] = [
  { value: 'active', label: 'Активный' },
  { value: 'paused', label: 'Приостановлен' },
  { value: 'finished', label: 'Завершён' },
  { value: 'cancelled', label: 'Отменён' },
  { value: 'draft', label: 'Черновик' },
];

const AUC_TYPE_OPTIONS: { value: NonNullable<AuctionsSearch['auc_type']>; label: string }[] = [
  { value: 'Request', label: 'Заявка' },
  { value: 'Up', label: 'На повышение' },
  { value: 'Down', label: 'На понижение' },
  { value: 'FixPrice', label: 'Фикс. цена' },
];

const inputClass =
  'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none';

export function AuctionFilters({ value, onApply, onReset }: Props) {
  const [draft, setDraft] = useState<FiltersFormValues>({
    cargo_num: value.cargo_num,
    status: value.status,
    statuses: value.statuses,
    auc_type: value.auc_type,
    load_city: value.load_city,
    unload_city: value.unload_city,
    load_date_from: value.load_date_from,
    load_date_to: value.load_date_to,
    is_available: value.is_available,
    is_bidder: value.is_bidder,
    price_from: value.price_from,
    price_to: value.price_to,
  });

  function set<K extends keyof FiltersFormValues>(key: K, val: FiltersFormValues[K]) {
    setDraft((d) => ({ ...d, [key]: val }));
  }

  return (
    <form
      className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onApply(draft);
      }}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
          № заявки
          <input
            className={inputClass}
            placeholder="CN-202600001"
            value={draft.cargo_num ?? ''}
            onChange={(e) => set('cargo_num', e.target.value || undefined)}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
          Статус
          <select
            className={inputClass}
            value={draft.status ?? ''}
            onChange={(e) => set('status', (e.target.value || undefined) as FiltersFormValues['status'])}
          >
            <option value="">Любой</option>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
          Тип аукциона
          <select
            className={inputClass}
            value={draft.auc_type ?? ''}
            onChange={(e) => set('auc_type', (e.target.value || undefined) as FiltersFormValues['auc_type'])}
          >
            <option value="">Любой</option>
            {AUC_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
          Город погрузки
          <select
            className={inputClass}
            value={draft.load_city ?? ''}
            onChange={(e) => set('load_city', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Любой</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
          Город выгрузки
          <select
            className={inputClass}
            value={draft.unload_city ?? ''}
            onChange={(e) => set('unload_city', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Любой</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
          Погрузка от
          <input type="date" className={inputClass} value={draft.load_date_from ?? ''} onChange={(e) => set('load_date_from', e.target.value || undefined)} />
        </label>

        <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
          Погрузка до
          <input type="date" className={inputClass} value={draft.load_date_to ?? ''} onChange={(e) => set('load_date_to', e.target.value || undefined)} />
        </label>

        <div className="flex gap-2">
          <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
            Цена от
            <input
              type="number"
              min={0}
              className={inputClass}
              value={draft.price_from ?? ''}
              onChange={(e) => set('price_from', e.target.value ? Number(e.target.value) : undefined)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
            Цена до
            <input
              type="number"
              min={0}
              className={inputClass}
              value={draft.price_to ?? ''}
              onChange={(e) => set('price_to', e.target.value ? Number(e.target.value) : undefined)}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-dim)]">
          <input type="checkbox" checked={!!draft.is_available} onChange={(e) => set('is_available', e.target.checked || undefined)} />
          Только доступные
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-dim)]">
          <input type="checkbox" checked={!!draft.is_bidder} onChange={(e) => set('is_bidder', e.target.checked || undefined)} />
          Только с моей ставкой
        </label>

        <div className="ml-auto flex gap-2">
          <Button type="submit">Применить</Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!hasActiveFilters(draft)}
            onClick={() => {
              setDraft({
                cargo_num: undefined,
                status: undefined,
                statuses: undefined,
                auc_type: undefined,
                load_city: undefined,
                unload_city: undefined,
                load_date_from: undefined,
                load_date_to: undefined,
                is_available: undefined,
                is_bidder: undefined,
                price_from: undefined,
                price_to: undefined,
              });
              onReset();
            }}
          >
            Сбросить
          </Button>
        </div>
      </div>
    </form>
  );
}
