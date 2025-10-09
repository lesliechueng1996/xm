import type { GetCaptchaResponse } from '@repo/admin-api-types';
import { Hono } from 'hono';
import { generateCaptcha } from '../services/captcha-service.js';

const loginHandler = new Hono();

loginHandler.get('/code', (c) => {
  const captcha = generateCaptcha();
  return c.json({
    data: captcha.data,
  } as GetCaptchaResponse);
});

export default loginHandler;
