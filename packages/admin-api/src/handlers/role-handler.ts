import {
  type CreateRoleResponse,
  createRoleRequestSchema,
  type EditRoleResponse,
  editRoleRequestSchema,
  type GetRoleResponse,
} from '@repo/admin-api-types';
import { paginationRequestSchema } from '@repo/common-types';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import {
  createRole,
  editRole,
  getRole,
  paginationRoles,
} from '../services/admin-role-service.js';

const roleHandler = new Hono();

roleHandler.post(
  '/',
  validator('json', (value, c) => {
    const parsed = createRoleRequestSchema.safeParse(value);
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
    const body = c.req.valid('json');
    const role = await createRole(body.name, body.description);
    return c.json({
      id: role.id,
    } as CreateRoleResponse);
  },
);

roleHandler.get(
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
    const query = c.req.valid('query');
    return c.json(await paginationRoles(query));
  },
);

roleHandler.get('/:id', async (c) => {
  const { id } = c.req.param();
  const role = await getRole(id);
  return c.json({
    id: role.id,
    name: role.name,
    status: role.status,
    description: role.description,
    createdAt: role.createdAt.getTime(),
  } as GetRoleResponse);
});

roleHandler.put(
  '/:id',
  validator('json', (value, c) => {
    const parsed = editRoleRequestSchema.safeParse(value);
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
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const role = await getRole(id);
    await editRole(role.id, body.name, body.description);
    return c.json({
      id: role.id,
    } as EditRoleResponse);
  },
);

export default roleHandler;
