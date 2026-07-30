import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import type { AuctionDetail } from '../../shared/api/schema';
import { buildBidSchema, type BidFormInput, type BidFormValues } from '../../features/set-bid/model';
import { useCreateBet } from '../../entities/auction/queries';
import { ApiError } from '../../shared/api/http-client';
import { formatPrice } from '../../entities/auction/model';
import { Button } from '../../shared/ui/Button';

export function AuctionBidForm({ auction }: { auction: AuctionDetail }) {
  const { trading, auctionUuid } = { trading: auction.trading, auctionUuid: auction.auctionUuid };
  const navigate = useNavigate();
  const createBet = useCreateBet(auctionUuid);

  const schema = buildBidSchema({ min: trading.min, max: trading.max, step: trading.step });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BidFormInput, unknown, BidFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { price: trading.myBetPrice ?? trading.currentPrice + trading.step },
  });

  if (!trading.canSetBet) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
        <p className="font-semibold text-[var(--color-text)]">Установка ставки недоступна</p>
        <p className="mt-1 text-sm text-[var(--color-text-dim)]">Для этого аукциона ставки закрыты организатором или условиями аукциона.</p>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createBet.mutateAsync({ price: values.price });
      toast.success('Ставка успешно установлена');
      navigate({ to: '/auctions/$auctionUuid', params: { auctionUuid } });
    } catch (err) {
      if (err instanceof ApiError && err.isValidationError()) {
        const fieldErrors = err.body.errors;
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (field === 'price') setError('price', { message: messages[0] });
        }
        toast.error('Проверьте корректность введённой цены');
      } else {
        toast.error('Не удалось установить ставку. Попробуйте ещё раз.');
      }
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div>
        <p className="text-sm text-[var(--color-text-dim)]">Текущая цена</p>
        <p className="text-xl font-bold">{formatPrice(trading.currentPrice)}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-dim)]">
        <span>Шаг ставки: {formatPrice(trading.step)}</span>
        {trading.min !== null && <span>Мин: {formatPrice(trading.min)}</span>}
        {trading.max !== null && <span>Макс: {formatPrice(trading.max)}</span>}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Ваша цена, ₽</span>
        <input
          type="number"
          step="any"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-base focus:border-[var(--color-accent)] focus:outline-none"
          {...register('price')}
        />
        {errors.price && <span className="text-sm text-[var(--color-danger)]">{errors.price.message}</span>}
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка…' : trading.hasMyBet ? 'Изменить ставку' : 'Сделать ставку'}
      </Button>
    </form>
  );
}
