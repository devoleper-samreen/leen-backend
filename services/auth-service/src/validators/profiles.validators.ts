import { z } from 'zod';

const addressSchema = z.object({
  label: z.string().trim().min(1),
  lat: z.number(),
  lng: z.number(),
  formatted: z.string().trim().min(1),
  isPrimary: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  addresses: z.array(addressSchema).optional(),
});
