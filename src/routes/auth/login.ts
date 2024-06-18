import AuthService from "../../services/Auth";
import { errorResponse, successResponse } from "../../helpers/response";
import { mapUserToModel } from "../../models/User";
import { loginSchema } from "../../schemas/auth";
import Router from "@koa/router";

export const loginRouter = new Router({
  prefix: "/login",
});

loginRouter.post("login-password", "/password", async (ctx) => {
  const { success, data } = loginSchema.safeParse(ctx.request.body);
  if (!success) {
    return errorResponse(ctx, 400, "Invalid request body");
  }

  const { username, password } = data;

  const user = await AuthService.login(username, password);
  if (!user) {
    return errorResponse(ctx, 401, "Username and password do not match");
  }

  await AuthService.requestToken(ctx, user);

  return successResponse(ctx, mapUserToModel(user));
});

loginRouter.post("login-token", "/token", async (ctx) => {
  const user = await AuthService.authenticate(ctx);
  if (!user) {
    return errorResponse(ctx, 401, "Could not authenticate user");
  }

  return successResponse(ctx, mapUserToModel(user));
});
