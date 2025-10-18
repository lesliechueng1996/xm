import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import adminApi from '@repo/admin-api';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';

const app = new Hono();

app.use(logger());
app.use(requestId());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.use(
  '/static/*',
  serveStatic({
    root: './',
  }),
);

app.route('/admin', adminApi);

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    console.log(error.message);
    return c.json(
      {
        message: error.message,
      },
      error.status,
    );
  }

  console.log(error);
  return c.json(
    {
      message: 'Internal Server Error',
    },
    500,
  );
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
