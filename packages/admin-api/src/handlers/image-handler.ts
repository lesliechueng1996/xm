import type { SaveImageResponse } from '@repo/admin-api-types';
import { Hono } from 'hono';
import { saveImage } from '../services/image-service.js';
import type { Variables } from '../types/context.js';

const imageHandler = new Hono<{ Variables: Variables }>();

imageHandler.post('/', async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;
  if (!file) {
    return c.json({ message: '文件不能为空' }, 400);
  }
  const relativePath = await saveImage(file);
  return c.json({
    relativePath,
  } as SaveImageResponse);
});

export default imageHandler;
