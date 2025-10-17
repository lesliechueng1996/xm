import { createMiddleware } from 'hono/factory';
import { jwt } from 'hono/jwt';
import { issuer } from '../services/login-service.js';

export const jwtMiddleware = createMiddleware(async (c, next) => {
  const path = c.req.path;
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
