import Router from "@koa/router";

export const rootRouter = new Router({
  prefix: "",
});

rootRouter.get("hello", "/hello", async (ctx) => {
  ctx.body = "Hello, world!";
  ctx.status = 200;
});
