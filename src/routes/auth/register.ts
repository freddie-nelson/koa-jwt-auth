import { authRouter } from ".";
import AuthService from "../../services/Auth";
import { errorResponse, successResponse } from "../../helpers/response";
import { mapUserToModel } from "../../models/User";
import { registerSchema } from "../../schemas/auth";

authRouter.post("register-password", "/register/password", async (ctx) => {
  const { success, data } = registerSchema.safeParse(ctx.request.body);
  if (!success) {
    return errorResponse(ctx, 400, "Invalid request body");
  }

  const { email, username, password } = data;

  const user = await AuthService.register(email, username, password);
  if (!user) {
    return errorResponse(ctx, 400, "Email or username already taken");
  }

  await AuthService.requestToken(ctx, user);

  return successResponse(ctx, mapUserToModel(user));
});
