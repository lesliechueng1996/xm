import { createFileRoute } from '@tanstack/react-router';

const LoginPage = () => {
  return (
    <div className="h-screen w-screen bg-[url(/images/login-bg.jpg)] bg-cover bg-no-repeat">
      Login
    </div>
  );
};

export const Route = createFileRoute('/login')({ component: LoginPage });
