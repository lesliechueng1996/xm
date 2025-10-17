import { Hono } from 'hono';
import { getUserMenus } from '../services/admin-user-service.js';
import type { Variables } from '../types/context.js';

const menuHandler = new Hono<{ Variables: Variables }>();

menuHandler.get('/', async (c) => {
  const userId = c.get('userId');
  const menus = await getUserMenus(userId);
  return c.json(menus);
});

export default menuHandler;
