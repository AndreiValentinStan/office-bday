import z from 'zod';
import { passwordSchema } from './passwordSchema';

export const loginDataSchema = z.object({
    email: z
    .email('Invalid email format'),
    password: passwordSchema
});