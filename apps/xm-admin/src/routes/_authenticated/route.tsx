import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

const AuthenticatedLayout = () => {
  return <Outlet />;
};

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ location }) => {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    });
  },
});
