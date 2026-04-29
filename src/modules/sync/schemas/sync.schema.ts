import {z} from 'zod';

export const syncExecutionContextSchema = z.object({
  organizationCode: z.number().int().positive(),
  userHash: z.string().trim().min(1),
});
