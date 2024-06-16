import { ParameterizedContext } from "koa";
import AuthService from "../services/Auth";
import { errorResponse } from "../helpers/response";

export async function auth(ctx: ParameterizedContext, next: () => Promise<void>) {
  const user = await AuthService.authenticate(ctx);
  if (!user) {
    return errorResponse(ctx, 401, "You must be logged in to access this route");
  }

  ctx.user = user;
  await next();
}
