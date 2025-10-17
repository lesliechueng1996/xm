import { HTTPException } from 'hono/http-exception';
import type { Variables } from '../types/context.js';
import type { Context } from 'hono';
import { AdminType } from '@repo/common-types';

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
