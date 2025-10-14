import {
  type CreateAccessResponse,
  type EditAccessResponse,
  createAccessRequestSchema,
  editAccessRequestSchema,
  getAccessOptionsRequestSchema,
} from '@repo/admin-api-types';
import { AdminAccessType } from '@repo/common-types';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import {
  createAccess,
  deleteAccess,
  editAccess,
  getAccess,
  getAccessOptions,
  getAllAccesses,
} from '../services/admin-access-service.js';

const accessHandler = new Hono();

accessHandler.post(
  '/',
  validator('json', (value, c) => {
    const parsed = createAccessRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          message: z.prettifyError(parsed.error),
        },
        400,
      );
    }
    const data = parsed.data;
    if (
      data.type === AdminAccessType.MENU ||
      data.type === AdminAccessType.OPERATION
    ) {
      if (!data.url) {
        return c.json(
          {
            message: '权限地址不能为空',
          },
          400,
        );
      }
      if (!data.parentId) {
        return c.json(
          {
            message: '父级权限不能为空',
          },
          400,
        );
      }
    }
    return data;
  }),
  async (c) => {
    const body = c.req.valid('json');
    const access = await createAccess(body);
    return c.json({
      id: access.id,
    } as CreateAccessResponse);
  },
);

accessHandler.get(
  '/options',
  validator('query', (value, c) => {
    const parsed = getAccessOptionsRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(
        {
          message: z.prettifyError(parsed.error),
        },
        400,
      );
    }
    const type = parsed.data.type;
    if (type !== AdminAccessType.MODULE && type !== AdminAccessType.MENU) {
      return c.json(
        {
          message: '权限类型不合法',
        },
        400,
      );
    }
    return parsed.data;
  }),
  async (c) => {
    const query = c.req.valid('query');
    const options = await getAccessOptions(query.type);
    return c.json(options);
  },
);

accessHandler.get('/', async (c) => {
  const accesses = await getAllAccesses();
  return c.json(accesses);
});

accessHandler.get('/:id', async (c) => {
  const { id } = c.req.param();
  const access = await getAccess(id);
  return c.json(access);
});

accessHandler.put(
  '/:id',
  validator('json', (value, c) => {
    const parsed = editAccessRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 400);
    }
    return parsed.data;
  }),
  async (c) => {
    const { id } = c.req.param();
    const data = c.req.valid('json');
    const access = await editAccess(id, data);
    return c.json({
      id: access.id,
    } as EditAccessResponse);
  },
);

accessHandler.delete('/:id', async (c) => {
  const { id } = c.req.param();
  await deleteAccess(id);
  return c.json({});
});

export default accessHandler;
