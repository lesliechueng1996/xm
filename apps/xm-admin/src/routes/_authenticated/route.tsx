import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { isTokenValid } from '@/utils/token-util';
import Header from './-components/Header';
import Sidebar from './-components/Sidebar';

const AuthenticatedLayout = () => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex-grow flex">
        <Sidebar />
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
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
