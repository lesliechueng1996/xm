import { Hono } from 'hono';
import loginHandler from './handlers/login-handler.js';

const adminApi = new Hono();

adminApi.route('/login', loginHandler);
export default adminApi;
