import { ParameterizedContext } from "koa";

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  reason: string;
}

export function errorResponse(ctx: ParameterizedContext, status: number, reason: string) {
  ctx.status = status;
  ctx.body = <ErrorResponse>{
    success: false,
    reason,
  };

  return ctx;
}

export function successResponse<T>(ctx: ParameterizedContext, data: T) {
  ctx.status = 200;
  ctx.body = <SuccessResponse<T>>{
    success: true,
    data,
  };

  return ctx;
}
