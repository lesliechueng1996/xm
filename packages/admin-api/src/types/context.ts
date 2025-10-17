import type { JwtVariables } from 'hono/jwt';

export type Variables = JwtVariables & {
  isSuper: number;
  accessKeys: string[];
  userId: string;
};
