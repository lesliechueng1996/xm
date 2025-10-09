import { Hono } from 'hono';

const adminApi = new Hono();

adminApi.get('/', (c) => {
  return c.text('Hello admin!!');
});

export default adminApi;
