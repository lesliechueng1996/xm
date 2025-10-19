import {
  type CreateFocusResponse,
  createFocusRequestSchema,
  type EditFocusResponse,
  editFocusRequestSchema,
  type GetFocusResponse,
  type PaginationFocusesResponse,
} from '@repo/admin-api-types';
import { paginationRequestSchema } from '@repo/common-types';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import {
  createFocus,
  deleteFocus,
  editFocus,
  getFocus,
  paginationFocuses,
} from '../services/focus-service.js';
import type { Variables } from '../types/context.js';
import { canAccess } from '../utils/role-access-util.js';

const focusHandler = new Hono<{ Variables: Variables }>();

focusHandler.post(
  '/',
  validator('json', (value, c) => {
    const parsed = createFocusRequestSchema.safeParse(value);
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
    canAccess(c, 'focus:add');
    const body = c.req.valid('json');
    const request = createFocusRequestSchema.parse(body);
    const focus = await createFocus(request);
    return c.json({
      id: focus.id,
    } as CreateFocusResponse);
  },
);

focusHandler.get(
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
    canAccess(c, 'focus:list');
    const query = c.req.valid('query');
    const result: PaginationFocusesResponse = await paginationFocuses(query);
    return c.json(result);
  },
);

focusHandler.get('/:id', async (c) => {
  canAccess(c, 'focus:edit');
  const id = c.req.param('id');
  const focus: GetFocusResponse = await getFocus(id);
  return c.json(focus);
});

focusHandler.put(
  '/:id',
  validator('json', (value, c) => {
    const parsed = editFocusRequestSchema.safeParse(value);
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
    canAccess(c, 'focus:edit');
    const id = c.req.param('id');
    const body = c.req.valid('json');
    const focus = await editFocus(id, body);
    return c.json({
      id: focus.id,
    } as EditFocusResponse);
  },
);

focusHandler.delete('/:id', async (c) => {
  canAccess(c, 'focus:delete');
  const id = c.req.param('id');
  await deleteFocus(id);
  return c.json({});
});

export default focusHandler;
