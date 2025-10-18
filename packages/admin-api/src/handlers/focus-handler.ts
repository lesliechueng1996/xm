import {
  type CreateFocusResponse,
  createFocusRequestSchema,
} from '@repo/admin-api-types';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import { createFocus } from '../services/focus-service.js';
import type { Variables } from '../types/context.js';

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
    const body = c.req.valid('json');
    const request = createFocusRequestSchema.parse(body);
    const focus = await createFocus(request);
    return c.json({
      id: focus.id,
    } as CreateFocusResponse);
  },
);

export default focusHandler;
