import {
  type CreateGoodTypeAttrResponse,
  changeGoodTypeAttrStatusRequestSchema,
  createGoodTypeAttrRequestSchema,
  paginationGoodTypeAttrsRequestSchema,
} from '@repo/admin-api-types';
import { GoodTypeAttrType } from '@repo/common-types';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import {
  changeGoodTypeAttrStatus,
  createGoodTypeAttr,
  deleteGoodTypeAttr,
  paginationGoodTypeAttrs,
} from '../services/good-type-attr-service.js';
import type { Variables } from '../types/context.js';
import { canAccess } from '../utils/role-access-util.js';

const goodTypeAttrHandler = new Hono<{ Variables: Variables }>();

goodTypeAttrHandler.get(
  '/',
  validator('query', (value, c) => {
    const parsed = paginationGoodTypeAttrsRequestSchema.safeParse(value);
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
    canAccess(c, 'good-type-attr:list');
    const query = c.req.valid('query');
    return c.json(await paginationGoodTypeAttrs(query));
  },
);

goodTypeAttrHandler.post(
  '/',
  validator('json', (value, c) => {
    const parsed = createGoodTypeAttrRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          message: z.prettifyError(parsed.error),
        },
        400,
      );
    }
    if (
      parsed.data.attrType === GoodTypeAttrType.SELECT &&
      !parsed.data.attrValue
    ) {
      return c.json(
        {
          message: '可选值列表不能为空',
        },
        400,
      );
    }
    if (
      parsed.data.attrType === GoodTypeAttrType.SELECT &&
      parsed.data.attrValue &&
      parsed.data.attrValue.split('\n').length < 2
    ) {
      return c.json(
        {
          message: '可选值列表不能少于2行',
        },
        400,
      );
    }
    return parsed.data;
  }),
  async (c) => {
    canAccess(c, 'good-type-attr:add');
    const body = c.req.valid('json');
    const goodTypeAttr = await createGoodTypeAttr(body);
    return c.json({
      id: goodTypeAttr.id,
    } as CreateGoodTypeAttrResponse);
  },
);

goodTypeAttrHandler.delete('/:id', async (c) => {
  canAccess(c, 'good-type-attr:delete');
  const id = c.req.param('id');
  await deleteGoodTypeAttr(id);
  return c.json({});
});

goodTypeAttrHandler.patch(
  '/:id/status',
  validator('json', (value, c) => {
    const parsed = changeGoodTypeAttrStatusRequestSchema.safeParse(value);
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
    canAccess(c, 'good-type-attr:edit');
    const { id } = c.req.param();
    const body = c.req.valid('json');
    await changeGoodTypeAttrStatus(id, body.status);
    return c.json({});
  },
);

export default goodTypeAttrHandler;
