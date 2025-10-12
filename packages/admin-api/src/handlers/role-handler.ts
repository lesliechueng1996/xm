import {
  type CreateRoleResponse,
  createRoleRequestSchema,
} from '@repo/admin-api-types';
import { paginationRequestSchema } from '@repo/common-types';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import { createRole, paginationRoles } from '../services/admin-role-service.js';

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

export default roleHandler;
