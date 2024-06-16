import Router from "@koa/router";
import { userIdSchema } from "../../schemas/user";
import { errorResponse, successResponse } from "../../helpers/response";
import UserService from "../../services/User";
import { mapUserToModel } from "../../models/User";
import { auth } from "../../middlewares/auth";

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
