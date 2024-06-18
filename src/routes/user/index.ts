import Router from "@koa/router";
import { deleteUserSchema, userIdSchema } from "../../schemas/user";
import { errorResponse, successResponse } from "../../helpers/response";
import UserService from "../../services/User";
import { mapUserToModel } from "../../models/User";
import { auth } from "../../middlewares/auth";
import AuthService from "../../services/Auth";

export const userRouter = new Router({
  prefix: "/user",
});

userRouter.get("user", "/:id", auth, async (ctx) => {
  const { id } = ctx.params;

  const { success, data: userId } = userIdSchema.safeParse(parseInt(id));
  if (!success) {
    return errorResponse(ctx, 400, "Invalid user ID");
  }

  if (!ctx.user) {
    return errorResponse(ctx, 401, "You must be logged in to access this route");
  }

  if (ctx.user.id !== userId) {
    return errorResponse(ctx, 403, "You are not authorized to view this user");
  }

  const user = await UserService.getUserById(userId);
  if (!user) {
    return errorResponse(ctx, 404, "User not found");
  }

  return successResponse(ctx, mapUserToModel(user));
});

userRouter.post("delete-user", "/:id/delete", auth, async (ctx) => {
  const { id } = ctx.params;

  const { success: successId, data: userId } = userIdSchema.safeParse(parseInt(id));
  if (!successId) {
    return errorResponse(ctx, 400, "Invalid user ID");
  }

  const { success, data } = deleteUserSchema.safeParse(ctx.request.body);
  if (!success) {
    return errorResponse(ctx, 400, "Invalid request body");
  }

  if (!ctx.user) {
    return errorResponse(ctx, 401, "You must be logged in to access this route");
  }

  if (ctx.user.id !== userId) {
    return errorResponse(ctx, 403, "You are not authorized to delete this user");
  }

  const { password } = data;
  if ((await AuthService.login(ctx.user.username, password)) === null) {
    return errorResponse(ctx, 401, "Password is incorrect");
  }

  await AuthService.logout(ctx);

  const user = await UserService.deleteUserById(userId);
  if (!user) {
    return errorResponse(ctx, 500, "Could not delete user");
  }

  return successResponse(ctx, mapUserToModel(user));
});
