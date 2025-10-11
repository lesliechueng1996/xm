import z from 'zod';

export type GetCaptchaResponse = {
  data: string;
};

export const loginRequestSchema = z.object({
  username: z.string('管理员姓名应该是非空字符串'),
  password: z.string('管理员密码应该是非空字符串'),
  captcha: z.string('验证码应该是非空字符串'),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export type LoginResponse = {
  token: string;
};

export type TokenPayload = {
  sub: string;
  role: string;
  isSuper: number;
  iat: number;
  nbf: number;
  iss: string;
  exp: number;
  username: string;
};
