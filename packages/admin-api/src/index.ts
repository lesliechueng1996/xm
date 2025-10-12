import { Hono } from 'hono';
import type { JwtVariables } from 'hono/jwt';
import { jwt } from 'hono/jwt';
import z from 'zod';
import loginHandler from './handlers/login-handler.js';
import roleHandler from './handlers/role-handler.js';
import { issuer } from './services/login-service.js';
import userHandler from './handlers/user-handler.js';

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
adminApi.route('/users', userHandler);
adminApi.route('/roles', roleHandler);
export default adminApi;
