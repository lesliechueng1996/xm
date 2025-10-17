import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { getAccessKeys } from '../services/admin-access-service.js';
import { getRoleAccessIds } from '../services/admin-role-service.js';
import { getUser } from '../services/admin-user-service.js';

export const userMiddleware = createMiddleware(async (c, next) => {
  const path = c.req.path;
  if (path.startsWith('/admin/login')) {
    await next();
    return;
  }
  const jwtPayload = c.get('jwtPayload');
  const userId = jwtPayload?.sub;
  if (!userId) {
    throw new HTTPException(401, {
      message: '请先登录',
    });
  }
  const user = await getUser(userId);
  if (!user) {
    throw new HTTPException(401, {
      message: '请先登录',
    });
  }
  const roleId = user.roleId;
  const accessIds = await getRoleAccessIds(roleId);
  const accessKeys = await getAccessKeys(accessIds);
  c.set('accessKeys', accessKeys);
  c.set('isSuper', user.isSuper);
  await next();
});
