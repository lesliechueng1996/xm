import type { TokenPayload } from '@repo/admin-api-types';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import { encryptPassword } from '../utils/password-util.js';
import { getAccessKeys } from './admin-access-service.js';
import { getRoleAccessIds } from './admin-role-service.js';
import { findAdminUserByUsername } from './admin-user-service.js';

export const issuer = 'admin-api';

export const adminLogin = async (username: string, password: string) => {
  const adminUser = await findAdminUserByUsername(username);
  if (!adminUser) {
    console.log('用户不存在');
    throw new HTTPException(401, {
      message: '用户名或密码错误',
    });
  }

  const encryptedPassword = encryptPassword(password, adminUser.username);

  if (encryptedPassword !== adminUser.password) {
    console.log('密码错误');
    throw new HTTPException(401, {
      message: '用户名或密码错误',
    });
  }

  const accessIds = await getRoleAccessIds(adminUser.roleId);
  const accessKeys = await getAccessKeys(accessIds);

  const payload: TokenPayload = {
    sub: adminUser.id,
    role: adminUser.roleId,
    isSuper: adminUser.isSuper,
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    iss: issuer,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    username: adminUser.username,
    accessKeys,
  };
  const token = await sign(payload, process.env.JWT_SECRET as string);
  return token;
};
