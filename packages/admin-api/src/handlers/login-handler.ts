import type { GetCaptchaResponse, LoginResponse } from '@repo/admin-api-types';
import { loginRequestSchema } from '@repo/admin-api-types';
import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { z } from 'zod';
import { generateCaptcha } from '../services/captcha-service.js';
import { adminLogin } from '../services/login-service.js';

const loginHandler = new Hono();

loginHandler.get('/code', (c) => {
  const captcha = generateCaptcha();
  return c.json({
    data: captcha.data,
  } as GetCaptchaResponse);
});

loginHandler.post(
  '/',
  validator('json', (value, c) => {
    const parsed = loginRequestSchema.safeParse(value);
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
    const token = await adminLogin(body.username, body.password);
    return c.json({
      token,
    } as LoginResponse);
  },
);

export default loginHandler;
