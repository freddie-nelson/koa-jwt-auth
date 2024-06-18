import { z } from "zod";
import { passwordSchema } from "./auth";

export const userIdSchema = z.number().int();

export const deleteUserSchema = z.object({
  password: passwordSchema,
});
