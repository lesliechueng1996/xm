import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import './index.css';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { AdminType } from '@repo/common-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUser from './hooks/useUser';
import UserProvider from './providers/UserProvider';
import type { RouterContext } from './types/router-context';

const router = createRouter({
  routeTree,
  context: {
    accessKeys: [],
    isSuper: AdminType.USER,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const InnerApp = () => {
  const { user } = useUser();

  const context: RouterContext = {
    accessKeys: user?.accessKeys ?? [],
    isSuper: user?.isSuper ?? AdminType.USER,
  };

  return <RouterProvider router={router} context={context} />;
};

const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <InnerApp />
          </UserProvider>
        </QueryClientProvider>
      </HeroUIProvider>
    </StrictMode>,
  );
}
