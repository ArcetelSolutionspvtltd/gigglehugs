import { z } from 'zod';

export const optionalId = z.preprocess(
  (value) =>
    value === '' || value === null || value === undefined ? undefined : value,
  z.coerce.number().int().optional()
);
