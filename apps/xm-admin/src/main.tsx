import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import './index.css';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import UserProvider from './providers/UserProvider';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </HeroUIProvider>
    </StrictMode>,
  );
}
