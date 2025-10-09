import { createFileRoute } from '@tanstack/react-router';

const LoginPage = () => {
  return <div>LoginPage</div>;
};

export const Route = createFileRoute('/login')({ component: LoginPage });
