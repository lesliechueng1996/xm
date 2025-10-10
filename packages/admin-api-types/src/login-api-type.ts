export type GetCaptchaResponse = {
  data: string;
};

export type LoginRequest = {
  username: string;
  password: string;
  captcha: string;
};

export type LoginResponse = {
  token: string;
};
