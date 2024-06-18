import Router from "@koa/router";
import { loginRouter } from "./login";
import { registerRouter } from "./register";
import { logoutRouter } from "./logout";
import { changePasswordSchema } from "../../schemas/auth";
import { errorResponse, successResponse } from "../../helpers/response";
import AuthService from "../../services/Auth";
import { mapUserToModel } from "../../models/User";

export const authRouter = new Router({
  prefix: "/auth",
});

authRouter.use(loginRouter.routes());
authRouter.use(registerRouter.routes());
authRouter.use(logoutRouter.routes());

authRouter.patch("change-password", "/password", async (ctx) => {
  const { success, data } = changePasswordSchema.safeParse(ctx.request.body);
  if (!success) {
    return errorResponse(ctx, 400, "Invalid request body");
  }

  const { username, password, newPassword } = data;

  const updatedUser = await AuthService.changePassword(username, password, newPassword);
  if (!updatedUser) {
    return errorResponse(
      ctx,
      401,
      "Unable to changed password at this time, check your username and password and try again"
    );
  }

  return successResponse(ctx, mapUserToModel(updatedUser));
});
