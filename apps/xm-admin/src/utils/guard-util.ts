import { redirect } from '@tanstack/react-router';
import type { RouterContext } from '@/types/router-context';

export const beforeLoadGuard =
  (pageKey: string) =>
  ({ context }: { context: RouterContext }) => {
    const { accessKeys, isSuper } = context;
    if (isSuper === 1) {
      return;
    }
    if (accessKeys.includes(pageKey)) {
      return;
    }
    throw redirect({
      to: '/403',
    });
  };
