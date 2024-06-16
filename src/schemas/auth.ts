import { z } from "zod";

const usernameMinLength = parseInt(process.env.USERNAME_MIN_LENGTH!);
const usernameMaxLength = parseInt(process.env.USERNAME_MAX_LENGTH!);
const usernameRegex = /^[a-zA-Z0-9_]+$/;

const passwordMinLength = parseInt(process.env.PASSWORD_MIN_LENGTH!);

if (!usernameMinLength || !usernameMaxLength || !passwordMinLength) {
  throw new Error("Missing environment variables");
}

export const loginSchema = z.object({
  username: z.string().min(usernameMinLength).max(usernameMaxLength).regex(usernameRegex),
  password: z.string().min(passwordMinLength),
});

export const registerSchema = loginSchema.extend({
  email: z.string().email(),
});
