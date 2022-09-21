import z from 'zod';

export const roomSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(50).nullish()
})