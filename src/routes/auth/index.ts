import Router from "@koa/router";
import { loginSchema, registerSchema } from "../../schemas/auth";
import { errorResponse, successResponse } from "../../helpers/response";
import { db } from "../../helpers/db";
import Auth from "../../helpers/Auth";
import { mapUserToModel } from "../../models/User";

export const authRouter = new Router({
  prefix: "/auth",
});

authRouter.post("login-password", "/login/password", async (ctx) => {
  const { success, data } = loginSchema.safeParse(ctx.request.body);
  if (!success) {
    return errorResponse(ctx, 400, "Invalid request body");
  }

  const { username, password } = data;

  const user = await Auth.login(username, password);
  if (!user) {
    return errorResponse(ctx, 401, "Username and password do not match");
  }

  await Auth.requestToken(ctx, user);

  return successResponse(ctx, mapUserToModel(user));
});

authRouter.get("login-token", "/login/token", async (ctx) => {
  const user = await Auth.authenticate(ctx);
  if (!user) {
    return errorResponse(ctx, 401, "Could not authenticate user");
  }

  return successResponse(ctx, mapUserToModel(user));
});

authRouter.post("register-password", "/register/password", async (ctx) => {
  const { success, data } = registerSchema.safeParse(ctx.request.body);
  if (!success) {
    return errorResponse(ctx, 400, "Invalid request body");
  }

  const { email, username, password } = data;

  const user = await Auth.register(email, username, password);
  if (!user) {
    return errorResponse(ctx, 400, "Email or username already taken");
  }

  await Auth.requestToken(ctx, user);

  return successResponse(ctx, mapUserToModel(user));
});
