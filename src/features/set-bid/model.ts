import { z } from 'zod';

export interface BidLimits {
  min: number | null;
  max: number | null;
  step: number;
}

/**
 * Строит Zod-схему формы ставки с учётом min/max/step из detail DTO.
 * Вынесена в чистую функцию, чтобы её можно было протестировать без RHF/React.
 */
export function buildBidSchema(limits: BidLimits) {
  let schema = z
    .object({
      price: z.coerce
        .number({ error: 'Укажите цену' })
        .gt(0, 'Цена должна быть больше 0'),
    })
    .strict();

  return schema.superRefine((data, ctx) => {
    if (limits.min !== null && data.price < limits.min) {
      ctx.addIssue({ code: 'custom', path: ['price'], message: `Цена не может быть меньше ${limits.min}` });
    }
    if (limits.max !== null && data.price > limits.max) {
      ctx.addIssue({ code: 'custom', path: ['price'], message: `Цена не может быть больше ${limits.max}` });
    }
  });
}

export type BidFormValues = { price: number };
export type BidFormInput = { price: unknown };
