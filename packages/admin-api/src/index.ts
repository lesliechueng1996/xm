import { Hono } from 'hono';
import z from 'zod';
import accessHandler from './handlers/access-handler.js';
import focusHandler from './handlers/focus-handler.js';
import imageHandler from './handlers/image-handler.js';
import loginHandler from './handlers/login-handler.js';
import menuHandler from './handlers/menu-handler.js';
import roleHandler from './handlers/role-handler.js';
import userHandler from './handlers/user-handler.js';
import { jwtMiddleware } from './middlewares/jwt-middleware.js';
import { userMiddleware } from './middlewares/user-middleware.js';
import type { Variables } from './types/context.js';

z.config(z.locales.zhCN());

const adminApi = new Hono<{ Variables: Variables }>();

adminApi.use(jwtMiddleware);
adminApi.use(userMiddleware);

adminApi.route('/login', loginHandler);
adminApi.route('/users', userHandler);
adminApi.route('/roles', roleHandler);
adminApi.route('/access', accessHandler);
adminApi.route('/menu', menuHandler);
adminApi.route('/image', imageHandler);
adminApi.route('/focus', focusHandler);

export default adminApi;
