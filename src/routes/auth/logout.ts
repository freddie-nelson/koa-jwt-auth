import Router from "@koa/router";
import { errorResponse, successResponse } from "../../helpers/response";
import AuthService from "../../services/Auth";

export const logoutRouter = new Router({
  prefix: "/logout",
});

logoutRouter.post("logout", "/", async (ctx) => {
  const user = await AuthService.authenticate(ctx);
  if (!user) {
    return errorResponse(ctx, 401, "You must be logged in to log out");
  }

  await AuthService.logout(ctx);

  return successResponse(ctx, "Logged out");
});
