import type { GetCaptchaResponse } from '@repo/admin-api-types';

export const getCaptcha = async () => {
  const response = await fetch('/admin/login/code');
  const data = (await response.json()) as GetCaptchaResponse;
  return data.data;
};
