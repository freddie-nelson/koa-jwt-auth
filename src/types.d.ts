import { DefaultContext } from "koa";
import { PrismaClient, User } from "@prisma/client";

declare module "koa" {
  interface DefaultContext {
    user?: User;
  }
}
