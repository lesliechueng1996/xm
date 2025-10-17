import { AdminType } from '@repo/common-types';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Variables } from '../types/context.js';

export const canAccess = (
  c: Context<{ Variables: Variables }>,
  key: string,
) => {
  const isSuper = c.get('isSuper');
  const accessKeys = c.get('accessKeys');

  if (isSuper === AdminType.SUPER) {
    return;
  }
  if (accessKeys.includes(key)) {
    return;
  }
  throw new HTTPException(403, {
    message: '无权限访问',
  });
};
