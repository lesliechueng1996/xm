import type {
  GetCaptchaResponse,
  LoginRequest,
  LoginResponse,
} from '@repo/admin-api-types';
import { Hono } from 'hono';
import { generateCaptcha } from '../services/captcha-service.js';
import { adminLogin } from '../services/login-service.js';

const loginHandler = new Hono();

loginHandler.get('/code', (c) => {
  const captcha = generateCaptcha();
  return c.json({
    data: captcha.data,
  } as GetCaptchaResponse);
});

loginHandler.post('/', async (c) => {
  const body = await c.req.json<LoginRequest>();
  const token = await adminLogin(body.username, body.password);
  return c.json({
    token,
  } as LoginResponse);
});

export default loginHandler;
