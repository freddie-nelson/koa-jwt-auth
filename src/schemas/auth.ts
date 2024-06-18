import { z } from "zod";

const usernameMinLength = parseInt(process.env.USERNAME_MIN_LENGTH!);
const usernameMaxLength = parseInt(process.env.USERNAME_MAX_LENGTH!);
const usernameRegex = /^[a-zA-Z0-9_]+$/;

const passwordMinLength = parseInt(process.env.PASSWORD_MIN_LENGTH!);

if (!usernameMinLength || !usernameMaxLength || !passwordMinLength) {
  throw new Error("Missing environment variables");
}

export const usernameSchema = z.string().min(usernameMinLength).max(usernameMaxLength).regex(usernameRegex);
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(passwordMinLength);

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema.extend({
  email: emailSchema,
});

export const changePasswordSchema = loginSchema.extend({
  newPassword: passwordSchema,
});
