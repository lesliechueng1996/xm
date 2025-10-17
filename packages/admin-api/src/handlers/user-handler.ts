import {
  type CreateUserResponse,
  createUserRequestSchema,
  type EditUserResponse,
  editUserRequestSchema,
  type GetUserResponse,
} from '@repo/admin-api-types';
import { paginationRequestSchema } from '@repo/common-types';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import {
  createUser,
  deleteUser,
  editUser,
  getUser,
  paginationUsers,
} from '../services/admin-user-service.js';
import type { Variables } from '../types/context.js';
import { canAccess } from '../utils/role-access-util.js';

const userHandler = new Hono<{ Variables: Variables }>();

userHandler.post(
  '/',
  validator('json', (value, c) => {
    const parsed = createUserRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          message: z.prettifyError(parsed.error),
        },
        400,
      );
    }
    return parsed.data;
  }),
  async (c) => {
    canAccess(c, 'users:add');
    const body = c.req.valid('json');
    const user = await createUser(
      body.username,
      body.password,
      body.mobile,
      body.email,
      body.roleId,
    );
    return c.json({
      id: user.id,
    } as CreateUserResponse);
  },
);

userHandler.get(
  '/',
  validator('query', (value, c) => {
    const parsed = paginationRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          message: z.prettifyError(parsed.error),
        },
        400,
      );
    }
    return parsed.data;
  }),
  async (c) => {
    canAccess(c, 'users:list');
    const query = c.req.valid('query');
    return c.json(await paginationUsers(query));
  },
);

userHandler.get('/:id', async (c) => {
  canAccess(c, 'users:edit');
  const { id } = c.req.param();
  const user = await getUser(id);
  return c.json({
    id: user.id,
    username: user.username,
    mobile: user.mobile,
    email: user.email,
    role: {
      id: user.role.id,
      name: user.role.name,
      status: user.role.status,
    },
    status: user.status,
    createdAt: user.createdAt.getTime(),
  } as GetUserResponse);
});

userHandler.put(
  '/:id',
  validator('json', (value, c) => {
    const parsed = editUserRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          message: z.prettifyError(parsed.error),
        },
        400,
      );
    }
    return parsed.data;
  }),
  async (c) => {
    canAccess(c, 'users:edit');
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const user = await getUser(id);
    await editUser(
      user.id,
      body.password ?? '',
      body.mobile,
      body.email,
      body.roleId,
    );
    return c.json({
      id: user.id,
    } as EditUserResponse);
  },
);

userHandler.delete('/:id', async (c) => {
  canAccess(c, 'users:delete');
  const { id } = c.req.param();
  await deleteUser(id);
  return c.json({});
});

export default userHandler;
