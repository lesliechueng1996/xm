import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { isTokenValid } from '@/utils/token-util';

const AuthenticatedLayout = () => {
  return <Outlet />;
};

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ location }) => {
    const token = localStorage.getItem('token');
    if (!isTokenValid(token)) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
