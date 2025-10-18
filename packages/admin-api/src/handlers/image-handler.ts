import type { SaveImageResponse } from '@repo/admin-api-types';
import { Hono } from 'hono';
import { saveImage } from '../services/image-service.js';
import type { Variables } from '../types/context.js';
import path from 'node:path';

const imageHandler = new Hono<{ Variables: Variables }>();

imageHandler.post('/', async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;
  if (!file) {
    return c.json({ message: '文件不能为空' }, 400);
  }
  if (file.size > 10 * 1024 * 1024) {
    return c.json({ message: '文件大小不能超过10MB' }, 400);
  }
  const ext = path.extname(file.name);
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
    return c.json({ message: '文件类型错误, 支持jpg, jpeg, png格式' }, 400);
  }
  const relativePath = await saveImage(file);
  return c.json({
    relativePath,
  } as SaveImageResponse);
});

export default imageHandler;
