import type { GetCaptchaResponse, LoginResponse } from '@repo/admin-api-types';

export const getCaptcha = async () => {
  const response = await fetch('/admin/login/code');
  const data = (await response.json()) as GetCaptchaResponse;
  return data.data;
};

export const login = async (
  username: string,
  password: string,
  captcha: string,
) => {
  const response = await fetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, captcha }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return (data as LoginResponse).token;
};
