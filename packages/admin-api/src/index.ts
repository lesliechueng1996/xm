import { Hono } from 'hono';
import type { JwtVariables } from 'hono/jwt';
import { jwt } from 'hono/jwt';
import loginHandler from './handlers/login-handler.js';
import { issuer } from './services/login-service.js';
import z from 'zod';

z.config(z.locales.zhCN());

type Variables = JwtVariables;

const adminApi = new Hono<{ Variables: Variables }>();

adminApi.use(async (c, next) => {
  const path = c.req.path;
  console.log(path);
  if (path.startsWith('/admin/login')) {
    await next();
    return;
  }
  return jwt({
    secret: process.env.JWT_SECRET as string,
    verification: {
      iss: issuer,
      exp: true,
      iat: true,
      nbf: true,
    },
  })(c, next);
});

adminApi.route('/login', loginHandler);
export default adminApi;
