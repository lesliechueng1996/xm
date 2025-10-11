import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { isTokenValid } from '@/utils/token-util';
import Header from './-components/Header';

const AuthenticatedLayout = () => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4">
        <Outlet />
      </main>
    </div>
  );
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
