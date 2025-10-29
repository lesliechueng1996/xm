import {
  type CreateGoodTypeResponse,
  changeGoodTypeStatusRequestSchema,
  createGoodTypeRequestSchema,
  type EditGoodTypeResponse,
  editGoodTypeRequestSchema,
  type GetGoodTypeResponse,
} from '@repo/admin-api-types';
import { paginationRequestSchema } from '@repo/common-types';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import {
  changeGoodTypeStatus,
  createGoodType,
  deleteGoodType,
  editGoodType,
  getGoodType,
  paginationGoodTypes,
} from '../services/good-type-service.js';
import type { Variables } from '../types/context.js';
import { canAccess } from '../utils/role-access-util.js';

const goodTypeHandler = new Hono<{ Variables: Variables }>();

goodTypeHandler.post(
  '/',
  validator('json', (value, c) => {
    const parsed = createGoodTypeRequestSchema.safeParse(value);
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
    canAccess(c, 'good-type:add');
    const body = c.req.valid('json');
    const goodType = await createGoodType(body);
    return c.json({
      id: goodType.id,
    } as CreateGoodTypeResponse);
  },
);

goodTypeHandler.get(
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
    canAccess(c, 'good-type:list');
    const query = c.req.valid('query');
    return c.json(await paginationGoodTypes(query));
  },
);

goodTypeHandler.get('/:id', async (c) => {
  canAccess(c, 'good-type:edit');
  const { id } = c.req.param();
  const goodType = await getGoodType(id);
  return c.json({
    id: goodType.id,
    title: goodType.title,
    status: goodType.status,
    description: goodType.description ?? '',
    createdAt: goodType.createdAt.getTime(),
  } as GetGoodTypeResponse);
});

goodTypeHandler.put(
  '/:id',
  validator('json', (value, c) => {
    const parsed = editGoodTypeRequestSchema.safeParse(value);
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
    canAccess(c, 'good-type:edit');
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const goodType = await editGoodType(id, body);
    return c.json({
      id: goodType.id,
    } as EditGoodTypeResponse);
  },
);

goodTypeHandler.delete('/:id', async (c) => {
  canAccess(c, 'good-type:delete');
  const { id } = c.req.param();
  await deleteGoodType(id);
  return c.json({});
});

goodTypeHandler.patch(
  '/:id/status',
  validator('json', (value, c) => {
    const parsed = changeGoodTypeStatusRequestSchema.safeParse(value);
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
    canAccess(c, 'good-type:edit');
    const { id } = c.req.param();
    const body = c.req.valid('json');
    await changeGoodTypeStatus(id, body.status);
    return c.json({});
  },
);
export default goodTypeHandler;
